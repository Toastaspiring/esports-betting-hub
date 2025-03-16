
import { useState } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { RiotApiResponse } from '@/types/riotTypes';
import { Json } from '@/integrations/supabase/types';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSampleLoading, setIsSampleLoading] = useState(false);
  const { user } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
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

  // Sample data login for testing
  const handleSampleLogin = async () => {
    setIsSampleLoading(true);
    
    try {
      // Sample data that would come from Riot API - simplified to ensure it works reliably
      const sampleData: RiotApiResponse = {
        summoner: {
          id: "sUmM0n3r1D12345",
          puuid: "pUU1D_1234567890abcdefghijklmnopqrstuvwxyz",
          name: "SummonerName",
          profileIconId: 4567,
          summonerLevel: 287,
          riotId: "SummonerName#EUW"
        },
        account: {
          gameName: "SummonerName",
          tagLine: "EUW"
        },
        region: "europe",
        profilePictureUrl: "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/4567.png"
      };
      
      // Instead of creating a new user with SignUp (which hits rate limits), 
      // create a test session directly using the admin sign-in method
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "Test123456!",
      });
      
      if (signInError) {
        // If sign-in fails (e.g., user doesn't exist), create the user first
        if (signInError.message.includes("Invalid login credentials")) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: "test@example.com",
            password: "Test123456!",
            options: {
              data: {
                is_test_user: true
              }
            }
          });
          
          if (signUpError) {
            throw signUpError;
          }
          
          // Use the newly created user
          if (signUpData.user) {
            // Convert RiotApiResponse to JSON to avoid typing issues
            const riotDataJson = JSON.stringify(sampleData);
            
            // Update profile with sample data
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                riot_id: sampleData.summoner.riotId,
                riot_data: JSON.parse(riotDataJson),
                username: "TestUser",
                balance: 10000
              })
              .eq('id', signUpData.user.id);
            
            if (updateError) {
              throw updateError;
            }
            
            toast({
              title: "Sample Login Successful",
              description: "You're logged in with sample data",
            });
            
            navigate('/', { replace: true });
          }
        } else {
          throw signInError;
        }
      } else if (signInData.user) {
        // User already exists, just update the profile with sample data
        const riotDataJson = JSON.stringify(sampleData);
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            riot_id: sampleData.summoner.riotId,
            riot_data: JSON.parse(riotDataJson),
            username: "TestUser",
            balance: 10000
          })
          .eq('id', signInData.user.id);
        
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Sample Login Successful",
          description: "You're logged in with sample data",
        });
        
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Sample login error:', error);
      toast({
        title: "Sample Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSampleLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 bg-background pt-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-xl">L</span>
              </div>
              <span className="font-display text-xl font-semibold tracking-tight">
                LoL Bet
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome to LoL Bet</h1>
            <p className="text-muted-foreground">Sign in to place bets and track your winnings</p>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Login with Riot Games</CardTitle>
              <CardDescription>
                Use your Riot Games account to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
