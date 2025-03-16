
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
