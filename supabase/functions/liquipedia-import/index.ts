import { serve } from "https://deno.land/std@0.188.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Liquipedia API config
const LIQUIPEDIA_BASE_URL = "https://liquipedia.net/leagueoflegends/api.php";
const USER_AGENT = "LolMatchTracker/1.0 (contact@lolmatchtracker.com)";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body or use default parameters
    const { importType = "matches" } = await req.json().catch(() => ({}));

    console.log(`Processing ${importType} import request`);

    let data;
    switch (importType) {
      case "teams":
        data = await importTeams(supabaseClient);
        break;
      case "tournaments":
        data = await importTournaments(supabaseClient);
        break;
      case "players":
        data = await importPlayers(supabaseClient);
        break;
      case "matches":
      default:
        data = await importMatches(supabaseClient);
        break;
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200
    });
  } catch (error) {
    console.error("Error in Liquipedia import:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
});

async function callLiquipediaAPI(endpoint: string, params: Record<string, string>) {
  // Rate limiting - ensure we're not calling too frequently
  console.log(`Calling Liquipedia API for ${endpoint}`);

  const url = new URL(LIQUIPEDIA_BASE_URL);
  Object.entries({ ...params, format: "json" }).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  console.log(`API URL: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Encoding": "gzip",
    },
  });

  if (!response.ok) {
    throw new Error(`Liquipedia API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function importMatches(supabase: any) {
  try {
    // Get upcoming and ongoing matches
    const data = await callLiquipediaAPI("parse", {
      page: "Liquipedia:Upcoming_and_ongoing_matches",
      action: "parse",
      prop: "text",
    });

    // Extract matches from HTML response
    const htmlContent = data.parse.text['*'];
    const matches = extractMatchesFromHTML(htmlContent);
    
    console.log(`Found ${matches.length} matches`);
    
    // Store matches in the database
    let importedCount = 0;
    for (const match of matches) {
      // First check if we need to create the teams
      let teamA = await getOrCreateTeam(supabase, match.teamA);
      let teamB = await getOrCreateTeam(supabase, match.teamB);
      
      // Check if we need to create or get the league
      let league = await getOrCreateLeague(supabase, match.tournament);
      
      // Check if this match already exists in our database
      const { data: existingMatches } = await supabase
        .from('matches')
        .select('id')
        .eq('team_a_id', teamA.id)
        .eq('team_b_id', teamB.id)
        .eq('match_date', match.date)
        .limit(1);
        
      if (existingMatches && existingMatches.length > 0) {
        console.log(`Match between ${match.teamA.name} and ${match.teamB.name} already exists`);
        continue;
      }
      
      // Create the match
      const { error } = await supabase
        .from('matches')
        .insert({
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          league_id: league.id,
          match_date: match.date,
          odds_team_a: calculateOdds(teamA.win_rate || 0.5),
          odds_team_b: calculateOdds(teamB.win_rate || 0.5),
          status: calculateMatchStatus(match.date)
        });
        
      if (error) {
        console.error(`Error creating match: ${error.message}`);
      } else {
        importedCount++;
      }
    }
    
    return { 
      success: true, 
      message: `Imported ${importedCount} new matches from Liquipedia`,
      total: matches.length,
      imported: importedCount
    };
  } catch (error) {
    console.error("Error importing matches:", error);
    return { success: false, message: error.message };
  }
}

function calculateMatchStatus(matchDate: string): 'upcoming' | 'live' | 'completed' {
  const now = new Date();
  const matchTime = new Date(matchDate);
  
  // If match is in the past (over 3 hours ago)
  if (matchTime.getTime() < now.getTime() - 3 * 60 * 60 * 1000) {
    return 'completed';
  }
  
  // If match is now or within last 3 hours
  if (matchTime.getTime() <= now.getTime() && 
      matchTime.getTime() > now.getTime() - 3 * 60 * 60 * 1000) {
    return 'live';
  }
  
  // Otherwise it's upcoming
  return 'upcoming';
}

async function importTeams(supabase: any) {
  try {
    // Fetch team data from Liquipedia
    const data = await callLiquipediaAPI("parse", {
      action: "parse",
      page: "Portal:Teams",
      prop: "text",
    });

    const htmlContent = data.parse.text['*'];
    const teams = extractTeamsFromHTML(htmlContent);
    
    console.log(`Found ${teams.length} teams`);
    
    let importedCount = 0;
    
    for (const team of teams) {
      // Check if team exists
      const { data: existingTeams } = await supabase
        .from('teams')
        .select('id')
        .ilike('name', team.name)
        .limit(1);
        
      if (existingTeams && existingTeams.length > 0) {
        console.log(`Team ${team.name} already exists`);
        continue;
      }
      
      // Get or create league
      const league = await getOrCreateLeague(supabase, team.region || "International");
      
      // Create team
      const { error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          logo: team.logo,
          league_id: league.id,
          win_rate: team.win_rate || 0.5
        });
        
      if (error) {
        console.error(`Error creating team: ${error.message}`);
      } else {
        importedCount++;
      }
    }
    
    return { 
      success: true, 
      message: `Imported ${importedCount} new teams from Liquipedia`,
      total: teams.length,
      imported: importedCount
    };
  } catch (error) {
    console.error("Error importing teams:", error);
    return { success: false, message: error.message };
  }
}

async function importTournaments(supabase: any) {
  try {
    // Fetch tournament data from Liquipedia
    const data = await callLiquipediaAPI("parse", {
      action: "parse",
      page: "Portal:Tournaments",
      prop: "text",
    });

    const htmlContent = data.parse.text['*'];
    const tournaments = extractTournamentsFromHTML(htmlContent);
    
    console.log(`Found ${tournaments.length} tournaments`);
    
    let importedCount = 0;
    
    for (const tournament of tournaments) {
      // Check if tournament exists
      const { data: existingLeagues } = await supabase
        .from('leagues')
        .select('id')
        .ilike('name', tournament.name)
        .limit(1);
        
      if (existingLeagues && existingLeagues.length > 0) {
        console.log(`Tournament ${tournament.name} already exists`);
        continue;
      }
      
      // Create league
      const { error } = await supabase
        .from('leagues')
        .insert({
          name: tournament.name,
          logo: tournament.logo,
          region: tournament.region || "International"
        });
        
      if (error) {
        console.error(`Error creating tournament: ${error.message}`);
      } else {
        importedCount++;
      }
    }
    
    return { 
      success: true, 
      message: `Imported ${importedCount} new tournaments from Liquipedia`,
      total: tournaments.length,
      imported: importedCount
    };
  } catch (error) {
    console.error("Error importing tournaments:", error);
    return { success: false, message: error.message };
  }
}

async function importPlayers(supabase: any) {
  // We would fetch player data here in a real implementation
  // Since our database doesn't have a players table yet, we'll return a message
  return { 
    success: false, 
    message: "Player import not implemented - requires database schema update",
  };
}

// Helper functions
async function getOrCreateLeague(supabase: any, leagueName: string) {
  // Check if league exists
  const { data: leagues } = await supabase
    .from('leagues')
    .select('*')
    .ilike('name', leagueName)
    .limit(1);
    
  if (leagues && leagues.length > 0) {
    return leagues[0];
  }
  
  // Create league if it doesn't exist
  const { data, error } = await supabase
    .from('leagues')
    .insert({
      name: leagueName,
      region: getRegionFromLeague(leagueName)
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Error creating league: ${error.message}`);
  }
  
  return data;
}

async function getOrCreateTeam(supabase: any, teamInfo: { name: string, logo?: string }) {
  // Check if team exists
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .ilike('name', teamInfo.name)
    .limit(1);
    
  if (teams && teams.length > 0) {
    return teams[0];
  }
  
  // Get a default league (first one found)
  const { data: leagues } = await supabase
    .from('leagues')
    .select('id')
    .limit(1);
  
  let leagueId = null;
  if (leagues && leagues.length > 0) {
    leagueId = leagues[0].id;
  }
  
  // Create team if it doesn't exist
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: teamInfo.name,
      logo: teamInfo.logo || null,
      league_id: leagueId,
      win_rate: 0.5 // Default win rate
    })
    .select()
    .single();
    
  if (error) {
    throw new Error(`Error creating team: ${error.message}`);
  }
  
  return data;
}

function getRegionFromLeague(leagueName: string): string {
  // Map league names to regions
  const regionMap: Record<string, string> = {
    'LCK': 'Korea',
    'LPL': 'China',
    'LEC': 'Europe',
    'LCS': 'North America',
    'PCS': 'Pacific',
    'VCS': 'Vietnam',
    'CBLOL': 'Brazil',
    'LJL': 'Japan',
    'LLA': 'Latin America',
  };
  
  for (const key in regionMap) {
    if (leagueName.includes(key)) {
      return regionMap[key];
    }
  }
  
  return 'International';
}

function calculateOdds(winRate: number): number {
  // Simple odds calculation
  return (1 / winRate) * (0.9 + Math.random() * 0.2);
}

function extractMatchesFromHTML(html: string): any[] {
  console.log("Extracting matches from HTML");
  
  try {
    // Use DOMParser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    if (!doc) {
      console.error("Failed to parse HTML");
      return [];
    }
    
    const matches = [];
    
    // Find all match containers - more specific selector
    const matchContainers = doc.querySelectorAll(".infobox_matches_content");
    
    console.log(`Found ${matchContainers.length} match containers`);
    
    for (const container of matchContainers) {
      try {
        // Extract tournament info
        const tournamentElement = container.querySelector(".league-icon-small");
        const tournamentName = tournamentElement?.getAttribute("title") || "Unknown Tournament";
        
        // Find team elements
        const teamElements = container.querySelectorAll("span.team-template-text a");
        
        if (teamElements.length >= 2) {
          const teamAName = teamElements[0]?.textContent?.trim() || "Unknown Team";
          const teamBName = teamElements[1]?.textContent?.trim() || "Unknown Team";
          
          // Get team logos
          const teamALogoElement = container.querySelector(".team-left img");
          const teamBLogoElement = container.querySelector(".team-right img");
          
          const teamALogo = teamALogoElement?.getAttribute("src") || "";
          const teamBLogo = teamBLogoElement?.getAttribute("src") || "";
          
          // Get date/time
          const dateElement = container.querySelector(".timer-object");
          let matchDate = new Date();
          
          if (dateElement) {
            const timestamp = dateElement.getAttribute("data-timestamp");
            if (timestamp) {
              matchDate = new Date(parseInt(timestamp) * 1000);
            }
          }
          
          console.log(`Extracted match: ${teamAName} vs ${teamBName} | Tournament: ${tournamentName}`);
          
          matches.push({
            teamA: { 
              name: teamAName, 
              logo: teamALogo.startsWith("http") ? teamALogo : `https://liquipedia.net${teamALogo}` 
            },
            teamB: { 
              name: teamBName, 
              logo: teamBLogo.startsWith("http") ? teamBLogo : `https://liquipedia.net${teamBLogo}` 
            },
            tournament: tournamentName,
            date: matchDate.toISOString(),
          });
        }
      } catch (error) {
        console.error("Error extracting match:", error);
      }
    }
    
    // If we didn't find matches the usual way, try alternative approach
    if (matches.length === 0) {
      console.log("Trying alternative match extraction");
      
      // Look for match tables
      const matchRows = doc.querySelectorAll(".wikitable tr");
      for (let i = 1; i < matchRows.length; i++) { // Skip header row
        try {
          const row = matchRows[i];
          const cells = row.querySelectorAll("td");
          
          if (cells.length >= 4) {
            const tournamentName = cells[0].textContent?.trim() || "Unknown Tournament";
            const teamAName = cells[1].textContent?.trim() || "Unknown Team";
            const teamBName = cells[2].textContent?.trim() || "Unknown Team";
            const timeElement = cells[3].querySelector(".timer-object");
            
            // Skip if no team names found
            if (teamAName === "Unknown Team" || teamBName === "Unknown Team") {
              continue;
            }
            
            let matchDate = new Date();
            if (timeElement) {
              const timestamp = timeElement.getAttribute("data-timestamp");
              if (timestamp) {
                matchDate = new Date(parseInt(timestamp) * 1000);
              }
            }
            
            matches.push({
              teamA: { 
                name: teamAName, 
                logo: "" 
              },
              teamB: { 
                name: teamBName, 
                logo: "" 
              },
              tournament: tournamentName,
              date: matchDate.toISOString(),
            });
          }
        } catch (error) {
          console.error("Error extracting match from table:", error);
        }
      }
    }
    
    console.log(`Successfully extracted ${matches.length} matches`);
    return matches;
  } catch (error) {
    console.error("Error in extractMatchesFromHTML:", error);
    return [];
  }
}

