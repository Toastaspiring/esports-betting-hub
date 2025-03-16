
import { useState, useEffect } from 'react';
import { Match } from '@/lib/constants';

interface TournamentBracketProps {
  matches: Match[];
}

interface BracketMatch {
  id: string;
  round: number;
  position: number;
  teamA: {
    id: string;
    name: string;
    logo: string;
  } | null;
  teamB: {
    id: string;
    name: string;
    logo: string;
  } | null;
  winner: string | null;
  nextMatchId?: string;
}

const TournamentBracket = ({ matches }: TournamentBracketProps) => {
  const [bracketData, setBracketData] = useState<BracketMatch[][]>([]);
  
  // Generate bracket data based on matches
  useEffect(() => {
    if (!matches.length) return;
    
    // In a real app, we would have a proper bracket structure from the backend
    // Here we'll simulate a simplified bracket structure
    
    // Group completed matches as early rounds
    const completedMatches = matches.filter(match => match.status === 'completed');
    
    // Group upcoming matches as later rounds
    const upcomingMatches = matches.filter(match => match.status === 'upcoming');
    
    // For this simplified version, we'll create a mock bracket structure
    // Round 1 (quarterfinals)
    const round1: BracketMatch[] = completedMatches.slice(0, 4).map((match, index) => ({
      id: match.id,
      round: 1,
      position: index + 1,
      teamA: {
        id: match.teamA.id,
        name: match.teamA.name,
        logo: match.teamA.logo,
      },
      teamB: {
        id: match.teamB.id,
        name: match.teamB.name,
        logo: match.teamB.logo,
      },
      winner: Math.random() > 0.5 ? match.teamA.id : match.teamB.id,
      nextMatchId: `semifinal-${Math.floor(index / 2) + 1}`,
    }));
    
    // Round 2 (semifinals)
    const round2: BracketMatch[] = upcomingMatches.slice(0, 2).map((match, index) => ({
      id: `semifinal-${index + 1}`,
      round: 2,
      position: index + 1,
      teamA: index === 0 
        ? { id: round1[0]?.winner === round1[0]?.teamA?.id ? round1[0]?.teamA?.id : round1[0]?.teamB?.id,
            name: round1[0]?.winner === round1[0]?.teamA?.id ? round1[0]?.teamA?.name : round1[0]?.teamB?.name,
            logo: round1[0]?.winner === round1[0]?.teamA?.id ? round1[0]?.teamA?.logo : round1[0]?.teamB?.logo }
        : null,
      teamB: index === 0 
        ? { id: round1[1]?.winner === round1[1]?.teamA?.id ? round1[1]?.teamA?.id : round1[1]?.teamB?.id,
            name: round1[1]?.winner === round1[1]?.teamA?.id ? round1[1]?.teamA?.name : round1[1]?.teamB?.name,
            logo: round1[1]?.winner === round1[1]?.teamA?.id ? round1[1]?.teamA?.logo : round1[1]?.teamB?.logo }
        : null,
      winner: null,
      nextMatchId: 'final',
    }));
    
    // Round 3 (final)
    const round3: BracketMatch[] = [{
      id: 'final',
      round: 3,
      position: 1,
      teamA: null,
      teamB: null,
      winner: null,
    }];
    
    setBracketData([round1, round2, round3]);
  }, [matches]);
  
  if (bracketData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bracket data available</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto pb-6">
      <div className="inline-flex gap-8 min-w-[800px]">
        {bracketData.map((round, roundIndex) => (
          <div key={`round-${roundIndex}`} className="flex flex-col gap-4">
            <div className="h-10 flex items-center justify-center mb-2">
              <h3 className="text-sm font-medium">
                {roundIndex === 0 ? 'Quarterfinals' : 
                 roundIndex === 1 ? 'Semifinals' : 
                 roundIndex === 2 ? 'Final' : `Round ${roundIndex + 1}`}
              </h3>
            </div>
            
            <div className="flex flex-col gap-6">
              {round.map((match, matchIndex) => {
                const spacingClass = roundIndex === 0 
                  ? 'my-2' 
                  : roundIndex === 1 
                    ? 'my-8' 
                    : 'my-24';
                
                return (
                  <div key={match.id} className={`bracket-match ${spacingClass}`}>
                    <div className="w-48 border rounded-md overflow-hidden bg-card">
                      {/* Team A */}
                      <div className={`p-2 flex items-center gap-2 ${
                        match.winner === match.teamA?.id 
                          ? 'bg-green-500/10 border-b border-green-500/30' 
                          : 'border-b border-border'
                      }`}>
                        {match.teamA ? (
                          <>
                            <div className="w-6 h-6 bg-secondary rounded-full p-0.5 flex-shrink-0">
                              <img 
                                src={match.teamA.logo} 
                                alt={match.teamA.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-xs font-medium truncate">
                              {match.teamA.name}
                            </span>
                            {match.winner === match.teamA.id && (
                              <div className="ml-auto w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">TBD</span>
                        )}
                      </div>
                      
                      {/* Team B */}
                      <div className={`p-2 flex items-center gap-2 ${
                        match.winner === match.teamB?.id 
                          ? 'bg-green-500/10' 
                          : ''
                      }`}>
                        {match.teamB ? (
                          <>
                            <div className="w-6 h-6 bg-secondary rounded-full p-0.5 flex-shrink-0">
                              <img 
                                src={match.teamB.logo} 
                                alt={match.teamB.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-xs font-medium truncate">
                              {match.teamB.name}
                            </span>
                            {match.winner === match.teamB.id && (
                              <div className="ml-auto w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">TBD</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
