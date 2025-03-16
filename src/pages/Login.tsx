
import { useSupabase } from '@/hooks/useSupabase';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { LoginButtons } from '@/components/auth/LoginButtons';

const Login = () => {
  const { user } = useSupabase();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
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
            <CardContent>
              <LoginButtons />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
