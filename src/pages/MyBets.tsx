
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSupabase } from "@/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const MyBets = () => {
  const { session, user, isMockSession } = useSupabase();
  
  const { data: bets, isLoading } = useQuery({
    queryKey: ["my-bets", user?.id, isMockSession],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // For mock sessions, return mock bets
      if (isMockSession) {
        console.log("Using mock bets for MyBets page");
        return [
          { 
            id: 'mock-bet-1', 
            status: 'won', 
            match_id: 'mock-match-1',
            matches: {
              team1: 'T1',
              team2: 'Gen.G',
              match_date: new Date().toISOString()
            },
            created_at: new Date().toISOString(),
            amount: 1500,
            odds: 2.5,
            potential_win: 3750,
            bet_type: 'Team Win',
            user_id: user.id
          },
          { 
            id: 'mock-bet-2', 
            status: 'lost', 
            match_id: 'mock-match-2',
            matches: {
              team1: 'G2',
              team2: 'Fnatic',
              match_date: new Date(Date.now() - 86400000).toISOString()
            },
            created_at: new Date(Date.now() - 86400000).toISOString(),
            amount: 1000,
            odds: 1.8,
            potential_win: 1800,
            bet_type: 'First Blood',
            user_id: user.id
          },
          { 
            id: 'mock-bet-3', 
            status: 'pending', 
            match_id: 'mock-match-3',
            matches: {
              team1: 'Top Esports',
              team2: 'JD Gaming',
              match_date: new Date(Date.now() + 86400000).toISOString()
            },
            created_at: new Date(Date.now() - 172800000).toISOString(),
            amount: 2000,
            odds: 3.2,
            potential_win: 6400,
            bet_type: 'First Dragon',
            user_id: user.id
          }
        ];
      }
      
      const { data, error } = await supabase
        .from("bets")
        .select(`
          *,
          matches:match_id(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (!session && !isMockSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-6xl py-6 px-4 md:py-10">
          <Card>
            <CardHeader>
              <CardTitle>My Bets</CardTitle>
              <CardDescription>Please login to view your bets</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  // Helper function to check if a bet is settled
  const isSettled = (bet) => bet.status === 'settled' || bet.status === 'won' || bet.status === 'lost';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl py-20 px-4 md:py-24">
        <h1 className="text-3xl font-bold mb-6">My Bets</h1>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Bets</TabsTrigger>
            <TabsTrigger value="settled">Settled Bets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Bets</CardTitle>
                <CardDescription>Bets on upcoming or in-progress matches</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading your bets...</p>
                  </div>
                ) : bets?.filter(bet => !isSettled(bet)).length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">You don't have any active bets</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bets?.filter(bet => !isSettled(bet)).map((bet) => (
                      <BetItem key={bet.id} bet={bet} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settled">
            <Card>
              <CardHeader>
                <CardTitle>Settled Bets</CardTitle>
                <CardDescription>History of your completed bets</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <p>Loading your bets...</p>
                  </div>
                ) : bets?.filter(bet => isSettled(bet)).length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">You don't have any settled bets yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bets?.filter(bet => isSettled(bet)).map((bet) => (
                      <BetItem key={bet.id} bet={bet} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const BetItem = ({ bet }: { bet: any }) => {
  const match = bet.matches;
  
  // Helper function to check if a bet is settled
  const isSettled = (bet) => bet.status === 'settled' || bet.status === 'won' || bet.status === 'lost';
  
  // Helper function to check if a bet is won
  const isWon = (bet) => bet.status === 'won';
  
  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="font-medium">{match?.team1} vs {match?.team2}</h3>
            <p className="text-sm text-muted-foreground">
              {match ? new Date(match.match_date).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
          
          <div className="mt-2 md:mt-0">
            <p className="font-medium">Bet: {bet.bet_type || 'Team Win'}</p>
            <p className="text-sm text-muted-foreground">Amount: ${bet.amount}</p>
          </div>
          
          <div className="mt-2 md:mt-0 text-right">
            <p className="font-medium">
              {isSettled(bet) ? (
                isWon(bet) ? (
                  <span className="text-green-500">Won ${bet.potential_win || Math.round(bet.amount * bet.odds)}</span>
                ) : (
                  <span className="text-red-500">Lost ${bet.amount}</span>
                )
              ) : (
                <span className="text-blue-500">Potential win: ${bet.potential_win || Math.round(bet.amount * bet.odds)}</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {isSettled(bet) ? 'Settled' : 'Pending'}
            </p>
          </div>
        </div>
        
        <Separator className="my-3" />
        
        <div className="text-sm text-muted-foreground">
          <p>Placed: {new Date(bet.created_at).toLocaleDateString()}</p>
          <p>Odds: {bet.odds}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyBets;
