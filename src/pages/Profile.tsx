import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Calendar, CreditCard, History, Settings, User, Award, BadgeCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { MOCK_USER, MOCK_MATCHES } from '@/lib/constants';

// Mock user bet history
const MOCK_BET_HISTORY = [
  {
    id: 1,
    match: {
      id: MOCK_MATCHES[0]?.id,
      teamA: MOCK_MATCHES[0]?.teamA,
      teamB: MOCK_MATCHES[0]?.teamB,
      league: MOCK_MATCHES[0]?.league,
      date: new Date(2023, 8, 5, 15, 30)
    },
    betOn: MOCK_MATCHES[0]?.teamA?.name,
    amount: 1500,
    odds: 2.1,
    result: "win",
    profit: 1650,
    settled: true
  },
  {
    id: 2,
    match: {
      id: MOCK_MATCHES[1]?.id,
      teamA: MOCK_MATCHES[1]?.teamA,
      teamB: MOCK_MATCHES[1]?.teamB,
      league: MOCK_MATCHES[1]?.league,
      date: new Date(2023, 8, 2, 18, 0)
    },
    betOn: MOCK_MATCHES[1]?.teamB?.name,
    amount: 800,
    odds: 1.75,
    result: "loss",
    profit: -800,
    settled: true
  },
  {
    id: 3,
    match: {
      id: MOCK_MATCHES[2]?.id,
      teamA: MOCK_MATCHES[2]?.teamA,
      teamB: MOCK_MATCHES[2]?.teamB,
      league: MOCK_MATCHES[2]?.league,
      date: new Date(2023, 8, 10, 20, 0)
    },
    betOn: MOCK_MATCHES[2]?.teamA?.name,
    amount: 2000,
    odds: 1.5,
    result: "pending",
    profit: 0,
    settled: false
  },
  {
    id: 4,
    match: {
      id: MOCK_MATCHES[3]?.id,
      teamA: MOCK_MATCHES[3]?.teamA,
      teamB: MOCK_MATCHES[3]?.teamB,
      league: MOCK_MATCHES[3]?.league,
      date: new Date(2023, 7, 28, 16, 0)
    },
    betOn: MOCK_MATCHES[3]?.teamB?.name,
    amount: 1200,
    odds: 1.9,
    result: "win",
    profit: 1080,
    settled: true
  },
  {
    id: 5,
    match: {
      id: MOCK_MATCHES[0]?.id,
      teamA: MOCK_MATCHES[0]?.teamA,
      teamB: MOCK_MATCHES[0]?.teamB,
      league: MOCK_MATCHES[0]?.league,
      date: new Date(2023, 7, 25, 14, 30)
    },
    betOn: MOCK_MATCHES[0]?.teamA?.name,
    amount: 1000,
    odds: 2.5,
    result: "loss",
    profit: -1000,
    settled: true
  }
];

