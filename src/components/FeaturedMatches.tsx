
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '@/services/supabaseService';
import MatchCard from './MatchCard';
import { ChevronRight } from 'lucide-react';
import { seedDatabase } from '@/lib/seedDatabase';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/hooks/useSupabase';
import { Match } from '@/lib/constants';

const FeaturedMatches = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useSupabase();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Fetch matches from Supabase
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['featuredMatches'],
    queryFn: async () => {
      return await fetchMatches('upcoming');
    },
  });
  
  const matches = data?.data || [];
  
  const handleSeedDatabase = async () => {
    try {
      await seedDatabase();
      refetch();
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            <h2 className="text-2xl font-display font-bold tracking-tight">
              Featured Matches
            </h2>
            <p className="text-muted-foreground mt-1">
              Don't miss these exciting upcoming matches
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {matches.length === 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSeedDatabase}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-x-4'
                }`}
              >
                Seed Database
              </Button>
            )}
            
            <a 
              href="/matches" 
              className={`hidden sm:flex items-center text-sm font-medium text-foreground hover:text-primary transition-all duration-700 ${
                isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-x-4'
              }`}
            >
              View all matches
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center p-8 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-500">Failed to load matches. Please try again later.</p>
          </div>
        )}
        
        {/* Featured Matches Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.slice(0, 2).map((match: Match, index: number) => (
              <div 
                key={match.id}
                className={`transition-all duration-700 delay-${(index + 1) * 150} ${
                  isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
                }`}
              >
                <MatchCard match={match} featured />
              </div>
            ))}
            
            {matches.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center py-12">
                <p className="text-lg text-muted-foreground">No upcoming matches found</p>
                <p className="text-sm text-muted-foreground mt-2">Use the "Seed Database" button to add some matches</p>
              </div>
            )}
          </div>
        )}
        
        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <a 
            href="/matches" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground hover:text-primary rounded-md border border-slate-200 hover:border-primary/20 hover:bg-primary/5 transition-colors"
          >
            View all matches
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMatches;
