
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const clearDatabase = async () => {
  try {
    toast({
      title: "Clearing Database",
      description: "Please wait while we clean up your database...",
    });
    
    const { data, error } = await supabase.functions.invoke('clear-database');
    
    if (error) {
      console.error("Error clearing database:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: `Database cleared successfully. Removed ${data.leagues} leagues, ${data.teams} teams, and ${data.matches} matches.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error clearing database:", error);
    toast({
      title: "Error",
      description: "Failed to clear database. Check console for details.",
      variant: "destructive"
    });
    return false;
  }
};
