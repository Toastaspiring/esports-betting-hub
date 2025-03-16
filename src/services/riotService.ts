
import { supabase } from "@/integrations/supabase/client";

export const linkRiotAccount = async (riotId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('riot-api', {
      body: { riot_id: riotId }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error linking Riot account:', error);
    throw error;
  }
};

export const fetchRiotAccountData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('riot_id, riot_data')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching Riot account data:', error);
    throw error;
  }
};

export const refreshRiotAccountData = async () => {
  try {
    // Get the current user's Riot ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('riot_id')
      .eq('id', user.id)
      .single();
    
    if (profileError) throw profileError;
    if (!profile.riot_id) throw new Error('No Riot ID linked to this account');
    
    // Re-fetch data from Riot API
    return await linkRiotAccount(profile.riot_id);
  } catch (error) {
    console.error('Error refreshing Riot account data:', error);
    throw error;
  }
};
