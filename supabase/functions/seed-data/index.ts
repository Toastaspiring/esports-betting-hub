
import { serve } from 'https://deno.land/std@0.188.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Sample data for seeding
const LEAGUES = [
  {
    name: 'LCK',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/LCK_logo.svg/1200px-LCK_logo.svg.png',
  },
  {
    name: 'LEC',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/LEC_2019_Logo.svg/1200px-LEC_2019_Logo.svg.png',
  },
  {
    name: 'LPL',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/League_of_Legends_Pro_League_logo.svg/1200px-League_of_Legends_Pro_League_logo.svg.png',
  },
  {
    name: 'LCS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/LCS_2023_logo.svg/1200px-LCS_2023_logo.svg.png',
  }
];

const TEAMS = [
  {
    name: 'T1',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/T1_logo.svg/1200px-T1_logo.svg.png',
    win_rate: 0.82
  },
  {
    name: 'G2 Esports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Esports_organization_G2_Esports_logo.svg/1200px-Esports_organization_G2_Esports_logo.svg.png',
    win_rate: 0.71
  },
  {
    name: 'Gen.G',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Gen.G_logo.svg/1200px-Gen.G_logo.svg.png',
    win_rate: 0.68
  },
  {
    name: 'Fnatic',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1200px-Esports_organization_Fnatic_logo.svg.png',
    win_rate: 0.65
  },
  {
    name: 'Top Esports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Top_Esports_logo.svg/1200px-Top_Esports_logo.svg.png',
    win_rate: 0.70
  },
  {
    name: 'JD Gaming',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/JD_Gaming_logo.svg/1200px-JD_Gaming_logo.svg.png',
    win_rate: 0.75
  },
  {
    name: 'DRX',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/DRX_logo.svg/1200px-DRX_logo.svg.png',
    win_rate: 0.63
  },
  {
    name: 'EDward Gaming',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/EDward_Gaming_logo.svg/1200px-EDward_Gaming_logo.svg.png',
    win_rate: 0.69
  }
];

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Clean existing data if any (optional)
    console.log('Cleaning existing data...');
    await supabaseClient.from('bets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseClient.from('leagues').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Add leagues
    console.log('Adding leagues...');
    const { data: leaguesData, error: leaguesError } = await supabaseClient
      .from('leagues')
      .insert(LEAGUES)
      .select();

    if (leaguesError) {
      console.error('Error adding leagues:', leaguesError);
      throw leaguesError;
    }

    console.log(`Added ${leaguesData.length} leagues`);

    // Map teams to leagues
    const leagueTeams = [];
    
    for (let i = 0; i < TEAMS.length; i++) {
      // Assign teams to leagues in a round-robin fashion
      const leagueIndex = i % leaguesData.length;
      leagueTeams.push({
        ...TEAMS[i],
        league_id: leaguesData[leagueIndex].id
      });
    }

    // Add teams
    console.log('Adding teams...');
    const { data: teamsData, error: teamsError } = await supabaseClient
      .from('teams')
      .insert(leagueTeams)
      .select();

    if (teamsError) {
      console.error('Error adding teams:', teamsError);
      throw teamsError;
    }

    console.log(`Added ${teamsData.length} teams`);

    // Create matches
    const matches = [];
    const today = new Date();

    // Create upcoming matches
    for (let i = 0; i < teamsData.length - 1; i++) {
      for (let j = i + 1; j < teamsData.length; j++) {
        const teamA = teamsData[i];
        const teamB = teamsData[j];

        // Only create matches between teams in the same league
        if (teamA.league_id !== teamB.league_id) continue;

        const matchDate = new Date(today);
        matchDate.setDate(today.getDate() + Math.floor(Math.random() * 14)); // Random date within next 2 weeks
        
        matches.push({
          league_id: teamA.league_id,
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          match_date: matchDate.toISOString(),
          odds_team_a: (1 / teamA.win_rate) * (0.9 + Math.random() * 0.2), // Random odds based on win rate
          odds_team_b: (1 / teamB.win_rate) * (0.9 + Math.random() * 0.2),
          status: 'upcoming'
        });
      }
    }

    // Create some live matches
    for (let i = 0; i < 2; i++) {
      const teamA = teamsData[Math.floor(Math.random() * teamsData.length)];
      // Find a team in the same league
      const teamsInSameLeague = teamsData.filter(t => 
        t.league_id === teamA.league_id && t.id !== teamA.id
      );
      
      if (teamsInSameLeague.length > 0) {
        const teamB = teamsInSameLeague[Math.floor(Math.random() * teamsInSameLeague.length)];
        
        const matchDate = new Date(today);
        matchDate.setHours(today.getHours() - 1); // Started 1 hour ago
        
        matches.push({
          league_id: teamA.league_id,
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          match_date: matchDate.toISOString(),
          odds_team_a: (1 / teamA.win_rate) * (0.9 + Math.random() * 0.2),
          odds_team_b: (1 / teamB.win_rate) * (0.9 + Math.random() * 0.2),
          status: 'live'
        });
      }
    }

    // Create some completed matches
    for (let i = 0; i < 5; i++) {
      const teamA = teamsData[Math.floor(Math.random() * teamsData.length)];
      // Find a team in the same league
      const teamsInSameLeague = teamsData.filter(t => 
        t.league_id === teamA.league_id && t.id !== teamA.id
      );
      
      if (teamsInSameLeague.length > 0) {
        const teamB = teamsInSameLeague[Math.floor(Math.random() * teamsInSameLeague.length)];
        
        const matchDate = new Date(today);
        matchDate.setDate(today.getDate() - Math.floor(Math.random() * 14) - 1); // Random date within past 2 weeks
        
        // Randomly select winner based on win rates
        const teamAWinProbability = teamA.win_rate / (teamA.win_rate + teamB.win_rate);
        const winner = Math.random() < teamAWinProbability ? teamA.id : teamB.id;
        
        matches.push({
          league_id: teamA.league_id,
          team_a_id: teamA.id,
          team_b_id: teamB.id,
          match_date: matchDate.toISOString(),
          odds_team_a: (1 / teamA.win_rate) * (0.9 + Math.random() * 0.2),
          odds_team_b: (1 / teamB.win_rate) * (0.9 + Math.random() * 0.2),
          status: 'completed',
          winner_id: winner
        });
      }
    }

    // Add matches
    console.log('Adding matches...');
    const { data: matchesData, error: matchesError } = await supabaseClient
      .from('matches')
      .insert(matches)
      .select();

    if (matchesError) {
      console.error('Error adding matches:', matchesError);
      throw matchesError;
    }

    console.log(`Added ${matchesData.length} matches`);

    return new Response(
      JSON.stringify({
        message: 'Database seeded successfully!',
        leagues: leaguesData.length,
        teams: teamsData.length,
        matches: matchesData.length
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
        status: 400
      }
    );
  }
});
