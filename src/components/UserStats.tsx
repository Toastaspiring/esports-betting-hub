
import { useState, useEffect } from 'react';
import { MOCK_USER } from '@/lib/constants';
import { TrendingUp, Trophy, Wallet, BarChart2 } from 'lucide-react';

const UserStats = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 700);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="py-16 bg-slate-50">
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
                  <h3 className="text-2xl font-semibold">{MOCK_USER.balance.toLocaleString()} LP</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+1,200 LP this week</span>
              </div>
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
                  <h3 className="text-2xl font-semibold">{(MOCK_USER.winRate * 100).toFixed(1)}%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: `${MOCK_USER.winRate * 100}%` }}
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
                  <h3 className="text-2xl font-semibold">{MOCK_USER.betsWon}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+8 this month</span>
              </div>
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
                  <h3 className="text-2xl font-semibold">{MOCK_USER.betsLost}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Win/Loss Ratio: {(MOCK_USER.betsWon / MOCK_USER.betsLost).toFixed(2)}</span>
              </div>
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
            href="/profile"
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-full transition-colors"
          >
            View Detailed Stats
            <ChevronRight className="w-4 h-4 ml-1.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
