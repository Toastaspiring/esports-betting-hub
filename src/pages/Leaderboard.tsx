
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Trophy, TrendingUp, Award, Users } from 'lucide-react';
import { MOCK_USER } from '@/lib/constants';

// Mock leaderboard data for demonstration
const MOCK_LEADERBOARD = [
  {
    id: 1,
    username: "Faker",
    avatar: "https://i.pravatar.cc/150?img=1",
    winRate: 0.72,
    balance: 28500,
    betsWon: 45,
    betsLost: 13,
    rank: 1,
    badge: "Legendary"
  },
  {
    id: 2,
    username: "Uzi",
    avatar: "https://i.pravatar.cc/150?img=2",
    winRate: 0.68,
    balance: 22300,
    betsWon: 42,
    betsLost: 18,
    rank: 2,
    badge: "Veteran"
  },
  {
    id: 3,
    username: "Perkz",
    avatar: "https://i.pravatar.cc/150?img=3",
    winRate: 0.65,
    balance: 19400,
    betsWon: 38,
    betsLost: 20,
    rank: 3,
    badge: "Veteran"
  },
  {
    id: 4,
    username: "Caps",
    avatar: "https://i.pravatar.cc/150?img=4", 
    winRate: 0.63,
    balance: 18200,
    betsWon: 35,
    betsLost: 21,
    rank: 4,
    badge: "Pro"
  },
  {
    id: 5,
    username: "Bjergsen",
    avatar: "https://i.pravatar.cc/150?img=5",
    winRate: 0.61,
    balance: 16800,
    betsWon: 33,
    betsLost: 21,
    rank: 5,
    badge: "Pro"
  },
  {
    id: 6,
    username: "Rekkles",
    avatar: "https://i.pravatar.cc/150?img=6",
    winRate: 0.60,
    balance: 15500,
    betsWon: 30,
    betsLost: 20,
    rank: 6,
    badge: "Expert"
  },
  {
    id: 7,
    username: "Doublelift",
    avatar: "https://i.pravatar.cc/150?img=7",
    winRate: 0.58,
    balance: 14300,
    betsWon: 29,
    betsLost: 21,
    rank: 7,
    badge: "Expert"
  },
  // Current user somewhere in the middle
  {
    id: 8,
    username: MOCK_USER.username,
    avatar: MOCK_USER.avatar,
    winRate: MOCK_USER.winRate,
    balance: MOCK_USER.balance,
    betsWon: MOCK_USER.betsWon,
    betsLost: MOCK_USER.betsLost,
    rank: 24,
    badge: "Rookie"
  },
  {
    id: 9,
    username: "TheShy",
    avatar: "https://i.pravatar.cc/150?img=8",
    winRate: 0.54,
    balance: 9500,
    betsWon: 27,
    betsLost: 23,
    rank: 43,
    badge: "Rookie"
  },
  {
    id: 10,
    username: "Chovy",
    avatar: "https://i.pravatar.cc/150?img=9",
    winRate: 0.52,
    balance: 8900,
    betsWon: 26,
    betsLost: 24,
    rank: 51,
    badge: "Rookie"
  },
];

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(MOCK_LEADERBOARD);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setUsers(MOCK_LEADERBOARD);
    } else {
      const filtered = MOCK_LEADERBOARD.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
    }
  }, [searchQuery]);
  
  // Find current user
  const currentUser = users.find(user => user.username === MOCK_USER.username);
  
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
                <div className="flex items-center space-x-3">
                  <img 
                    src={users[0]?.avatar || "https://i.pravatar.cc/150?img=1"} 
                    alt={users[0]?.username || "Top Player"}
                    className="h-10 w-10 rounded-full border border-primary/20" 
                  />
                  <div>
                    <p className="text-lg font-semibold">{users[0]?.username || "Loading..."}</p>
                    <p className="text-xs text-muted-foreground">{users[0]?.balance.toLocaleString() || "0"} LP</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <img 
                    src={users.sort((a, b) => b.winRate - a.winRate)[0]?.avatar || "https://i.pravatar.cc/150?img=1"} 
                    alt="Best Win Rate"
                    className="h-10 w-10 rounded-full border border-primary/20" 
                  />
                  <div>
                    <p className="text-lg font-semibold">
                      {users.sort((a, b) => b.winRate - a.winRate)[0]?.username || "Loading..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((users.sort((a, b) => b.winRate - a.winRate)[0]?.winRate || 0) * 100).toFixed(1)}% Win Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
                <Award className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">#{currentUser?.rank || "--"}</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {currentUser ? `${currentUser.rank} / ${users.length}` : "Loading..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser?.badge || "Unranked"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bettors</CardTitle>
                <Users className="h-4 w-4 text-violet-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-xs text-muted-foreground">
                  Active during this season
                </div>
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
              {isLoading ? (
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
              ) : (
                <div className="space-y-2">
                  {users
                    .sort((a, b) => b.balance - a.balance)
                    .map((user) => (
                      <div 
                        key={user.id}
                        className={`flex justify-between items-center p-4 rounded-lg ${
                          user.username === MOCK_USER.username
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
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-10 h-10 rounded-full border border-white/10"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.betsWon} wins / {user.betsLost} losses
                            </p>
                          </div>
                        </div>
                        <div className="text-lg font-bold">{user.balance.toLocaleString()} LP</div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="winrate" className="space-y-4">
              {isLoading ? (
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
              ) : (
                <div className="space-y-2">
                  {users
                    .sort((a, b) => b.winRate - a.winRate)
                    .map((user, index) => (
                      <div 
                        key={user.id}
                        className={`flex justify-between items-center p-4 rounded-lg ${
                          user.username === MOCK_USER.username
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
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-10 h-10 rounded-full border border-white/10"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.betsWon} wins / {user.betsLost} losses
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
