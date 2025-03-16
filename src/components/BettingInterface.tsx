
import { useState } from 'react';
import { Match } from '@/lib/constants';
import { ArrowRight, Trophy, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BettingInterfaceProps {
  match: Match;
  onClose: () => void;
}

const BettingInterface = ({ match, onClose }: BettingInterfaceProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(100);
  const { toast } = useToast();
  
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
  
  const placeBet = () => {
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
    
    const teamName = selectedTeam === match.teamA.id ? match.teamA.name : match.teamB.name;
    
    toast({
      title: "Bet placed successfully!",
      description: `You bet ${betAmount} LP on ${teamName}.`,
    });
    
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
            onClick={placeBet}
            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Place Bet
          </button>
        </div>
      </div>
    </div>
  );
};

export default BettingInterface;
