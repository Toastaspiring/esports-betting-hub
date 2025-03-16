
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSupabase } from '@/hooks/useSupabase';
import { Navigate } from 'react-router-dom';
import { fetchUserBets } from '@/services/supabaseService';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Clock, Ban, Loader2 } from 'lucide-react';

const MyBets = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabase();
  const { toast } = useToast();
  
  // Redirect if not logged in
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  
  useEffect(() => {
    const loadBets = async () => {
      try {
        const { data } = await fetchUserBets();
        setBets(data);
      } catch (error) {
        console.error('Error fetching bets:', error);
        toast({
          title: "Failed to load bets",
          description: "Could not retrieve your betting history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadBets();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  // Filter bets by status
  const pendingBets = bets.filter(bet => bet.status === 'pending');
  const wonBets = bets.filter(bet => bet.status === 'won');
  const lostBets = bets.filter(bet => bet.status === 'lost');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Bets</h1>
            <p className="text-muted-foreground">
              Track your betting history and see your results
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Bets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bets.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Wins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{wonBets.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Losses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{lostBets.length}</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Bets List */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
                  <TabsTrigger value="all">All Bets</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    {pendingBets.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        {pendingBets.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="won">Won</TabsTrigger>
                  <TabsTrigger value="lost">Lost</TabsTrigger>
                </TabsList>
                
                {/* All Bets */}
                <TabsContent value="all">
                  {bets.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-muted-foreground">You haven't placed any bets yet</p>
                      <a 
                        href="/matches" 
                        className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                      >
                        Browse Matches
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bets.map((bet) => (
                        <BetCard key={bet.id} bet={bet} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Pending Bets */}
                <TabsContent value="pending">
                  {pendingBets.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-muted-foreground">You don't have any pending bets</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingBets.map((bet) => (
                        <BetCard key={bet.id} bet={bet} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Won Bets */}
                <TabsContent value="won">
                  {wonBets.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-muted-foreground">You haven't won any bets yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wonBets.map((bet) => (
                        <BetCard key={bet.id} bet={bet} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Lost Bets */}
                <TabsContent value="lost">
                  {lostBets.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
                      <p className="text-muted-foreground">You haven't lost any bets yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lostBets.map((bet) => (
                        <BetCard key={bet.id} bet={bet} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// BetCard component to display individual bets
const BetCard = ({ bet }: { bet: any }) => {
  const getBetStatusIcon = () => {
    switch (bet.status) {
      case 'won':
        return <Trophy className="w-5 h-5 text-green-500" />;
      case 'lost':
        return <Ban className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };
  
  const getBetStatusClass = () => {
    switch (bet.status) {
      case 'won':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Match Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getBetStatusClass()}`}>
                {getBetStatusIcon()}
                {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(bet.created_at)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <img src={bet.match.teamA.logo} alt={bet.match.teamA.name} className="w-10 h-10 object-contain" />
              <span className="text-sm font-medium">vs</span>
              <img src={bet.match.teamB.logo} alt={bet.match.teamB.name} className="w-10 h-10 object-contain" />
              
              <div className="ml-2">
                <p className="text-sm font-medium">{bet.match.teamA.name} vs {bet.match.teamB.name}</p>
                <p className="text-xs text-muted-foreground">{bet.match.league.name}</p>
              </div>
            </div>
          </div>
          
          {/* Bet Details */}
          <div className="flex flex-col items-end justify-end space-y-1">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">You bet on:</span>
              <span className="font-medium">{bet.team.name}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Amount:</span>
              <span className="font-medium">{bet.amount} LP</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Odds:</span>
              <span className="font-medium">{bet.odds.toFixed(2)}</span>
            </div>
            
            {bet.status === 'won' && (
              <div className="flex items-center text-green-600">
                <span className="text-sm mr-2">Winnings:</span>
                <span className="font-bold">{Math.round(bet.amount * bet.odds)} LP</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyBets;
