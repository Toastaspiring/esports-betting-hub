
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

interface HistoryTabProps {
  bets: any[];
}

export const HistoryTab = ({ bets }: HistoryTabProps) => {
  const wonBets = bets?.filter(bet => bet.status === 'won') || [];
  const lostBets = bets?.filter(bet => bet.status === 'lost') || [];

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
          {bets && bets.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-muted-foreground text-sm">Total</p>
                  <p className="text-2xl font-bold mt-1">{bets.length}</p>
                </div>
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <p className="text-green-800 text-sm">Won</p>
                  <p className="text-2xl font-bold mt-1 text-green-800">{wonBets.length}</p>
                </div>
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <p className="text-red-800 text-sm">Lost</p>
                  <p className="text-2xl font-bold mt-1 text-red-800">{lostBets.length}</p>
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
