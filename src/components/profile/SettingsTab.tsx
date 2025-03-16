
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut } from 'lucide-react';
import { RiotAccount } from './RiotAccount';
import { RiotApiResponse } from '@/types/riotTypes';

interface SettingsTabProps {
  user: any;
  username: string;
  setUsername: (value: string) => void;
  profile: any;
  riotId: string;
  setRiotId: (value: string) => void;
  riotData: any;
  hasSummoner: boolean;
  onRefetch: () => void;
  onSaveProfile: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isLoading: boolean;
}

export const SettingsTab = ({ 
  user, 
  username, 
  setUsername, 
  profile, 
  riotId, 
  setRiotId, 
  riotData, 
  hasSummoner,
  onRefetch, 
  onSaveProfile, 
  onSignOut, 
  isLoading 
}: SettingsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Information</h3>
          
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
              <Button onClick={onSaveProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Riot Games Account</h3>
          
          <RiotAccount 
            riotId={profile?.riot_id || riotId}
            setRiotId={setRiotId}
            riotData={riotData}
            hasSummoner={hasSummoner}
            onSuccess={onRefetch}
          />
        </div>
        
        <Separator />
        
        <div className="pt-4">
          <label className="text-sm font-medium block mb-1 text-red-500">Danger Zone</label>
          <Button variant="destructive" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
