
// Follow this setup guide to integrate the Deno runtime and make it available
// as an imported JavaScript library in your project:
// https://deno.land/manual/runtime/js/using_deno_in_project

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { riot_id } = await req.json();

    if (!riot_id) {
      return new Response(
        JSON.stringify({ error: 'Riot ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // For demonstration purposes, we'll simulate a response from Riot API
    // In a real implementation, you would make API calls to Riot endpoints
    const riotApiData = {
      summoner: {
        id: "sUmM0n3r1D12345",
        puuid: "pUU1D_1234567890abcdefghijklmnopqrstuvwxyz",
        name: riot_id.split('#')[0],
        profileIconId: 4567,
        summonerLevel: 287,
        riotId: riot_id
      },
      account: {
        gameName: riot_id.split('#')[0],
        tagLine: riot_id.includes('#') ? riot_id.split('#')[1] : "EUW"
      },
      region: "europe",
      profilePictureUrl: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/4567.png"
    };

    // Get the current user
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    // Update the user's profile with the Riot ID and data
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ 
        riot_id: riot_id,
        riot_data: riotApiData
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Riot account linked successfully',
        data: riotApiData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
