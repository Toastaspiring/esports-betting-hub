
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Edit, LogOut, Wallet, Trophy, BarChart2, Award } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSidebarProps {
  user: any;
  profile: any;
  hasSummoner: boolean;
  riotData: any;
  onSignOut: () => Promise<void>;
  onRefetch: () => void;
}

export const ProfileSidebar = ({ 
  user, 
  profile, 
  hasSummoner, 
  riotData, 
  onSignOut, 
  onRefetch 
}: ProfileSidebarProps) => {
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      onRefetch();
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

  const winRate = profile?.bets_won && (profile.bets_won + profile.bets_lost) > 0
    ? profile.bets_won / (profile.bets_won + profile.bets_lost)
    : 0;

  // Determine the profile picture URL
  let profileIconUrl = "";
  let displayName = username || "Anonymous User";
  let riotIdDisplay = profile?.riot_id || "";
  let summonerLevel = 0;

  if (hasSummoner && riotData.summoner && riotData.summoner.profileIconId) {
    profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${riotData.summoner.profileIconId}.png`;
    summonerLevel = riotData.summoner.summonerLevel || 0;
  } else if (riotData && riotData.profilePictureUrl) {
    profileIconUrl = riotData.profilePictureUrl;
  } 

  if (riotData && riotData.account) {
    riotIdDisplay = `${riotData.account.gameName}#${riotData.account.tagLine}`;
  } else if (riotData && riotData.summoner && riotData.summoner.riotId) {
    riotIdDisplay = riotData.summoner.riotId;
  }
  
  if (!displayName && riotData && riotData.account) {
    displayName = riotData.account.gameName;
  } else if (!displayName && riotData && riotData.summoner) {
    displayName = riotData.summoner.name;
  }

  return (
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
          {profileIconUrl ? (
            <AvatarImage 
              src={profileIconUrl}
              alt="Profile" 
            />
          ) : (
            <AvatarImage src={profile?.avatar_url || ""} />
          )}
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
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
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
            
            {riotIdDisplay ? (
              <div className="mt-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                Riot ID: {riotIdDisplay}
              </div>
            ) : null}
            
            {hasSummoner && summonerLevel ? (
              <div className="mt-2 text-xs text-muted-foreground">
                Summoner Level: {summonerLevel}
              </div>
            ) : null}
            
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
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
};
