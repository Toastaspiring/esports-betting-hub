
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const seedDatabase = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('seed-data');
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: data.message,
    });
    
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    toast({
      title: "Error",
      description: "Failed to seed database",
      variant: "destructive"
    });
    return false;
  }
};
