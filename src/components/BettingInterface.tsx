
import { useState } from 'react';
import { Match } from '@/lib/constants';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Loader2, Trophy, X } from 'lucide-react';
import { placeBet } from '@/services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface BettingInterfaceProps {
  match: Match;
  onClose: () => void;
}

const BettingInterface = ({ match, onClose }: BettingInterfaceProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabase();
  const navigate = useNavigate();
  
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 50) {
      setBetAmount(value);
    }
  };
  
  const calculatePotentialWinnings = () => {
    if (!selectedTeam) return 0;
    
    const odds = selectedTeam === match.teamA.id ? match.odds.teamA : match.odds.teamB;
    return Math.round(betAmount * odds);
  };
  
  const handlePlaceBet = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!selectedTeam) {
      toast({
        title: "Select a team",
        description: "Please select a team to place your bet.",
        variant: "destructive",
      });
      return;
    }
    
    if (betAmount < 50) {
      toast({
        title: "Invalid amount",
        description: "Minimum bet amount is 50 LP.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const teamOdds = selectedTeam === match.teamA.id ? match.odds.teamA : match.odds.teamB;
      const { success, message } = await placeBet(match.id, selectedTeam, betAmount, teamOdds);
      
      if (success) {
        toast({
          title: "Bet placed successfully!",
          description: message,
        });
        onClose();
      } else {
        toast({
          title: "Error placing bet",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      toast({
        title: "Error placing bet",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToLogin = () => {
    navigate('/login');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold">Place Your Bet</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-5">
          {/* Match Info */}
          <div className="flex items-center justify-between mb-6">
            {/* Team A */}
            <div className="flex flex-col items-center">
              <img
                src={match.teamA.logo}
                alt={match.teamA.name}
                className="w-12 h-12 mb-2 object-contain"
              />
              <span className="text-sm font-medium">{match.teamA.name}</span>
              <span className="text-xs text-muted-foreground mt-1">
                Odds: {match.odds.teamA.toFixed(2)}
              </span>
            </div>
            
            {/* VS */}
            <div className="px-4 py-1.5 rounded-full bg-slate-100">
              <span className="text-xs font-medium">VS</span>
            </div>
            
            {/* Team B */}
            <div className="flex flex-col items-center">
              <img
                src={match.teamB.logo}
                alt={match.teamB.name}
                className="w-12 h-12 mb-2 object-contain"
              />
              <span className="text-sm font-medium">{match.teamB.name}</span>
              <span className="text-xs text-muted-foreground mt-1">
                Odds: {match.odds.teamB.toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* Select Team */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Team</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  selectedTeam === match.teamA.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedTeam(match.teamA.id)}
              >
                <img
                  src={match.teamA.logo}
                  alt={match.teamA.name}
                  className="w-8 h-8 mb-2 object-contain"
                />
                <span className="text-sm font-medium">{match.teamA.name}</span>
              </button>
              
              <button
                type="button"
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  selectedTeam === match.teamB.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setSelectedTeam(match.teamB.id)}
              >
                <img
                  src={match.teamB.logo}
                  alt={match.teamB.name}
                  className="w-8 h-8 mb-2 object-contain"
                />
                <span className="text-sm font-medium">{match.teamB.name}</span>
              </button>
            </div>
          </div>
          
          {/* Bet Amount */}
          <div className="mb-6">
            <label htmlFor="bet-amount" className="block text-sm font-medium mb-2">
              Bet Amount
            </label>
            <div className="relative">
              <input
                id="bet-amount"
                type="number"
                min="50"
                value={betAmount}
                onChange={handleBetAmountChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-sm text-muted-foreground">LP</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Minimum bet: 50 LP</p>
          </div>
          
          {/* Potential Winnings */}
          {selectedTeam && (
            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center mb-2">
                <Trophy className="w-4 h-4 text-amber-500 mr-2" />
                <span className="text-sm font-medium">Potential Winnings</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{betAmount} LP</span>
                  <ArrowRight className="w-4 h-4 mx-2 text-slate-400" />
                  <span className="text-lg font-semibold text-primary">
                    {calculatePotentialWinnings()} LP
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Profit: {calculatePotentialWinnings() - betAmount} LP
                </div>
              </div>
            </div>
          )}
          
          {/* Place Bet Button */}
          <button
            onClick={handlePlaceBet}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Place Bet'
            )}
          </button>
        </div>
      </div>
      
      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={(open) => setShowLoginPrompt(open)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to place bets.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Login to your account to place bets and track your winnings.
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
              Cancel
            </Button>
            <Button onClick={navigateToLogin}>
              Login Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BettingInterface;
