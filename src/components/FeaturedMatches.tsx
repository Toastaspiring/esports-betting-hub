
import { useState, useEffect } from 'react';
import { MOCK_MATCHES } from '@/lib/constants';
import MatchCard from './MatchCard';
import { ChevronRight } from 'lucide-react';

const FeaturedMatches = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        
        {/* Featured Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_MATCHES.slice(0, 2).map((match, index) => (
            <div 
              key={match.id}
              className={`transition-all duration-700 delay-${(index + 1) * 150} ${
                isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
              }`}
            >
              <MatchCard match={match} featured />
            </div>
          ))}
        </div>
        
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
