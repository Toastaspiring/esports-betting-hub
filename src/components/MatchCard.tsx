
import { useState } from 'react';
import { Match } from '@/lib/constants';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  featured?: boolean;
}

const MatchCard = ({ match, featured = false }: MatchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const matchDate = new Date(match.date);
  const formattedDate = matchDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const formattedTime = matchDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div 
      className={`relative group overflow-hidden transition-all duration-300 ${
        featured 
          ? 'rounded-xl glass-card hover:shadow-md' 
          : 'rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* League Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
          <img 
            src={match.league.logo} 
            alt={match.league.name} 
            className="w-4 h-4 mr-1.5"
          />
          <span className="text-xs font-medium">{match.league.name}</span>
        </div>
      </div>
      
      {/* Live Badge */}
      {match.status === 'live' && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center bg-red-500 text-white rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse-subtle"></span>
            <span className="text-xs font-medium">LIVE</span>
          </div>
        </div>
      )}
      
      <div className={`p-4 ${featured ? 'sm:p-5' : ''}`}>
        {/* Teams Section */}
        <div className="flex items-center justify-between mb-4">
          {/* Team A */}
          <div className="flex-1 text-center pr-3">
            <div className="flex flex-col items-center">
              <div className="relative mb-2.5 group">
                <div className={`w-14 h-14 ${featured ? 'sm:w-16 sm:h-16' : ''} flex items-center justify-center rounded-full bg-slate-50 p-2.5 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
                  <img
                    src={match.teamA.logo}
                    alt={match.teamA.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-slate-100 text-xs font-medium rounded-full transition-all duration-300 ${isHovered ? 'bg-primary text-white scale-110' : ''}`}>
                  {(match.teamA.winRate * 100).toFixed(0)}%
                </div>
              </div>
              <h3 className="font-medium text-sm">{match.teamA.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Odds: {match.odds.teamA.toFixed(2)}</p>
            </div>
          </div>
          
          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-xs font-medium text-slate-400">VS</span>
            <div className="h-px w-8 bg-slate-200 my-2"></div>
          </div>
          
          {/* Team B */}
          <div className="flex-1 text-center pl-3">
            <div className="flex flex-col items-center">
              <div className="relative mb-2.5 group">
                <div className={`w-14 h-14 ${featured ? 'sm:w-16 sm:h-16' : ''} flex items-center justify-center rounded-full bg-slate-50 p-2.5 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
                  <img
                    src={match.teamB.logo}
                    alt={match.teamB.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-slate-100 text-xs font-medium rounded-full transition-all duration-300 ${isHovered ? 'bg-primary text-white scale-110' : ''}`}>
                  {(match.teamB.winRate * 100).toFixed(0)}%
                </div>
              </div>
              <h3 className="font-medium text-sm">{match.teamB.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Odds: {match.odds.teamB.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {/* Match Details */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">{formattedTime}</span>
          </div>
        </div>
        
        {/* Bet Button - Only visible on featured matches or on hover */}
        <div className={`mt-4 transition-all duration-300 ${!featured && !isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <button className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-md transition-colors">
            Place Bet
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
