import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { linkRiotAccount, refreshRiotAccountData } from '@/services/riotService';
import { parseRiotData } from '@/services/profileService';

interface RiotAccountProps {
  riotId: string;
  setRiotId: (value: string) => void;
  riotData: any;
  hasSummoner: boolean;
  onSuccess: () => void;
}

export const RiotAccount = ({ riotId, setRiotId, riotData, hasSummoner, onSuccess }: RiotAccountProps) => {
  const { toast } = useToast();
  const [isConnectingRiot, setIsConnectingRiot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Parse riot data to ensure proper typing
  const parsedRiotData = parseRiotData(riotData);

  const connectRiotAccount = async () => {
    if (!riotId) return;
    
    setIsConnectingRiot(true);
    try {
      const result = await linkRiotAccount(riotId);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to link Riot account');
      }
      
      toast({
        title: "Riot Account Connected",
        description: "Your Riot Games account has been successfully linked.",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error linking Riot account:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to link Riot Games account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnectingRiot(false);
    }
  };
  
  const handleRefreshRiotData = async () => {
    try {
      setIsLoading(true);
      await refreshRiotAccountData();
      toast({
        title: "Riot Data Refreshed",
        description: "Your Riot Games account data has been updated.",
      });
      onSuccess();
    } catch (error) {
      console.error('Error refreshing Riot data:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh Riot Games account data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (riotId) {
    return (
      <div>
        <Alert className="bg-green-50 border-green-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <AlertDescription>
              Your Riot Games account is connected: <strong>{riotId}</strong>
              {hasSummoner && parsedRiotData?.summoner && (
                <div className="mt-1 text-sm">
                  Summoner Level: {parsedRiotData.summoner.summonerLevel}
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
        
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRefreshRiotData}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh Riot Account Data
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-3">
        Link your Riot Games account to access additional features and display your in-game statistics.
      </p>
      
      <div className="flex gap-2">
        <Input 
          value={riotId} 
          onChange={(e) => setRiotId(e.target.value)}
          placeholder="Enter your Riot ID (e.g., Username#TAG)"
        />
        <Button 
          onClick={connectRiotAccount} 
          disabled={isConnectingRiot || !riotId}
        >
          {isConnectingRiot ? "Connecting..." : "Connect"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Your Riot ID format should be Username#TAG
      </p>
    </div>
  );
};
