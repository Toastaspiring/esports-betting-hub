
import { serve } from "https://deno.land/std@0.188.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    console.log('Starting database cleanup...');
    
    // Count existing data to return in the response
    const { count: leaguesCount, error: leaguesCountError } = await supabaseClient
      .from('leagues')
      .select('*', { count: 'exact', head: true });
      
    if (leaguesCountError) {
      console.error('Error counting leagues:', leaguesCountError);
      throw leaguesCountError;
    }
    
    const { count: teamsCount, error: teamsCountError } = await supabaseClient
      .from('teams')
      .select('*', { count: 'exact', head: true });
      
    if (teamsCountError) {
      console.error('Error counting teams:', teamsCountError);
      throw teamsCountError;
    }
    
    const { count: matchesCount, error: matchesCountError } = await supabaseClient
      .from('matches')
      .select('*', { count: 'exact', head: true });
      
    if (matchesCountError) {
      console.error('Error counting matches:', matchesCountError);
      throw matchesCountError;
    }
    
    // Clean existing data in reverse order of dependencies
    console.log('Cleaning bets data...');
    const { error: betsError } = await supabaseClient
      .from('bets')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (betsError) {
      console.error('Error cleaning bets:', betsError);
      throw betsError;
    }
    
    console.log('Cleaning matches data...');
    const { error: matchesError } = await supabaseClient
      .from('matches')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (matchesError) {
      console.error('Error cleaning matches:', matchesError);
      throw matchesError;
    }
    
    console.log('Cleaning teams data...');
    const { error: teamsError } = await supabaseClient
      .from('teams')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (teamsError) {
      console.error('Error cleaning teams:', teamsError);
      throw teamsError;
    }
    
    console.log('Cleaning leagues data...');
    const { error: leaguesError } = await supabaseClient
      .from('leagues')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
      
    if (leaguesError) {
      console.error('Error cleaning leagues:', leaguesError);
      throw leaguesError;
    }

    console.log('Database cleanup completed successfully');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database cleared successfully',
        leagues: leaguesCount || 0,
        teams: teamsCount || 0,
        matches: matchesCount || 0
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
    console.error('Error clearing database:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        message: `Failed to clear database: ${error.message}` 
      }),
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
