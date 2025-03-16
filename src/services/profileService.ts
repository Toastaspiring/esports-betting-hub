
import { RiotApiResponse } from '@/types/riotTypes';
import { Json } from '@/integrations/supabase/types';

// Helper to safely parse riot_data from the database
export const parseRiotData = (riotData: Json | null): RiotApiResponse | null => {
  if (!riotData) return null;
  
  try {
    // If it's already a string, parse it
    if (typeof riotData === 'string') {
      return JSON.parse(riotData) as RiotApiResponse;
    }
    
    // If it's already an object with the expected structure
    if (typeof riotData === 'object' && riotData !== null) {
      // Check if it has the summoner property
      if ('summoner' in riotData) {
        return riotData as unknown as RiotApiResponse;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Riot data:', error);
    return null;
  }
};
