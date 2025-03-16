
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSupabase } from "@/hooks/useSupabase";
import { useQuery } from "@tanstack/react-query";

const MyBets = () => {
  const { session, supabaseClient } = useSupabase();
  
  const { data: bets, isLoading } = useQuery({
    queryKey: ["my-bets", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabaseClient
        .from("bets")
        .select(`
          *,
          matches:match_id(*)
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return (
      <div className="container max-w-6xl py-6 px-4 md:py-10">
        <Card>
          <CardHeader>
            <CardTitle>My Bets</CardTitle>
            <CardDescription>Please login to view your bets</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-6 px-4 md:py-10">
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
              ) : bets?.filter(bet => !bet.is_settled).length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">You don't have any active bets</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bets?.filter(bet => !bet.is_settled).map((bet) => (
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
              ) : bets?.filter(bet => bet.is_settled).length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">You don't have any settled bets yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bets?.filter(bet => bet.is_settled).map((bet) => (
                    <BetItem key={bet.id} bet={bet} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BetItem = ({ bet }: { bet: any }) => {
  const match = bet.matches;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h3 className="font-medium">{match?.team1} vs {match?.team2}</h3>
            <p className="text-sm text-muted-foreground">
              {match ? new Date(match.match_date).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
          
          <div className="mt-2 md:mt-0">
            <p className="font-medium">Bet: {bet.bet_type}</p>
            <p className="text-sm text-muted-foreground">Amount: ${bet.amount}</p>
          </div>
          
          <div className="mt-2 md:mt-0 text-right">
            <p className="font-medium">
              {bet.is_settled ? (
                bet.won ? (
                  <span className="text-green-500">Won ${bet.potential_win}</span>
                ) : (
                  <span className="text-red-500">Lost ${bet.amount}</span>
                )
              ) : (
                <span className="text-blue-500">Potential win: ${bet.potential_win}</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {bet.is_settled ? 'Settled' : 'Pending'}
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
