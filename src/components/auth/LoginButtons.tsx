
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSampleLogin } from '@/hooks/useSampleLogin';

export const LoginButtons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isLoading: isSampleLoading, handleSampleLogin } = useSampleLogin();
  
  const handleRiotLogin = async () => {
    setIsLoading(true);
    
    try {
      // Get the current URL for the redirect
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      // Call the Supabase edge function to get the Riot OAuth URL
      const { data, error } = await supabase.functions.invoke('riot-auth', {
        body: { 
          action: 'login',
          redirectUrl 
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Store the state in localStorage to verify when the user returns
      localStorage.setItem('riotAuthState', data.state);
      
      // Redirect to Riot's authentication page
      window.location.href = data.url;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Button 
        onClick={handleRiotLogin}
        className="w-full bg-red-600 hover:bg-red-700 text-white"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting to Riot Games...
          </>
        ) : (
          <>
            <svg 
              className="w-5 h-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.534 21.77l-2.13-2.13h-2.13l-4.26-4.26V13.25L2.774 12l1.24-1.25v-2.13l4.26-4.26h2.13l2.13-2.13 2.13 2.13h2.13l4.26 4.26v2.13L22.294 12l-1.24 1.25v2.13l-4.26 4.26h-2.13l-2.13 2.13z" />
            </svg>
            Sign in with Riot
          </>
        )}
      </Button>
      
      {/* Test Login Button with Sample Data */}
      <Button 
        onClick={handleSampleLogin}
        variant="outline"
        className="w-full border-gray-300"
        size="lg"
        disabled={isSampleLoading}
      >
        {isSampleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading Sample Data...
          </>
        ) : (
          <>
            Test Login with Sample Data
          </>
        )}
      </Button>
      
      <p className="text-sm text-muted-foreground mt-6 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};
