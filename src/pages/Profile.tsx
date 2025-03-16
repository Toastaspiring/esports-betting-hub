
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/hooks/useSupabase";
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOut } from '@/services/supabaseService';
import { useToast } from '@/components/ui/use-toast';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { OverviewTab } from '@/components/profile/OverviewTab';
import { HistoryTab } from '@/components/profile/HistoryTab';
import { SettingsTab } from '@/components/profile/SettingsTab';
import { parseRiotData } from '@/services/profileService';
import { RiotApiResponse } from '@/types/riotTypes';

interface RiotSummoner {
  profileIconId?: number;
  summonerLevel?: number;
  [key: string]: any;
}

interface RiotData {
  summoner?: RiotSummoner;
  [key: string]: any;
}

const hasValidSummoner = (data: any): data is RiotData => {
  return !!data && typeof data === 'object' && 'summoner' in data && !!data.summoner;
};

const Profile = () => {
  const { user, isMockSession, mockProfile } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [riotId, setRiotId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['profileDetails', user?.id, isMockSession],
    queryFn: async () => {
      if (!user) return null;
      
      // Return mock profile for mock sessions to avoid database calls
      if (isMockSession && mockProfile) {
        console.log('Using mock profile data', mockProfile);
        return mockProfile;
      }
      
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
  
  const { data: bets } = useQuery({
    queryKey: ['userBets', user?.id, isMockSession],
    queryFn: async () => {
      if (!user) return [];
      
      // Return mock bets for mock sessions
      if (isMockSession) {
        console.log('Using mock bets data');
        return [
          { 
            id: 'mock-bet-1', 
            status: 'won', 
            match_id: 'mock-match-1', 
            created_at: new Date().toISOString(),
            amount: 1500,
            odds: 2.5,
            potential_win: 3750,
            user_id: user.id
          },
          { 
            id: 'mock-bet-2', 
            status: 'lost', 
            match_id: 'mock-match-2', 
            created_at: new Date(Date.now() - 86400000).toISOString(),
            amount: 1000,
            odds: 1.8,
            potential_win: 1800,
            user_id: user.id
          },
          { 
            id: 'mock-bet-3', 
            status: 'pending', 
            match_id: 'mock-match-3', 
            created_at: new Date(Date.now() - 172800000).toISOString(),
            amount: 2000,
            odds: 3.2,
            potential_win: 6400,
            user_id: user.id
          }
        ];
      }
      
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
      setRiotId(profile.riot_id || "");
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
      // Skip database update for mock sessions
      if (isMockSession) {
        toast({
          title: "Profile Updated",
          description: "Mock profile has been updated (simulation).",
        });
        setIsLoading(false);
        return;
      }
      
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
  
  const parsedRiotData = parseRiotData(profile?.riot_data);
  const hasSummoner = !!parsedRiotData?.summoner;
  
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
          <div className="col-span-1">
            <ProfileSidebar 
              user={user}
              profile={profile}
              hasSummoner={hasSummoner}
              riotData={parsedRiotData}
              onSignOut={handleSignOut}
              onRefetch={refetch}
            />
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">Betting History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab bets={bets || []} profile={profile} />
              </TabsContent>
              
              <TabsContent value="history">
                <HistoryTab bets={bets || []} />
              </TabsContent>
              
              <TabsContent value="settings">
                <SettingsTab 
                  user={user}
                  username={username}
                  setUsername={setUsername}
                  profile={profile}
                  riotId={riotId}
                  setRiotId={setRiotId}
                  riotData={parsedRiotData}
                  hasSummoner={hasSummoner}
                  onRefetch={refetch}
                  onSaveProfile={handleSaveProfile}
                  onSignOut={handleSignOut}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
