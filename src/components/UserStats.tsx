
import { useState, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Trophy, Wallet, BarChart2, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UserStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isMockSession, mockProfile } = useSupabase();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 700);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch user profile data from Supabase
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile', user?.id, isMockSession],
    queryFn: async () => {
      if (!user) return null;
      
      // Return mock profile if using mock session
      if (isMockSession && mockProfile) {
        console.log('Using mock profile data for UserStats', mockProfile);
        return mockProfile;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
  
  // Calculate win rate
  const winRate = profile?.bets_won && (profile.bets_won + profile.bets_lost) > 0
    ? profile.bets_won / (profile.bets_won + profile.bets_lost)
    : 0;
  
  return (
    <section className="py-16 bg-background/50">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div 
          className={`text-center max-w-3xl mx-auto mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
          }`}
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-4">
            Your Betting Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your performance and manage your virtual betting portfolio
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Balance */}
          <div 
            className={`glass-card rounded-xl overflow-hidden transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoading ? (
                      <span className="animate-pulse bg-gray-200 h-8 w-24 inline-block rounded"></span>
                    ) : user ? (
                      `${profile?.balance?.toLocaleString() || "0"} LP`
                    ) : (
                      "Log in to view"
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              {user && profile && (
                <div className="flex items-center text-xs text-green-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  <span>Bet to earn more LP!</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Win Rate */}
          <div 
            className={`glass-card rounded-xl overflow-hidden transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Win Rate</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoading ? (
                      <span className="animate-pulse bg-gray-200 h-8 w-24 inline-block rounded"></span>
                    ) : user ? (
                      `${(winRate * 100).toFixed(1)}%`
                    ) : (
                      "Log in to view"
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 mb-2">
                <div 
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: user ? `${(winRate * 100)}%` : "0%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          {/* Bets Won */}
          <div 
            className={`glass-card rounded-xl overflow-hidden transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bets Won</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoading ? (
                      <span className="animate-pulse bg-gray-200 h-8 w-16 inline-block rounded"></span>
                    ) : user ? (
                      profile?.bets_won || "0"
                    ) : (
                      "Log in to view"
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              {user && profile && profile.bets_won > 0 && (
                <div className="flex items-center text-xs text-green-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  <span>Keep up the good work!</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Bets Lost */}
          <div 
            className={`glass-card rounded-xl overflow-hidden transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bets Lost</p>
                  <h3 className="text-2xl font-semibold">
                    {isLoading ? (
                      <span className="animate-pulse bg-gray-200 h-8 w-16 inline-block rounded"></span>
                    ) : user ? (
                      profile?.bets_lost || "0"
                    ) : (
                      "Log in to view"
                    )}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-400 transform rotate-180" />
                </div>
              </div>
              {user && profile && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>Win/Loss Ratio: {
                    profile.bets_lost > 0 
                      ? (profile.bets_won / profile.bets_lost).toFixed(2)
                      : profile.bets_won > 0 ? "∞" : "0.00"
                  }</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div 
          className={`mt-10 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
          }`}
        >
          <a
            href={user ? "/profile" : "/login"}
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-full transition-colors"
          >
            {user ? "View Detailed Stats" : "Login to View Stats"}
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
