
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedMatches from '@/components/FeaturedMatches';
import UserStats from '@/components/UserStats';
import { MOCK_MATCHES } from '@/lib/constants';
import BettingInterface from '@/components/BettingInterface';
import { ArrowRight, Calendar, ChevronRight, Trophy } from 'lucide-react';

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
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  const handleCloseBettingInterface = () => {
    setShowBettingInterface(false);
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  };
  
  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      
      <main className="pt-16">
        <HeroSection />
        
        <FeaturedMatches />
        
        {/* Upcoming Events Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold tracking-tight">
                  Upcoming Events
                </h2>
                <p className="text-muted-foreground mt-1">
                  Prepare your bets for these upcoming tournaments
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LCK Summer Split */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-48">
                  <img
                    src="https://cdn1.dotesports.com/wp-content/uploads/2020/11/22130940/lck.jpg"
                    alt="LCK Summer Split"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="inline-block px-2 py-1 bg-white text-xs font-medium rounded-md mb-2">
                        June 15 - Aug 20
                      </span>
                      <h3 className="text-xl font-semibold text-white">LCK Summer Split</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    The most prestigious League of Legends tournament in Korea returns with the top teams battling for glory.
                  </p>
                  <a
                    href="/tournaments/lck-summer"
                    className="flex items-center text-sm font-medium text-primary"
                  >
                    View Tournament
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </a>
                </div>
              </div>
              
              {/* LEC Summer Split */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-48">
                  <img
                    src="https://cdn1.dotesports.com/wp-content/uploads/2020/08/01142835/lec-summer-playoffs.png"
                    alt="LEC Summer Split"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="inline-block px-2 py-1 bg-white text-xs font-medium rounded-md mb-2">
                        June 17 - Aug 22
                      </span>
                      <h3 className="text-xl font-semibold text-white">LEC Summer Split</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    Europe's finest League of Legends teams compete in an action-packed summer tournament.
                  </p>
                  <a
                    href="/tournaments/lec-summer"
                    className="flex items-center text-sm font-medium text-primary"
                  >
                    View Tournament
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </a>
                </div>
              </div>
              
              {/* MSI 2023 */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-48">
                  <img
                    src="https://cdn1.dotesports.com/wp-content/uploads/2023/04/03155301/MSI-2023-format.png"
                    alt="MSI 2023"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-0 left-0 p-5">
                      <span className="inline-block px-2 py-1 bg-white text-xs font-medium rounded-md mb-2">
                        August 30 - Sept 10
                      </span>
                      <h3 className="text-xl font-semibold text-white">Mid-Season Invitational</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">
                    The best teams from each region clash in this international tournament showcasing top talent.
                  </p>
                  <a
                    href="/tournaments/msi-2023"
                    className="flex items-center text-sm font-medium text-primary"
                  >
                    View Tournament
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <UserStats />
        
        {/* How it Works Section */}
        <section className="py-16 bg-white">
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
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Wallet className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Get Virtual Currency</h3>
                <p className="text-muted-foreground">
                  Sign up and receive 5,000 LP (League Points) to start your betting journey. Completely free, no real money involved.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">Place Your Bets</h3>
                <p className="text-muted-foreground">
                  Browse upcoming matches, analyze the odds, and place bets on your favorite teams or players to win.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6">
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
      
      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/80 py-12">
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
          
          <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LoL Bet. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              This is a virtual betting platform. No real money is involved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Betting Interface Modal */}
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
