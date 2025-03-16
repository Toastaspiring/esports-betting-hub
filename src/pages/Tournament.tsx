
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLeagueDetails, fetchMatchesByLeague } from '@/services/supabaseService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, CalendarDays, Users, Share2, ArrowLeft } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TournamentBracket from '@/components/TournamentBracket';
import { Match } from '@/lib/constants';

const Tournament = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch tournament details
  const { 
    data: tournament, 
    isLoading: tournamentLoading,
    error: tournamentError
  } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => fetchLeagueDetails(id as string),
    enabled: !!id
  });
  
  // Fetch matches for this tournament
  const { 
    data: matchesData, 
    isLoading: matchesLoading,
    error: matchesError
  } = useQuery({
    queryKey: ['tournamentMatches', id],
    queryFn: () => fetchMatchesByLeague(id as string),
    enabled: !!id
  });
  
  // Cast the matches data to the correct type
  const matches = matchesData ? matchesData.map(match => ({
    ...match,
    status: match.status as 'upcoming' | 'live' | 'completed'
  })) as Match[] : [];
  
  // Group matches by status
  const upcomingMatches = matches?.filter(match => match.status === 'upcoming') || [];
  const liveMatches = matches?.filter(match => match.status === 'live') || [];
  const completedMatches = matches?.filter(match => match.status === 'completed') || [];
  
  // Get unique teams from all matches
  const teamsMap = new Map();
  matches?.forEach(match => {
    if (!teamsMap.has(match.teamA.id)) {
      teamsMap.set(match.teamA.id, match.teamA);
    }
    if (!teamsMap.has(match.teamB.id)) {
      teamsMap.set(match.teamB.id, match.teamB);
    }
  });
  const teams = Array.from(teamsMap.values());
  
  if (tournamentLoading || matchesLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (tournamentError || matchesError || !tournament) {
    return (
      <div className="container py-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error loading tournament</h2>
          <p className="text-red-600 mt-2">Unable to load tournament details. Please try again later.</p>
          <Button asChild className="mt-4">
            <Link to="/matches">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Matches
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/matches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Matches
          </Link>
        </Button>
      </div>
      
      {/* Tournament Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start">
        <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center p-2 shrink-0">
          <img 
            src={tournament.logo} 
            alt={tournament.name} 
            className="max-w-full max-h-full"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{tournament.name}</h1>
          <p className="text-muted-foreground mt-1">{tournament.region || 'Unknown'} Regional Tournament</p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center text-muted-foreground">
              <Trophy className="mr-1.5 h-4 w-4" />
              <span className="text-sm">{teams.length} Teams</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <span className="text-sm">{matches?.length || 0} Matches</span>
            </div>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="mt-2 md:mt-0">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      
      {/* Tournament Tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-8 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Bracket</CardTitle>
            </CardHeader>
            <CardContent>
              {completedMatches.length > 0 ? (
                <TournamentBracket matches={matches} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Trophy className="mx-auto h-12 w-12 mb-4 opacity-20" />
                  <p>The tournament bracket will be available once matches begin.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Live Matches</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/matches">View all</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.slice(0, 2).map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}
          
          {/* Upcoming Matches */}
          {upcomingMatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Matches</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/matches">View all</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.slice(0, 4).map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="matches" className="space-y-8 pt-4">
          {/* Match Filters */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Matches</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches?.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              {matches?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No matches found for this tournament.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              {upcomingMatches.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No upcoming matches found for this tournament.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              {completedMatches.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No completed matches found for this tournament.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="teams" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teams.map((team) => (
              <Card key={team.id} className="overflow-hidden">
                <div className="p-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary rounded-full p-2 mb-3 flex items-center justify-center">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="max-w-full max-h-full"
                    />
                  </div>
                  <h3 className="font-semibold text-center">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">Win Rate: {(team.winRate * 100).toFixed(0)}%</p>
                </div>
              </Card>
            ))}
          </div>
          
          {teams.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>No teams found for this tournament.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tournament;
