
import { serve } from "https://deno.land/std@0.188.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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
    const { endpoint = "upcoming_matches", importType } = await req.json().catch(() => ({}));

    console.log(`Processing ${importType || endpoint} import request`);

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

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Liquipedia API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function importMatches(supabase: any) {
  // Get upcoming and ongoing matches
  const data = await callLiquipediaAPI("upcoming_matches", {
    action: "parse",
    page: "Liquipedia:Upcoming_and_ongoing_matches",
    prop: "text",
  });

  // This is simplified - in reality you'd need to parse the HTML content
  // from data.parse.text['*'] to extract structured match information
  const htmlContent = data.parse.text['*'];
  
  // For demonstration, let's extract some basic match info using regex
  // In a production app, use a proper HTML parser
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
        status: 'upcoming'
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
}

async function importTeams(supabase: any) {
  // This would fetch teams from Liquipedia
  // For demonstration, let's import some top teams
  const topTeams = [
    { name: 'T1', region: 'LCK', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/T1_logo.svg/1200px-T1_logo.svg.png', win_rate: 0.85 },
    { name: 'Gen.G', region: 'LCK', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Gen.G_logo.svg/1200px-Gen.G_logo.svg.png', win_rate: 0.75 },
    { name: 'JDG Intelligence', region: 'LPL', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/JD_Gaming_logo.svg/1200px-JD_Gaming_logo.svg.png', win_rate: 0.82 },
    { name: 'Bilibili Gaming', region: 'LPL', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Bilibili_Gaming_logo.svg/1200px-Bilibili_Gaming_logo.svg.png', win_rate: 0.72 },
    { name: 'G2 Esports', region: 'LEC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Esports_organization_G2_Esports_logo.svg/1200px-Esports_organization_G2_Esports_logo.svg.png', win_rate: 0.78 },
    { name: 'Fnatic', region: 'LEC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1200px-Esports_organization_Fnatic_logo.svg.png', win_rate: 0.65 },
    { name: 'Cloud9', region: 'LCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Cloud9_logo.svg/1200px-Cloud9_logo.svg.png', win_rate: 0.68 },
    { name: 'Team Liquid', region: 'LCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Team_liquid_logo.svg/1200px-Team_liquid_logo.svg.png', win_rate: 0.63 },
  ];
  
  let importedCount = 0;
  
  for (const team of topTeams) {
    // Get or create league
    const league = await getOrCreateLeague(supabase, team.region);
    
    // Check if team exists
    const { data: existingTeams } = await supabase
      .from('teams')
      .select('id')
      .eq('name', team.name)
      .limit(1);
      
    if (existingTeams && existingTeams.length > 0) {
      console.log(`Team ${team.name} already exists`);
      continue;
    }
    
    // Create team
    const { error } = await supabase
      .from('teams')
      .insert({
        name: team.name,
        logo: team.logo,
        league_id: league.id,
        win_rate: team.win_rate
      });
      
    if (error) {
      console.error(`Error creating team: ${error.message}`);
    } else {
      importedCount++;
    }
  }
  
  return { 
    success: true, 
    message: `Imported ${importedCount} new teams`,
    total: topTeams.length,
    imported: importedCount
  };
}

async function importTournaments(supabase: any) {
  // This would fetch tournaments from Liquipedia
  // For demonstration, importing major leagues
  const majorLeagues = [
    { name: 'LCK', region: 'Korea', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/LCK_logo.svg/1200px-LCK_logo.svg.png' },
    { name: 'LPL', region: 'China', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/League_of_Legends_Pro_League_logo.svg/1200px-League_of_Legends_Pro_League_logo.svg.png' },
    { name: 'LEC', region: 'Europe', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/LEC_2019_Logo.svg/1200px-LEC_2019_Logo.svg.png' },
    { name: 'LCS', region: 'North America', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/LCS_2023_logo.svg/1200px-LCS_2023_logo.svg.png' },
    { name: 'Worlds', region: 'International', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/2023_LoL_Esports_World_Championship_logo.svg/1200px-2023_LoL_Esports_World_Championship_logo.svg.png' },
    { name: 'MSI', region: 'International', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/2024_LoL_Mid-Season_Invitational_logo.svg/1200px-2024_LoL_Mid-Season_Invitational_logo.svg.png' },
  ];
  
  let importedCount = 0;
  
  for (const league of majorLeagues) {
    // Check if league exists
    const { data: existingLeagues } = await supabase
      .from('leagues')
      .select('id')
      .eq('name', league.name)
      .limit(1);
      
    if (existingLeagues && existingLeagues.length > 0) {
      console.log(`League ${league.name} already exists`);
      continue;
    }
    
    // Create league
    const { error } = await supabase
      .from('leagues')
      .insert({
        name: league.name,
        logo: league.logo,
        region: league.region
      });
      
    if (error) {
      console.error(`Error creating league: ${error.message}`);
    } else {
      importedCount++;
    }
  }
  
  return { 
    success: true, 
    message: `Imported ${importedCount} new leagues/tournaments`,
    total: majorLeagues.length,
    imported: importedCount
  };
}

async function importPlayers(supabase: any) {
  // This would fetch pro players from Liquipedia
  // In a real implementation, this would parse player pages
  return { 
    success: true, 
    message: "Player import not implemented yet",
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
  // This is a simplified version - in reality, use a proper HTML parser
  // For demonstration purposes only
  
  // Example matches
  const demoMatches = [
    {
      teamA: { name: 'T1', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/T1_logo.svg/1200px-T1_logo.svg.png' },
      teamB: { name: 'Gen.G', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Gen.G_logo.svg/1200px-Gen.G_logo.svg.png' },
      tournament: 'LCK Summer 2024',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    },
    {
      teamA: { name: 'JDG Intelligence', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/JD_Gaming_logo.svg/1200px-JD_Gaming_logo.svg.png' },
      teamB: { name: 'Bilibili Gaming', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Bilibili_Gaming_logo.svg/1200px-Bilibili_Gaming_logo.svg.png' },
      tournament: 'LPL Summer 2024',
      date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    },
    {
      teamA: { name: 'G2 Esports', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Esports_organization_G2_Esports_logo.svg/1200px-Esports_organization_G2_Esports_logo.svg.png' },
      teamB: { name: 'Fnatic', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1200px-Esports_organization_Fnatic_logo.svg.png' },
      tournament: 'LEC Summer 2024',
      date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    },
  ];
  
  return demoMatches;
}
