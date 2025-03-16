
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useSupabase } from '@/hooks/useSupabase';

interface HistoryTabProps {
  bets: any[];
}

export const HistoryTab = ({ bets }: HistoryTabProps) => {
  const { isMockSession } = useSupabase();
  
  // For mock sessions with no bets, provide sample bets
  const effectiveBets = isMockSession && (!bets || bets.length === 0) 
    ? [
        { 
          id: 'mock-bet-1', 
          status: 'won', 
          match_id: 'mock-match-1', 
          created_at: new Date().toISOString(),
          amount: 1500
        },
        { 
          id: 'mock-bet-2', 
          status: 'lost', 
          match_id: 'mock-match-2', 
          created_at: new Date(Date.now() - 86400000).toISOString(),
          amount: 1000
        },
        { 
          id: 'mock-bet-3', 
          status: 'pending', 
          match_id: 'mock-match-3', 
          created_at: new Date(Date.now() - 172800000).toISOString(),
          amount: 2000
        }
      ]
    : bets || [];
  
  const wonBets = effectiveBets.filter(bet => bet.status === 'won') || [];
  const lostBets = effectiveBets.filter(bet => bet.status === 'lost') || [];

  return (
    <>
      <a href="/my-bets" className="inline-block mb-4 text-primary hover:underline">
        View detailed betting history
      </a>
      
      <Card>
        <CardHeader>
          <CardTitle>Betting Summary</CardTitle>
          <CardDescription>Overview of your betting activity</CardDescription>
        </CardHeader>
        <CardContent>
          {effectiveBets && effectiveBets.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-muted-foreground text-sm">Total</p>
                  <p className="text-2xl font-bold mt-1">{effectiveBets.length}</p>
                </div>
                <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 text-sm">Won</p>
                  <p className="text-2xl font-bold mt-1 text-green-800 dark:text-green-300">{wonBets.length}</p>
                </div>
                <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-800 dark:text-red-300 text-sm">Lost</p>
                  <p className="text-2xl font-bold mt-1 text-red-800 dark:text-red-300">{lostBets.length}</p>
                </div>
              </div>
              
              <div className="text-center text-muted-foreground text-sm">
                Detailed statistics and charts coming soon!
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't placed any bets yet</p>
              <a 
                href="/matches" 
                className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
              >
                Browse Matches
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
