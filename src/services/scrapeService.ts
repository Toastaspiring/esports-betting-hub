
import { supabase } from "@/integrations/supabase/client";

/**
 * Scrape LoL Esports data from lolesports.com
 * @param region Optional region to filter (e.g., 'lck', 'lec', 'lcs')
 * @param language Optional language code (default: 'en-US')
 */
export const scrapeLolEsports = async (region?: string, language: string = 'en-US') => {
  try {
    const { data, error } = await supabase.functions.invoke('lol-esports-scrape', {
      body: { region, language }
    });
    
    if (error) throw error;
    
    return { 
      success: true, 
      data 
    };
  } catch (error) {
    console.error("Error scraping LoL Esports:", error);
    return { 
      success: false, 
      error: error.message || "Failed to scrape LoL Esports data" 
    };
  }
};

/**
 * Import data by scraping LoL Esports and adding to the database
 */
export const importLolEsportsData = async () => {
  return await scrapeLolEsports();
};
