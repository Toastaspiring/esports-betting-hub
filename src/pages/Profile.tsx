
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/hooks/useSupabase";
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Wallet, Trophy, BarChart2, Award, UserRound, User, LogOut, Edit } from 'lucide-react';
import { signOut } from '@/services/supabaseService';

const Profile = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch user profile data
  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['profileDetails', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  
  // Fetch user bets data
  const { data: bets } = useQuery({
    queryKey: ['userBets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
    }
  }, [profile]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign Out Failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      refetch();
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate stats
  const winRate = profile?.bets_won && (profile.bets_won + profile.bets_lost) > 0
    ? profile.bets_won / (profile.bets_won + profile.bets_lost)
    : 0;
  
  const wonBets = bets?.filter(bet => bet.status === 'won') || [];
  const pendingBets = bets?.filter(bet => bet.status === 'pending') || [];
  const lostBets = bets?.filter(bet => bet.status === 'lost') || [];
  
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-24 pb-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle>Profile</CardTitle>
                  {!editMode && (
                    <Button variant="ghost" size="icon" onClick={() => setEditMode(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {username ? username.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {editMode ? (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Username</label>
                      <Input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setEditMode(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveProfile}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{profile?.username || "Anonymous User"}</h2>
                    <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
                    
                    <div className="w-full mt-6 space-y-4">
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Balance</span>
                        </div>
                        <span className="font-medium">{profile?.balance?.toLocaleString() || "0"} LP</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Bets Won</span>
                        </div>
                        <span className="font-medium">{profile?.bets_won || "0"}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <BarChart2 className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Win Rate</span>
                        </div>
                        <span className="font-medium">{(winRate * 100).toFixed(1)}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Rank</span>
                        </div>
                        <span className="font-medium">#-</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">Betting History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Bets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{bets?.length || 0}</div>
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
                
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest betting activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bets && bets.length > 0 ? (
                      <div className="space-y-4">
                        {bets.slice(0, 5).map((bet) => (
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
                  {bets && bets.length > 5 && (
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
              </TabsContent>
              
              <TabsContent value="history">
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
                        
                        {/* We could add a chart here in the future */}
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
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Email</label>
                      <Input value={user?.email || ""} disabled />
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">Username</label>
                      <div className="flex gap-2">
                        <Input 
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                        <Button onClick={handleSaveProfile} disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium block mb-1 text-red-500">Danger Zone</label>
                      <Button variant="destructive" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
