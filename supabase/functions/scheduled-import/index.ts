
import { serve } from "https://deno.land/std@0.188.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// We'll use this function to call the liquipedia-import function
async function callImportFunction(supabase: any, importType: string) {
  console.log(`Calling liquipedia-import function for ${importType}...`);
  
  try {
    const { data, error } = await supabase.functions.invoke("liquipedia-import", {
      body: { importType },
    });
    
    if (error) {
      console.error(`Error importing ${importType}:`, error);
      return { success: false, message: error.message };
    }
    
    console.log(`Successfully imported ${importType}:`, data);
    return data;
  } catch (err) {
    console.error(`Exception when importing ${importType}:`, err);
    return { 
      success: false, 
      message: `Failed to import ${importType}: ${err.message}` 
    };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting scheduled import");
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Import data in sequence
    const results = {
      tournaments: await callImportFunction(supabase, "tournaments"),
      teams: await callImportFunction(supabase, "teams"),
      matches: await callImportFunction(supabase, "matches"),
      players: await callImportFunction(supabase, "players"),
    };
    
    // Summarize results
    const summary = {
      success: true,
      message: "Scheduled import completed",
      results
    };
    
    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error("Error in scheduled import:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: `Scheduled import failed: ${error.message}` 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500,
    });
  }
});
