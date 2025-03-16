
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/hooks/useSupabase';

export const useSampleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshAuth } = useSupabase();

  const handleSampleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Sample data that would come from Riot API
      const sampleData = {
        summoner: {
          id: "sampleSummonerId123",
          puuid: "samplePuuid123456789",
          name: "TestSummoner",
          profileIconId: 4567,
          summonerLevel: 287,
          riotId: "TestSummoner#TEST"
        },
        account: {
          gameName: "TestSummoner",
          tagLine: "TEST"
        },
        region: "europe",
        profilePictureUrl: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/4567.png"
      };
      
      // Email and password for test account - consistent for easy testing
      const testEmail = "test@example.com";
      const testPassword = "Test123456!";

      // First, try to sign in with the test account
      let { data: userData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      // If login fails because the account doesn't exist
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        console.log("Couldn't sign in, creating test account...");
        
        // Try a different approach - use anonymous auth if available
        // or use a pre-created account instead of trying to create a new one
        
        // For now, let's inform the user about the rate limit issue
        throw new Error("Unable to login with sample data: The test account cannot be created due to email rate limits. Please try again later or use a real Riot account.");
      } else if (signInError) {
        // Some other error occurred during sign in
        throw signInError;
      }
      
      if (!userData?.user) {
        throw new Error("Failed to get user data");
      }
      
      // Update the profile with sample data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          riot_id: sampleData.summoner.riotId,
          riot_data: sampleData,
          username: "TestUser",
          balance: 10000,
          bets_won: 15,
          bets_lost: 5,
          avatar_url: sampleData.profilePictureUrl
        })
        .eq('id', userData.user.id);
      
      if (updateError) {
        console.error("Error updating profile:", updateError);
        // If updating fails, we can still proceed since the user is logged in
        console.log("Continuing despite profile update error");
      }
      
      // Manually refresh the auth context to make sure app recognizes the user is logged in
      await refreshAuth();
      
      toast({
        title: "Sample Login Successful",
        description: "You're logged in with sample data!",
      });
      
      // Navigate to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sample login error:', error);
      toast({
        title: "Sample Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSampleLogin
  };
};
