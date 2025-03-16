
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/hooks/useSupabase';
import { MOCK_USER } from '@/lib/constants';

export const useSampleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setMockSession } = useSupabase();

  const handleSampleLogin = async () => {
    setIsLoading(true);
    
    try {
      console.log("Using mock login with sample data...");
      
      // Create a complete mock profile with all necessary fields
      const mockProfile = {
        ...MOCK_USER,
        id: 'mock-user-id',
        username: 'TestUser',
        email: 'test@example.com',
        avatar: 'https://i.pravatar.cc/150?img=68',
        bio: 'This is a sample account for demonstration purposes.',
        riot_id: 'sample#NA1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        balance: 5000,
        bets_won: 42,
        bets_lost: 20,
        riot_data: null,
        is_admin: false,
        region: 'NA'
      };
      
      // Create a mock session instead of actual authentication
      await setMockSession({
        user: {
          id: 'mock-user-id',
          email: 'test@example.com',
        },
        mockProfile
      });
      
      console.log("Successfully logged in with mock user data");
      
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
