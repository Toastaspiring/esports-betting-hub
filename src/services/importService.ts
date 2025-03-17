
import { supabase } from "@/integrations/supabase/client";

// Helper function to call the Liquipedia import edge function
export const importLiquipediaData = async (importType: 'matches' | 'teams' | 'tournaments' | 'players') => {
  try {
    const { data, error } = await supabase.functions.invoke('liquipedia-import', {
      body: { importType }
    });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error(`Error importing ${importType} from Liquipedia:`, error);
    return { 
      success: false, 
      message: error.message || `Failed to import ${importType} from Liquipedia` 
    };
  }
};

export const importLiquipediaMatches = async () => {
  return importLiquipediaData('matches');
};

export const importLiquipediaTeams = async () => {
  return importLiquipediaData('teams');
};

export const importLiquipediaTournaments = async () => {
  return importLiquipediaData('tournaments');
};

export const importLiquipediaPlayers = async () => {
  return importLiquipediaData('players');
};
