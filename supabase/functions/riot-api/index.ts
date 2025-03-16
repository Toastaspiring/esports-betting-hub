
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

    // In a real application, you would make a call to the Riot Games API here
    // using the RIOT_API_KEY from environment variables
    
    // For demonstration purposes, we'll just simulate a response
    // In a real implementation, you would call the Riot Games API endpoints
    
    // Example response data from a simulated API call
    const riotData = {
      id: riot_id,
      summonerLevel: 150,
      profileIconId: 4123,
      // More data would be available from the actual Riot API
    }

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
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})
