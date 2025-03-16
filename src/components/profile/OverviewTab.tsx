
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { useSupabase } from '@/hooks/useSupabase';

interface OverviewTabProps {
  bets: any[];
  profile: any;
}

export const OverviewTab = ({ bets, profile }: OverviewTabProps) => {
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
  const pendingBets = effectiveBets.filter(bet => bet.status === 'pending') || [];
  const lostBets = effectiveBets.filter(bet => bet.status === 'lost') || [];
  
  // Calculate win rate properly based on won and lost bets (excluding pending)
  const totalCompletedBets = wonBets.length + lostBets.length;
  const winRate = totalCompletedBets > 0 ? wonBets.length / totalCompletedBets : 0;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{effectiveBets.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {wonBets.length} won / {lostBets.length} lost / {pendingBets.length} pending
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(winRate * 100).toFixed(1)}%</div>
            <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${(winRate * 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.balance?.toLocaleString() || "0"} LP</div>
            <div className="text-xs text-muted-foreground mt-1">
              Betting Power
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest betting activities</CardDescription>
        </CardHeader>
        <CardContent>
          {effectiveBets.length > 0 ? (
            <div className="space-y-4">
              {effectiveBets.slice(0, 5).map((bet) => (
                <div key={bet.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Bet on Match #{bet.match_id.substring(0, 6)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(bet.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      bet.status === 'won' ? 'bg-green-100 text-green-800' :
                      bet.status === 'lost' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </span>
                    <span className="font-semibold">{bet.amount} LP</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No betting activity yet</p>
              <a 
                href="/matches" 
                className="inline-block mt-4 text-primary text-sm font-medium"
              >
                Browse Matches to Bet
              </a>
            </div>
          )}
        </CardContent>
        {effectiveBets.length > 5 && (
          <CardFooter>
            <a 
              href="/my-bets" 
              className="text-primary text-sm font-medium hover:underline"
            >
              View All Activity
            </a>
          </CardFooter>
        )}
      </Card>
    </>
  );
};
