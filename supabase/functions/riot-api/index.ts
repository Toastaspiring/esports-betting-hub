
// Follow this setup guide to integrate the Deno runtime and make it available
// as an imported JavaScript library in your project:
// https://deno.com/manual/runtime/js/using_deno_in_your_project
//
// Alternatively, use the `Deno.serve` API:
// https://deno.com/manual/runtime/http_server_apis

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user's data
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      )
    }

    // Get request body
    const { riot_id } = await req.json()

    if (!riot_id) {
      return new Response(
        JSON.stringify({ error: 'Riot ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Get the RIOT API key from environment variables
    const RIOT_API_KEY = Deno.env.get('RIOT_API_KEY')
    if (!RIOT_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Riot API key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    // Parse Riot ID format (username#tagLine)
    const [gameName, tagLine] = riot_id.split('#');
    
    if (!gameName || !tagLine) {
      return new Response(
        JSON.stringify({ error: 'Invalid Riot ID format. Expected format: username#tag' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Call Riot Games API to get account information
    // Documentation: https://developer.riotgames.com/apis#account-v1
    const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`, {
      headers: {
        "X-Riot-Token": RIOT_API_KEY
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Riot API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch Riot account', 
          status: response.status,
          details: errorText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: response.status === 404 ? 404 : 500 
        }
      )
    }

    const riotAccountData = await response.json();
    
    // Get additional summoner data if it's a League of Legends account
    let summonerData = null;
    try {
      // Find the puuid from account data
      const puuid = riotAccountData.puuid;
      
      // Try to get summoner data from NA region (can be adjusted in a future version)
      const summonerResponse = await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
        headers: {
          "X-Riot-Token": RIOT_API_KEY
        }
      });
      
      if (summonerResponse.ok) {
        summonerData = await summonerResponse.json();
      }
    } catch (error) {
      console.log('Error fetching summoner data (non-critical):', error);
      // We'll continue even if summoner data fails as it's not critical
    }
    
    // Combine the data
    const riotData = {
      ...riotAccountData,
      summoner: summonerData,
      connectedAt: new Date().toISOString()
    };

    // Update the user's profile with Riot data
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        riot_id: riot_id,
        riot_data: riotData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update profile' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Riot account linked successfully',
        data: riotData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