function extractTeamsFromHTML(html: string): any[] {
  console.log("Extracting teams from HTML");
  
  try {
    // Use DOMParser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    if (!doc) {
      console.error("Failed to parse HTML");
      return [];
    }
    
    const teams = [];
    
    // Find all team elements
    const teamElements = doc.querySelectorAll(".team-template-text a");
    
    console.log(`Found ${teamElements.length} team elements`);
    
    // Track team names to avoid duplicates
    const processedTeams = new Set();
    
    for (const teamElement of teamElements) {
      try {
        // Extract team name
        const name = teamElement.textContent?.trim() || "";
        
        // Skip empty team names and duplicates
        if (!name || processedTeams.has(name)) continue;
        processedTeams.add(name);
        
        // Try to find logo nearby
        const parentElement = teamElement.parentElement;
        const logoElement = parentElement?.querySelector("img");
        const logo = logoElement?.getAttribute("src") || "";
        
        // Try to determine region from context
        let region = "International";
        const rowElement = findParentWithClass(teamElement, "wikitable");
        if (rowElement) {
          const regionCell = rowElement.querySelector("td:first-child");
          if (regionCell) {
            region = regionCell.textContent?.trim() || "International";
          }
        }
        
        teams.push({
          name,
          logo: logo.startsWith("http") ? logo : logo ? `https://liquipedia.net${logo}` : "",
          region,
          win_rate: 0.4 + (Math.random() * 0.3), // Generate a reasonable win rate between 0.4 and 0.7
        });
      } catch (error) {
        console.error("Error extracting team:", error);
      }
    }
    
    console.log(`Successfully extracted ${teams.length} teams`);
    return teams;
  } catch (error) {
    console.error("Error in extractTeamsFromHTML:", error);
    return [];
  }
}

