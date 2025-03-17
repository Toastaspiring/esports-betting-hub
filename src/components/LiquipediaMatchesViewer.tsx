
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, RefreshCw, Info } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MatchData {
  teamA: {
    name: string;
    logo: string;
    score?: number;
  };
  teamB: {
    name: string;
    logo: string;
    score?: number;
  };
  tournament: string;
  format: string;
  date: string;
  streams?: { platform: string; url: string }[];
  status: 'upcoming' | 'live' | 'completed';
}

const LiquipediaMatchesViewer = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [rawApiResponse, setRawApiResponse] = useState<string | null>(null);
  const [showRawData, setShowRawData] = useState(false);

  useEffect(() => {
    fetchLiquipediaData();
  }, []);

  const fetchLiquipediaData = async () => {
    setLoading(true);
    setError(null);
    try {
      // For demonstration purposes, we'll fetch directly from our edge function
      // In production, this would be handled by the edge function itself
      const response = await fetch('https://liquipedia.net/leagueoflegends/api.php?page=Liquipedia:Upcoming_and_ongoing_matches&action=parse&prop=text&format=json', {
        headers: {
          'User-Agent': 'LolMatchTracker/1.0 (contact@lolmatchtracker.com)',
          'Accept-Encoding': 'gzip',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      setRawApiResponse(JSON.stringify(data, null, 2));
      
      // Parse the HTML content
      const parsedMatches = parseMatchesFromHtml(data.parse.text['*']);
      setMatches(parsedMatches);
    } catch (err) {
      console.error('Error fetching Liquipedia data:', err);
      setError(err.message || 'Failed to fetch match data');
    } finally {
      setLoading(false);
    }
  };

  const parseMatchesFromHtml = (html: string): MatchData[] => {
    // Create a temporary element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const matchList: MatchData[] = [];
    
    // Find all match containers
    const matchContainers = doc.querySelectorAll('.infobox_matches_content');
    
    matchContainers.forEach((container) => {
      try {
        // Extract tournament info
        const tournamentElement = container.querySelector('.league-icon-small');
        const tournamentName = tournamentElement?.getAttribute('title') || 'Unknown Tournament';
        
        // Find team elements
        const leftTeam = container.querySelector('.team-left');
        const rightTeam = container.querySelector('.team-right');
        
        if (leftTeam && rightTeam) {
          // Get team names specifically from the team-template-text elements
          const teamANameEl = leftTeam.querySelector('.team-template-text a');
          const teamBNameEl = rightTeam.querySelector('.team-template-text a');
          
          const teamAName = teamANameEl?.textContent?.trim() || 'Unknown Team';
          const teamBName = teamBNameEl?.textContent?.trim() || 'Unknown Team';
          
          // Skip matches with generic team names
          if (teamAName === 'Unknown Team' || teamBName === 'Unknown Team' ||
              teamAName === 'Team A' || teamBName === 'Team B') {
            return;
          }
          
          // Get team logos
          const teamALogoElement = leftTeam.querySelector('img');
          const teamBLogoElement = rightTeam.querySelector('img');
          
          const teamALogo = teamALogoElement?.getAttribute('src') || '';
          const teamBLogo = teamBLogoElement?.getAttribute('src') || '';
          
          // Get scores if available
          const teamAScoreEl = leftTeam.querySelector('.versus-score');
          const teamBScoreEl = rightTeam.querySelector('.versus-score');
          
          const teamAScore = teamAScoreEl ? parseInt(teamAScoreEl.textContent || '0', 10) : undefined;
          const teamBScore = teamBScoreEl ? parseInt(teamBScoreEl.textContent || '0', 10) : undefined;
          
          // Get match format
          const formatElement = container.querySelector('.versus-format');
          const format = formatElement?.textContent?.trim() || 'Bo1';
          
          // Get date/time
          const dateElement = container.querySelector('.timer-object');
          let matchDate = new Date();
          let matchStatus: 'upcoming' | 'live' | 'completed' = 'upcoming';
          
          if (dateElement) {
            const timestamp = dateElement.getAttribute('data-timestamp');
            if (timestamp) {
              matchDate = new Date(parseInt(timestamp) * 1000);
              
              // Determine status based on time
              const now = new Date();
              if (matchDate.getTime() < now.getTime() - 3 * 60 * 60 * 1000) {
                matchStatus = 'completed';
              } else if (matchDate.getTime() <= now.getTime() && 
                matchDate.getTime() > now.getTime() - 3 * 60 * 60 * 1000) {
                matchStatus = 'live';
              }
            }
          }
          
          // Get streaming links
          const streamContainer = container.querySelector('.links-stream');
          const streamElements = streamContainer?.querySelectorAll('a') || [];
          const streams = Array.from(streamElements).map(el => ({
            platform: el.textContent?.trim() || 'Stream',
            url: el.getAttribute('href') || '#'
          }));
          
          matchList.push({
            teamA: {
              name: teamAName,
              logo: teamALogo.startsWith('http') ? teamALogo : `https://liquipedia.net${teamALogo}`,
              score: teamAScore
            },
            teamB: {
              name: teamBName,
              logo: teamBLogo.startsWith('http') ? teamBLogo : `https://liquipedia.net${teamBLogo}`,
              score: teamBScore
            },
            tournament: tournamentName,
            format,
            date: matchDate.toISOString(),
            streams: streams.length > 0 ? streams : undefined,
            status: matchStatus
          });
        }
      } catch (error) {
        console.error('Error parsing match:', error);
      }
    });
    
    return matchList;
  };

  const getTimeDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if the match is happening now
    if (Math.abs(date.getTime() - now.getTime()) < 3 * 60 * 60 * 1000) {
      return 'LIVE';
    }
    
    // Check if the match is today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if the match is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMatches = selectedTab === 'all' 
    ? matches 
    : matches.filter(match => match.status === selectedTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Liquipedia Matches</h2>
          <p className="text-muted-foreground">
            Upcoming and ongoing matches from Liquipedia
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchLiquipediaData}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowRawData(!showRawData)}
          >
            <Info className="mr-2 h-4 w-4" />
            {showRawData ? 'Hide API Data' : 'Show API Data'}
          </Button>
        </div>
      </div>
      
      {error && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={fetchLiquipediaData}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Display raw API data if requested */}
      {showRawData && rawApiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Raw API Response</CardTitle>
            <CardDescription>
              Direct output from the Liquipedia API request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto rounded-md bg-muted p-4">
              <pre className="text-xs">{rawApiResponse}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match tabs and list */}
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge className="ml-2 bg-secondary text-secondary-foreground">{matches.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="live">
            Live
            <Badge className="ml-2 bg-red-500 text-white">{matches.filter(m => m.status === 'live').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming
            <Badge className="ml-2">{matches.filter(m => m.status === 'upcoming').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge className="ml-2">{matches.filter(m => m.status === 'completed').length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredMatches.map((match, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative p-4 sm:p-6">
                      {/* Tournament name */}
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="px-2 py-1">
                          {match.tournament}
                        </Badge>
                      </div>
                      
                      {/* Match status */}
                      {match.status === 'live' && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="destructive" className="animate-pulse">
                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span>
                            LIVE
                          </Badge>
                        </div>
                      )}
                      
                      {/* Format */}
                      <div className="absolute top-3 right-3 z-10">
                        {match.status !== 'live' && (
                          <Badge variant="outline">{match.format}</Badge>
                        )}
                      </div>
                      
                      {/* Teams & Score */}
                      <div className="flex items-center justify-between mt-6 mb-4">
                        {/* Team A */}
                        <div className="flex-1 text-center">
                          <div className="flex flex-col items-center">
                            <div className="relative mb-2">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-secondary p-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <img
                                        src={match.teamA.logo || '/placeholder.svg'}
                                        alt={match.teamA.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src = '/placeholder.svg';
                                        }}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{match.teamA.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <h3 className="font-medium text-sm">{match.teamA.name}</h3>
                            {match.teamA.score !== undefined && (
                              <p className="text-xl font-bold mt-1">{match.teamA.score}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* VS */}
                        <div className="flex flex-col items-center justify-center px-4">
                          <span className="text-sm font-medium text-muted-foreground">VS</span>
                          <div className="text-xs text-muted-foreground mt-2">
                            {getTimeDisplay(match.date)}
                          </div>
                        </div>
                        
                        {/* Team B */}
                        <div className="flex-1 text-center">
                          <div className="flex flex-col items-center">
                            <div className="relative mb-2">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-secondary p-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <img
                                        src={match.teamB.logo || '/placeholder.svg'}
                                        alt={match.teamB.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          e.currentTarget.src = '/placeholder.svg';
                                        }}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{match.teamB.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <h3 className="font-medium text-sm">{match.teamB.name}</h3>
                            {match.teamB.score !== undefined && (
                              <p className="text-xl font-bold mt-1">{match.teamB.score}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Streams */}
                      {match.streams && match.streams.length > 0 && (
                        <div className="flex justify-center mt-4">
                          {match.streams.map((stream, i) => (
                            <a 
                              key={i}
                              href={stream.url.startsWith('http') ? stream.url : `https://liquipedia.net${stream.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 bg-secondary rounded-md text-xs font-medium mx-1 hover:bg-secondary/80 transition-colors"
                            >
                              {stream.platform}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No matches found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedTab !== 'all' 
                  ? `No ${selectedTab} matches available at the moment` 
                  : 'Try refreshing or check back later'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiquipediaMatchesViewer;
