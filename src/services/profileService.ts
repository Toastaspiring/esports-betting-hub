
import { RiotApiResponse } from '@/types/riotTypes';

// Helper to safely parse riot_data from the database
export const parseRiotData = (riotData: any): RiotApiResponse | null => {
  if (!riotData) return null;
  
  try {
    // If it's already a string, parse it
    if (typeof riotData === 'string') {
      return JSON.parse(riotData) as RiotApiResponse;
    }
    
    // If it's already an object with the expected structure
    if (riotData.summoner && riotData.account) {
      return riotData as RiotApiResponse;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Riot data:', error);
    return null;
  }
};
