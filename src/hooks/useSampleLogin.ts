
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
      // Email and password for test account - using the pre-created test account
      const testEmail = "test@example.com";
      const testPassword = "Test123456!";

      // Sign in with the pre-created test account (no need to create one)
      const { data: userData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      // If login fails - handle the error
      if (signInError) {
        console.error("Sample login sign-in error:", signInError);
        throw new Error(`Unable to login with sample data: ${signInError.message}`);
      }
      
      if (!userData?.user) {
        throw new Error("Failed to get user data");
      }
      
      console.log("Successfully logged in with test account, refreshing auth...");
      
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