// Mock achievements
const MOCK_ACHIEVEMENTS = [
  {
    id: 1,
    name: "First Blood",
    description: "Place your first bet",
    icon: <Award className="h-6 w-6 text-blue-400" />,
    progress: 100,
    completed: true,
    date: new Date(2023, 6, 15)
  },
  {
    id: 2,
    name: "Hot Streak",
    description: "Win 5 bets in a row",
    icon: <TrendingUp className="h-6 w-6 text-green-400" />,
    progress: 60,
    completed: false,
    current: 3,
    required: 5
  },
  {
    id: 3,
    name: "High Roller",
    description: "Place a bet of 5,000 LP or more",
    icon: <CreditCard className="h-6 w-6 text-purple-400" />,
    progress: 40,
    completed: false,
    current: 2000,
    required: 5000
  },
  {
    id: 4,
    name: "Analyst",
    description: "Win 10 bets total",
    icon: <BarChart3 className="h-6 w-6 text-amber-400" />,
    progress: 100,
    completed: true,
    date: new Date(2023, 7, 10)
  },
  {
    id: 5,
    name: "Underdog Lover",
    description: "Win a bet with odds of 3.0 or higher",
    icon: <BadgeCheck className="h-6 w-6 text-red-400" />,
    progress: 0,
    completed: false,
    current: 0,
    required: 1
  }
];

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate betting stats
  const totalBets = MOCK_USER.betsWon + MOCK_USER.betsLost;
  const winPercentage = (MOCK_USER.betsWon / totalBets) * 100;
  const totalWagered = MOCK_BET_HISTORY.reduce((total, bet) => total + bet.amount, 0);
  const totalProfit = MOCK_BET_HISTORY
    .filter(bet => bet.settled)
    .reduce((total, bet) => total + bet.profit, 0);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <Card className="glass-card overflow-hidden">
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-12 mb-4">
                  <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.username} />
                    <AvatarFallback>{MOCK_USER.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold">{MOCK_USER.username}</h2>
                  <p className="text-sm text-muted-foreground">Member since July 2023</p>
                </div>
                <div className="flex justify-center space-x-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Rookie
                  </span>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium">
                    Rank #24
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Navigation */}
            <Card className="glass-card">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <a 
                    href="#overview" 
                    className="flex items-center space-x-3 px-4 py-3 text-primary font-medium border-l-2 border-primary"
                  >
                    <User className="h-5 w-5" />
                    <span>Overview</span>
                  </a>
                  <a 
                    href="#bet-history" 
                    className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <History className="h-5 w-5" />
                    <span>Bet History</span>
                  </a>
                  <a 
                    href="#achievements" 
                    className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Award className="h-5 w-5" />
                    <span>Achievements</span>
                  </a>
                  <a 
                    href="/settings" 
                    className="flex items-center space-x-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
            
            {/* Balance Card */}
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{MOCK_USER.balance.toLocaleString()} LP</div>
                <div className="text-xs text-muted-foreground mb-4">
                  {totalProfit >= 0 ? (
                    <span className="text-green-500">+{totalProfit.toLocaleString()} LP</span>
                  ) : (
                    <span className="text-red-500">{totalProfit.toLocaleString()} LP</span>
                  )} lifetime profit
                </div>
                <Button className="w-full" size="sm">Get Daily Bonus</Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Stats Overview */}
            <Card className="glass-card" id="overview">
              <CardHeader>
                <CardTitle>Betting Performance</CardTitle>
                <CardDescription>Your betting statistics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                    <p className="text-2xl font-bold">{winPercentage.toFixed(1)}%</p>
                    <div className="w-full bg-secondary/70 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: `${winPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Bets</p>
                    <p className="text-2xl font-bold">{totalBets}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {MOCK_USER.betsWon} wins, {MOCK_USER.betsLost} losses
                    </p>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Wagered</p>
                    <p className="text-2xl font-bold">{totalWagered.toLocaleString()} LP</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Across {totalBets} bets
                    </p>
                  </div>
                  
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Avg. Bet Size</p>
                    <p className="text-2xl font-bold">
                      {(totalWagered / totalBets).toFixed(0)} LP
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ROI: {(totalProfit / totalWagered * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                
                <div className="text-center pt-4 pb-2">
                  <Button variant="outline">View Detailed Statistics</Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Bets */}
            <Card className="glass-card" id="bet-history">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Bets</CardTitle>
                  <CardDescription>Your most recent betting activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                  <History className="h-4 w-4 mr-1" />
                  View All History
                </Button>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Bets</TabsTrigger>
                    <TabsTrigger value="wins">Wins</TabsTrigger>
                    <TabsTrigger value="losses">Losses</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex items-center p-4 rounded-lg bg-secondary/30">
                              <div className="w-12 h-8 bg-secondary/50 rounded mr-4"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
                                <div className="h-3 bg-secondary/50 rounded w-1/2"></div>
                              </div>
                              <div className="w-16 h-6 bg-secondary/50 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          {MOCK_BET_HISTORY.map((bet) => (
                            <div
                              key={bet.id}
                              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary/30 mb-3 hover:bg-secondary/50 transition-colors"
                            >
                              <div className="flex items-center mb-2 md:mb-0">
                                <div className="flex-shrink-0 w-16 mr-4 text-center">
                                  <div className="font-medium">
                                    {bet.match.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {bet.match.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="font-medium">
                                    {bet.match.teamA.name} vs {bet.match.teamB.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <span className="mr-2">{bet.match.league.name}</span>
                                    <span>• Bet on {bet.betOn}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0">
                                <div className="md:mr-6 flex flex-col md:items-end">
                                  <div className="text-sm font-medium">
                                    {bet.amount.toLocaleString()} LP @ {bet.odds.toFixed(2)}
                                  </div>
                                  <div className="text-xs">
                                    Potential: {(bet.amount * bet.odds).toFixed(0)} LP
                                  </div>
                                </div>
                                <div className="md:w-24 text-right">
                                  {bet.result === 'win' && (
                                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                                      +{bet.profit.toLocaleString()} LP
                                    </span>
                                  )}
                                  {bet.result === 'loss' && (
                                    <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">
                                      {bet.profit.toLocaleString()} LP
                                    </span>
                                  )}
                                  {bet.result === 'pending' && (
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium">
                                      Pending
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  
                  <TabsContent value="wins">
                    <div className="space-y-4">
                      {MOCK_BET_HISTORY.filter(bet => bet.result === 'win').map((bet) => (
                        <div
                          key={bet.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary/30 mb-3"
                        >
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="flex-shrink-0 w-16 mr-4 text-center">
                              <div className="font-medium">
                                {bet.match.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {bet.match.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium">
                                {bet.match.teamA.name} vs {bet.match.teamB.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <span className="mr-2">{bet.match.league.name}</span>
                                <span>• Bet on {bet.betOn}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0">
                            <div className="md:mr-6 flex flex-col md:items-end">
                              <div className="text-sm font-medium">
                                {bet.amount.toLocaleString()} LP @ {bet.odds.toFixed(2)}
                              </div>
                              <div className="text-xs">
                                Potential: {(bet.amount * bet.odds).toFixed(0)} LP
                              </div>
                            </div>
                            <div className="md:w-24 text-right">
                              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                                +{bet.profit.toLocaleString()} LP
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {MOCK_BET_HISTORY.filter(bet => bet.result === 'win').length === 0 && (
                        <div className="text-center py-8">
                          <div className="mb-3 flex justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">No winning bets found</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="losses">
                    <div className="space-y-4">
                      {MOCK_BET_HISTORY.filter(bet => bet.result === 'loss').map((bet) => (
                        <div
                          key={bet.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary/30 mb-3"
                        >
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="flex-shrink-0 w-16 mr-4 text-center">
                              <div className="font-medium">
                                {bet.match.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {bet.match.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium">
                                {bet.match.teamA.name} vs {bet.match.teamB.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <span className="mr-2">{bet.match.league.name}</span>
                                <span>• Bet on {bet.betOn}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0">
                            <div className="md:mr-6 flex flex-col md:items-end">
                              <div className="text-sm font-medium">
                                {bet.amount.toLocaleString()} LP @ {bet.odds.toFixed(2)}
                              </div>
                              <div className="text-xs">
                                Potential: {(bet.amount * bet.odds).toFixed(0)} LP
                              </div>
                            </div>
                            <div className="md:w-24 text-right">
                              <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium">
                                {bet.profit.toLocaleString()} LP
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {MOCK_BET_HISTORY.filter(bet => bet.result === 'loss').length === 0 && (
                        <div className="text-center py-8">
                          <div className="mb-3 flex justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">No losing bets found</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pending">
                    <div className="space-y-4">
                      {MOCK_BET_HISTORY.filter(bet => bet.result === 'pending').map((bet) => (
                        <div
                          key={bet.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary/30 mb-3"
                        >
                          <div className="flex items-center mb-2 md:mb-0">
                            <div className="flex-shrink-0 w-16 mr-4 text-center">
                              <div className="font-medium">
                                {bet.match.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {bet.match.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            
                            <div>
                              <div className="font-medium">
                                {bet.match.teamA.name} vs {bet.match.teamB.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <span className="mr-2">{bet.match.league.name}</span>
                                <span>• Bet on {bet.betOn}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0">
                            <div className="md:mr-6 flex flex-col md:items-end">
                              <div className="text-sm font-medium">
                                {bet.amount.toLocaleString()} LP @ {bet.odds.toFixed(2)}
                              </div>
                              <div className="text-xs">
                                Potential: {(bet.amount * bet.odds).toFixed(0)} LP
                              </div>
                            </div>
                            <div className="md:w-24 text-right">
                              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium">
                                Pending
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {MOCK_BET_HISTORY.filter(bet => bet.result === 'pending').length === 0 && (
                        <div className="text-center py-8">
                          <div className="mb-3 flex justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">No pending bets</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="text-center mt-6 md:hidden">
                  <Button variant="outline" size="sm" className="w-full">
                    <History className="h-4 w-4 mr-2" />
                    View All History
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Achievements */}
            <Card className="glass-card" id="achievements">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Unlock badges by completing challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {isLoading ? (
                    <>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse p-4 rounded-lg bg-secondary/30">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-secondary/50"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-secondary/50 rounded w-1/2"></div>
                              <div className="h-3 bg-secondary/50 rounded w-3/4"></div>
                              <div className="h-2 bg-secondary/50 rounded w-full"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {MOCK_ACHIEVEMENTS.map((achievement) => (
                        <div 
                          key={achievement.id}
                          className={`p-4 rounded-lg ${achievement.completed ? 'bg-primary/10' : 'bg-secondary/30'}`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              achievement.completed ? 'bg-primary/20' : 'bg-secondary/50'
                            }`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold">{achievement.name}</h4>
                                {achievement.completed && (
                                  <span className="text-xs font-medium text-green-500 flex items-center">
                                    <BadgeCheck className="h-3 w-3 mr-1" />
                                    Unlocked
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                              <div className="space-y-1">
                                <Progress value={achievement.progress} className="h-1.5" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  {achievement.completed ? (
                                    <span>Completed {achievement.date.toLocaleDateString()}</span>
                                  ) : (
                                    <>
                                      <span>Progress: {achievement.current} / {achievement.required}</span>
                                      <span>{achievement.progress}%</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                <div className="text-center">
                  <Button variant="outline">View All Achievements</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
