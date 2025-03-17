import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedMatches from '@/components/FeaturedMatches';
import LiquipediaMatchesViewer from '@/components/LiquipediaMatchesViewer';
import UserStats from '@/components/UserStats';
import { MOCK_MATCHES } from '@/lib/constants';
import BettingInterface from '@/components/BettingInterface';
import { ArrowRight, Calendar, ChevronRight, Trophy, Wallet } from 'lucide-react';

const Index = () => {
  const [showBettingInterface, setShowBettingInterface] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(MOCK_MATCHES[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleOpenBettingInterface = (match: any) => {
    setSelectedMatch(match);
    setShowBettingInterface(true);
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseBettingInterface = () => {
    setShowBettingInterface(false);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        
        <FeaturedMatches />
        
        <section className="py-12 bg-gray-50/50 dark:bg-slate-950/50">
          <div className="container px-4 mx-auto">
            <LiquipediaMatchesViewer />
          </div>
        </section>
        
        <UserStats />
        
        <section className="py-16 bg-secondary">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-4">
                How LoL Bet Works
              </h2>
              <p className="text-muted-foreground">
                Bet on your favorite teams without risking real money. It's all about the fun and excitement!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Wallet className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Get Virtual Currency</h3>
                <p className="text-muted-foreground">
                  Sign up and receive 5,000 LP (League Points) to start your betting journey. Completely free, no real money involved.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Place Your Bets</h3>
                <p className="text-muted-foreground">
                  Browse upcoming matches, analyze the odds, and place bets on your favorite teams or players to win.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Trophy className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Win & Climb</h3>
                <p className="text-muted-foreground">
                  Win LP based on the odds and your bet amount. Climb the leaderboard and earn special badges for your achievements.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <a
                href="/how-it-works"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-full transition-colors"
              >
                Learn More
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-card/20 border-t border-border py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white text-xl">L</span>
                </div>
                <span className="font-display text-lg font-semibold tracking-tight">
                  LoL Bet
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The ultimate LoL Esports virtual betting platform. No real money, just pure fun and excitement.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/matches" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Matches
                  </a>
                </li>
                <li>
                  <a href="/leaderboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Tournaments</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/tournaments/lck" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    LCK
                  </a>
                </li>
                <li>
                  <a href="/tournaments/lec" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    LEC
                  </a>
                </li>
                <li>
                  <a href="/tournaments/lpl" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    LPL
                  </a>
                </li>
                <li>
                  <a href="/tournaments/lcs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    LCS
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LoL Bet. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              This is a virtual betting platform. No real money is involved.
            </p>
          </div>
        </div>
      </footer>
      
      {showBettingInterface && (
        <BettingInterface
          match={selectedMatch}
          onClose={handleCloseBettingInterface}
        />
      )}
    </div>
  );
};

export default Index;
