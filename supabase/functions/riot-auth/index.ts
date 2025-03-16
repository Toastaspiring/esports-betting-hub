
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
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const requestData = await req.json();
    const action = requestData.action;
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Handle login initialization
    if (action === 'login') {
      // The redirect URL that Riot will return to after authentication
      const redirectUrl = requestData.redirectUrl || '';
      
      // Generate a state parameter for security
      const state = crypto.randomUUID();
      
      // Generate the Riot OAuth URL
      // Note: This is a simplified example. In reality, you would need to register
      // your application with Riot and obtain client_id, etc.
      const riotOAuthUrl = `https://auth.riotgames.com/authorize?client_id=${Deno.env.get('RIOT_CLIENT_ID')}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=openid&state=${state}`;
      
      return new Response(
        JSON.stringify({ url: riotOAuthUrl, state }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    // Handle OAuth callback
    if (action === 'callback') {
      const code = requestData.code;
      const state = requestData.state;
      
      if (!code) {
        throw new Error('No code provided in callback');
      }
      
      // Exchange code for token with Riot
      // Note: In a real implementation, you would make a request to Riot's token endpoint
      const response = await fetch('https://auth.riotgames.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${Deno.env.get('RIOT_CLIENT_ID')}:${Deno.env.get('RIOT_CLIENT_SECRET')}`)}`
        },
        body: new URLSearchParams({
          'grant_type': 'authorization_code',
          'code': code,
          'redirect_uri': requestData.redirect_uri || '',
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to exchange code for token: ${await response.text()}`);
      }
      
      const tokenData = await response.json();
      
      // Use the token to get user info from Riot
      const userInfoResponse = await fetch('https://auth.riotgames.com/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      });
      
      if (!userInfoResponse.ok) {
        throw new Error(`Failed to get user info: ${await userInfoResponse.text()}`);
      }
      
      const userInfo = await userInfoResponse.json();
      
      // Create or update user in Supabase
      const { data: user, error: userError } = await supabaseClient.auth.admin.createUser({
        email: userInfo.email,
        email_confirm: true,
        user_metadata: {
          full_name: userInfo.name,
          riot_id: userInfo.sub,
          avatar_url: userInfo.picture,
        }
      });
      
      if (userError && userError.message !== 'User already registered') {
        throw userError;
      }
      
      // Sign in the user with a custom token
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.generateLink({
        type: 'magiclink',
        email: userInfo.email,
      });
      
      if (sessionError) {
        throw sessionError;
      }
      
      return new Response(
        JSON.stringify({ success: true, redirectTo: '/' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
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
})
