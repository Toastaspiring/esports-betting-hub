
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code and state from the URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        // Check if state matches
        const storedState = localStorage.getItem('riotAuthState');
        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter. Authentication attempt may have been compromised.');
        }
        
        // Clear the state from localStorage
        localStorage.removeItem('riotAuthState');
        
        // If there's no code, something went wrong
        if (!code) {
          throw new Error('No authentication code received from Riot Games.');
        }
        
        // Call the Supabase edge function to handle the callback
        const { data, error } = await supabase.functions.invoke('riot-auth', {
          query: { 
            action: 'callback',
            code,
            state,
            redirect_uri: `${window.location.origin}/auth/callback`
          }
        });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Authentication successful",
          description: "You are now signed in with your Riot account.",
        });
        
        // Redirect to home page or the page specified in the response
        navigate(data.redirectTo || '/', { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message || 'An unexpected error occurred during authentication.');
        
        toast({
          title: "Authentication failed",
          description: err.message || "An unexpected error occurred during authentication.",
          variant: "destructive",
        });
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };
    
    handleCallback();
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm">Redirecting back to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold mb-2">Completing Authentication</h1>
          <p className="text-muted-foreground">Please wait while we finish the sign-in process...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
