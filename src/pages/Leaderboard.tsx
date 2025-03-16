
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Trophy, TrendingUp, Award, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/hooks/useSupabase';

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();
  const { user: currentAuthUser } = useSupabase();

  // Fetch users data from the profiles table
  const { data, isLoading: isLoadingUsers, error } = useQuery({
    queryKey: ['leaderboardUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('balance', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (data) {
      // Transform the data to include rank
      const rankedUsers = data.map((user, index) => ({
        ...user,
        rank: index + 1,
        badge: getBadgeForRank(index + 1),
        winRate: user.bets_won && (user.bets_won + user.bets_lost) > 0
          ? user.bets_won / (user.bets_won + user.bets_lost)
          : 0
      }));
      setUsers(rankedUsers);
      setIsLoading(false);
    }
  }, [data]);

  // Helper function to determine badge based on rank
  const getBadgeForRank = (rank: number) => {
    if (rank <= 3) return "Legendary";
    if (rank <= 10) return "Veteran";
    if (rank <= 20) return "Pro";
    if (rank <= 50) return "Expert";
    return "Rookie";
  };
  
  // Filter users based on search query
  useEffect(() => {
    if (data) {
      if (searchQuery.trim() === '') {
        setUsers(data.map((user, index) => ({
          ...user,
          rank: index + 1,
          badge: getBadgeForRank(index + 1),
          winRate: user.bets_won && (user.bets_won + user.bets_lost) > 0
            ? user.bets_won / (user.bets_won + user.bets_lost)
            : 0
        })));
      } else {
        const allUsers = data.map((user, index) => ({
          ...user,
          rank: index + 1,
          badge: getBadgeForRank(index + 1),
          winRate: user.bets_won && (user.bets_won + user.bets_lost) > 0
            ? user.bets_won / (user.bets_won + user.bets_lost)
            : 0
        }));
        
        const filtered = allUsers.filter(user => 
          user.username?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setUsers(filtered);
      }
    }
  }, [searchQuery, data]);
  
  // Find current user
  const currentUser = currentAuthUser 
    ? users.find(user => user.id === currentAuthUser.id)
    : null;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-muted-foreground">
                See where you rank among the top bettors
              </p>
            </div>
            
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="text"
                className="pl-10 pr-4 w-full md:w-64"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Player</CardTitle>
                <Trophy className="h-4 w-4 text-amber-400" />
              </CardHeader>
              <CardContent>
                {isLoading || isLoadingUsers ? (
                  <div className="flex items-center space-x-3 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : users.length > 0 ? (
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center bg-gray-100 text-gray-800 font-bold">
                      {users[0]?.username?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{users[0]?.username || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{users[0]?.balance?.toLocaleString() || "0"} LP</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No players found</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                {isLoading || isLoadingUsers ? (
                  <div className="flex items-center space-x-3 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : users.length > 0 ? (
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const sortedByWinRate = [...users].sort((a, b) => b.winRate - a.winRate);
                      const topUser = sortedByWinRate[0];
                      return (
                        <>
                          <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center bg-gray-100 text-gray-800 font-bold">
                            {topUser?.username?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-lg font-semibold">
                              {topUser?.username || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(topUser?.winRate * 100).toFixed(1)}% Win Rate
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No players found</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                {isLoading || isLoadingUsers ? (
                  <div className="flex items-center space-x-3 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : currentUser ? (
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">#{currentUser.rank || "--"}</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {currentUser?.rank ? `${currentUser.rank} / ${users.length}` : "Not ranked"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser?.badge || "Unranked"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Log in to see your rank</p>
                )}
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bettors</CardTitle>
                <Users className="h-4 w-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                {isLoading || isLoadingUsers ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <div className="text-xs text-muted-foreground">
                      Active during this season
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different leaderboards */}
          <Tabs defaultValue="balance" className="w-full">
            <TabsList className="w-full sm:w-auto grid sm:inline-flex grid-cols-3 mb-8">
              <TabsTrigger value="balance">Balance</TabsTrigger>
              <TabsTrigger value="winrate">Win Rate</TabsTrigger>
              <TabsTrigger value="streak">Streak</TabsTrigger>
            </TabsList>
            
            <TabsContent value="balance" className="space-y-4">
              {isLoading || isLoadingUsers ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-secondary/30 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-secondary rounded"></div>
                          <div className="h-3 w-16 bg-secondary/70 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-secondary rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load leaderboard data. Please try again later.
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  No users found. Try adjusting your search criteria.
                </div>
              ) : (
                <div className="space-y-2">
                  {users
                    .sort((a, b) => b.balance - a.balance)
                    .map((user) => (
                      <div 
                        key={user.id}
                        className={`flex justify-between items-center p-4 rounded-lg ${
                          currentAuthUser && user.id === currentAuthUser.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-secondary/30 hover:bg-secondary/50'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 relative">
                            {user.rank <= 3 && (
                              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">
                                {user.rank}
                              </div>
                            )}
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-gray-100 text-gray-800 font-bold">
                              {user.username?.charAt(0) || '?'}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">{user.username || `User-${user.id.substring(0, 6)}`}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.bets_won || 0} wins / {user.bets_lost || 0} losses
                            </p>
                          </div>
                        </div>
                        <div className="text-lg font-bold">{(user.balance || 0).toLocaleString()} LP</div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="winrate" className="space-y-4">
              {isLoading || isLoadingUsers ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-secondary/30 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-secondary rounded"></div>
                          <div className="h-3 w-16 bg-secondary/70 rounded"></div>
                        </div>
                      </div>
                      <div className="h-4 w-16 bg-secondary rounded"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load leaderboard data. Please try again later.
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  No users found. Try adjusting your search criteria.
                </div>
              ) : (
                <div className="space-y-2">
                  {users
                    .sort((a, b) => b.winRate - a.winRate)
                    .map((user, index) => (
                      <div 
                        key={user.id}
                        className={`flex justify-between items-center p-4 rounded-lg ${
                          currentAuthUser && user.id === currentAuthUser.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-secondary/30 hover:bg-secondary/50'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 relative">
                            {index < 3 && (
                              <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </div>
                            )}
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-gray-100 text-gray-800 font-bold">
                              {user.username?.charAt(0) || '?'}
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold">{user.username || `User-${user.id.substring(0, 6)}`}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.bets_won || 0} wins / {user.bets_lost || 0} losses
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-lg font-bold">{(user.winRate * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="streak" className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Streak leaderboard coming soon!</p>
                <p className="text-sm text-muted-foreground mt-2">
                  We're tracking winning streaks in the current season
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
