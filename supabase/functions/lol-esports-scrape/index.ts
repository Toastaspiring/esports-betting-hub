
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

// Create a Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface League {
  id: string;
  name: string;
  region: string;
  logo: string;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  league_id?: string;
}

interface Match {
  league_id: string;
  team_a_id: string;
  team_b_id: string;
  match_date: string;
  odds_team_a: number;
  odds_team_b: number;
  status: 'upcoming' | 'live' | 'completed';
}

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get parameters from request body
    const { region, language = 'en-US' } = await req.json();
    const baseUrl = `https://lolesports.com/${language}/leagues/`;
    const url = region ? `${baseUrl}${region}` : baseUrl;

    console.log(`Scraping LoL Esports: ${url}`);

    // Fetch HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    
    // Load HTML into Cheerio
    const $ = load(html);
    
    // Data structures to store results
    const leagues: League[] = [];
    const teams: Team[] = [];
    const matches: Match[] = [];
    
    // Extract league data
    $('.league-header').each((i, el) => {
      const leagueName = $(el).find('.league-name').text().trim();
      const leagueRegion = $(el).find('.league-region').text().trim();
      const leagueLogo = $(el).find('img').attr('src') || '';
      
      // Generate a unique ID for the league
      const leagueId = crypto.randomUUID();
      
      leagues.push({
        id: leagueId,
        name: leagueName,
        region: leagueRegion,
        logo: leagueLogo
      });
      
      // Extract teams for this league
      $(el).siblings('.league-teams').find('.team').each((j, teamEl) => {
        const teamName = $(teamEl).find('.team-name').text().trim();
        const teamLogo = $(teamEl).find('img').attr('src') || '';
        
        // Generate a unique ID for the team
        const teamId = crypto.randomUUID();
        
        teams.push({
          id: teamId,
          name: teamName,
          logo: teamLogo,
          league_id: leagueId
        });
      });
      
      // Extract matches for this league
      $(el).siblings('.league-matches').find('.match').each((j, matchEl) => {
        const teamA = $(matchEl).find('.team-a').text().trim();
        const teamB = $(matchEl).find('.team-b').text().trim();
        
        // Find team IDs
        const teamAData = teams.find(t => t.name === teamA && t.league_id === leagueId);
        const teamBData = teams.find(t => t.name === teamB && t.league_id === leagueId);
        
        if (!teamAData || !teamBData) return;
        
        const matchDate = $(matchEl).find('.match-date').attr('data-timestamp') || new Date().toISOString();
        const status = $(matchEl).hasClass('live') ? 'live' : 
                      ($(matchEl).hasClass('completed') ? 'completed' : 'upcoming');
        
        // Calculate random odds (in a real implementation, these would come from the source)
        const baseOdds = 1.5;
        const oddsTeamA = Math.round((baseOdds + Math.random() * 1.5) * 100) / 100;
        const oddsTeamB = Math.round((baseOdds + Math.random() * 1.5) * 100) / 100;
        
        matches.push({
          league_id: leagueId,
          team_a_id: teamAData.id,
          team_b_id: teamBData.id,
          match_date: matchDate,
          odds_team_a: oddsTeamA,
          odds_team_b: oddsTeamB,
          status: status as 'upcoming' | 'live' | 'completed'
        });
      });
    });
    
    // If scraping returned no data, try to parse metadata from the page
    if (leagues.length === 0) {
      console.log("Standard scraping yielded no results, trying to parse JSON from scripts");
      
      // Some sites load data via JavaScript, look for data in script tags
      const scripts = $('script').toArray();
      for (const script of scripts) {
        const content = $(script).html() || '';
        if (content.includes('leagueData') || content.includes('matchData')) {
          try {
            // Look for patterns like "window.leagueData = {...}" or "var matchData = {...}"
            const dataMatch = content.match(/(?:window\.|var\s+)(?:leagueData|matchData)\s*=\s*(\{[\s\S]*?\});/);
            if (dataMatch && dataMatch[1]) {
              const parsedData = JSON.parse(dataMatch[1]);
              console.log("Found embedded JSON data:", Object.keys(parsedData));
              // Process the extracted JSON data
              // This would require custom parsing logic specific to the site's data structure
            }
          } catch (e) {
            console.error("Error parsing script content:", e);
          }
        }
      }
    }

    // Log results
    console.log(`Scraped ${leagues.length} leagues, ${teams.length} teams, ${matches.length} matches`);
    
    // Optional: Store results in Supabase database
    if (leagues.length > 0) {
      // Insert leagues
      const { data: insertedLeagues, error: leaguesError } = await supabase
        .from('leagues')
        .upsert(leagues, { onConflict: 'name' })
        .select();
        
      if (leaguesError) {
        console.error("Error inserting leagues:", leaguesError);
      } else {
        console.log(`Inserted ${insertedLeagues?.length || 0} leagues`);
      }
      
      // Insert teams
      const { data: insertedTeams, error: teamsError } = await supabase
        .from('teams')
        .upsert(teams, { onConflict: 'name' })
        .select();
        
      if (teamsError) {
        console.error("Error inserting teams:", teamsError);
      } else {
        console.log(`Inserted ${insertedTeams?.length || 0} teams`);
      }
      
      // Insert matches
      const { data: insertedMatches, error: matchesError } = await supabase
        .from('matches')
        .upsert(matches)
        .select();
        
      if (matchesError) {
        console.error("Error inserting matches:", matchesError);
      } else {
        console.log(`Inserted ${insertedMatches?.length || 0} matches`);
      }
    }
    
    // Return the scraped data
    return new Response(
      JSON.stringify({ 
        success: true, 
        leagues, 
        teams, 
        matches,
        message: `Successfully scraped ${leagues.length} leagues, ${teams.length} teams, and ${matches.length} matches.`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error scraping LoL Esports:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to scrape LoL Esports data" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
