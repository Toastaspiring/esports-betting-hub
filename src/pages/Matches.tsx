
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search } from 'lucide-react';
import MatchCard from '@/components/MatchCard';
import { fetchMatches } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { seedDatabase } from '@/lib/seedDatabase';
import { useToast } from '@/components/ui/use-toast';
import { Match } from '@/lib/constants';

const Matches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Properly type the fetchMatches function for TanStack Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      return await fetchMatches();
    },
  });
  
  const matchesData = data?.data || [];
  
  // Filter matches based on search query
  const filteredMatches = matchesData.filter((match: Match) => 
    match.teamA.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    match.teamB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.league.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const upcomingMatches = filteredMatches.filter((match: Match) => match.status === 'upcoming');
  const liveMatches = filteredMatches.filter((match: Match) => match.status === 'live');
  const completedMatches = filteredMatches.filter((match: Match) => match.status === 'completed');
  
  const handleSeedDatabase = async () => {
    try {
      await seedDatabase();
      toast({
        title: "Database seeded",
        description: "Mock data has been added to the database.",
      });
      refetch();
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Error",
        description: "Failed to seed database. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Match Schedule</h1>
            <p className="text-muted-foreground">
              Browse upcoming, live, and completed matches to place your bets or view results
            </p>
          </div>
          
          {/* Search and Seed Database */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                className="bg-background border border-input rounded-md pl-10 p-2 w-full md:max-w-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Search teams or tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {matchesData.length === 0 && (
              <Button 
                variant="outline" 
                onClick={handleSeedDatabase}
                className="shrink-0"
              >
                Seed Database
              </Button>
            )}
          </div>
          
          {/* Error State */}
          {error && (
            <div className="text-center p-8 border border-red-200 rounded-lg bg-red-50">
              <p className="text-red-500">Failed to load matches. Please try again later.</p>
            </div>
          )}
          
          {/* Tabs for different match statuses */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="live" className="relative">
                Live
                {liveMatches.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {liveMatches.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="live" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : liveMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveMatches.map((match: Match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No live matches at the moment</p>
                  <p className="text-sm text-muted-foreground mt-2">Check back later or browse upcoming matches</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMatches.map((match: Match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No upcoming matches found</p>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search query
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : completedMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedMatches.map((match: Match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No completed matches found</p>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search query
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Matches;
