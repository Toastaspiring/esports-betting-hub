
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const seedDatabase = async () => {
  try {
    toast({
      title: "Seeding Database",
      description: "Please wait while we prepare your data...",
    });
    
    const { data, error } = await supabase.functions.invoke('seed-data');
    
    if (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: `Database seeded with ${data.leagues} leagues, ${data.teams} teams, and ${data.matches} matches.`,
    });
    
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    toast({
      title: "Error",
      description: "Failed to seed database. Check console for details.",
      variant: "destructive"
    });
    return false;
  }
};