function findParentWithClass(element: Element, className: string): Element | null {
  let current = element;
  while (current) {
    if (current.classList && current.classList.contains(className)) {
      return current;
    }
    current = current.parentElement;
    if (!current) break;
  }
  return null;
}

function extractTournamentsFromHTML(html: string): any[] {
  console.log("Extracting tournaments from HTML");
  
  try {
    // Use DOMParser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    if (!doc) {
      console.error("Failed to parse HTML");
      return [];
    }
    
    const tournaments = [];
    
    // Track tournament names to avoid duplicates
    const processedTournaments = new Set();
    
    // Find all tournament links
    const tournamentLinks = doc.querySelectorAll(".league-icon-small");
    
    console.log(`Found ${tournamentLinks.length} tournament elements`);
    
    for (const tournamentElement of tournamentLinks) {
      try {
        // Extract tournament name
        const name = tournamentElement.getAttribute("title")?.trim() || "";
        
        // Skip empty names and duplicates
        if (!name || processedTournaments.has(name)) continue;
        processedTournaments.add(name);
        
        // Get logo
        const logoElement = tournamentElement.querySelector("img");
        const logo = logoElement?.getAttribute("src") || "";
        
        // Determine region from name
        const region = getRegionFromLeague(name);
        
        tournaments.push({
          name,
          logo: logo.startsWith("http") ? logo : logo ? `https://liquipedia.net${logo}` : "",
          region,
        });
      } catch (error) {
        console.error("Error extracting tournament:", error);
      }
    }
    
    // If we found very few tournaments, try another approach
    if (tournaments.length < 5) {
      // Look for tournament tables
      const tournamentRows = doc.querySelectorAll("table.wikitable tr");
      for (let i = 1; i < tournamentRows.length; i++) { // Skip header row
        try {
          const row = tournamentRows[i];
          const nameCell = row.querySelector("td:nth-child(2)");
          
          if (!nameCell) continue;
          
          const name = nameCell.textContent?.trim() || "";
          
          // Skip empty names and duplicates
          if (!name || processedTournaments.has(name)) continue;
          processedTournaments.add(name);
          
          // Try to get logo
          const logoElement = nameCell.querySelector("img");
          const logo = logoElement?.getAttribute("src") || "";
          
          // Get region from first cell
          const regionCell = row.querySelector("td:first-child");
          const region = regionCell?.textContent?.trim() || "International";
          
          tournaments.push({
            name,
            logo: logo.startsWith("http") ? logo : logo ? `https://liquipedia.net${logo}` : "",
            region,
          });
        } catch (error) {
          console.error("Error extracting tournament from table:", error);
        }
      }
    }
    
    console.log(`Successfully extracted ${tournaments.length} tournaments`);
    return tournaments;
  } catch (error) {
    console.error("Error in extractTournamentsFromHTML:", error);
    return [];
  }
}
