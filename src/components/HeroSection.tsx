
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl opacity-60"></div>
      </div>
      
      <div className="container relative px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          {/* Chip */}
          <div 
            className={`inline-block px-3 py-1 mb-5 rounded-full bg-primary/10 backdrop-blur-sm transition-all duration-700 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            <span className="text-xs font-medium text-primary">
              Virtual Currency Betting Platform
            </span>
          </div>
          
          {/* Heading */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-balance mb-5 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              The Ultimate LoL Esports
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              Betting Experience
            </span>
          </h1>
          
          {/* Description */}
          <p 
            className={`text-lg text-muted-foreground max-w-2xl mx-auto mb-8 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            Bet on your favorite LoL Esports teams with our virtual currency system. 
            No real money involved, just pure fun and excitement.
          </p>
          
          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row justify-center items-center gap-4 transition-all duration-700 delay-450 ${
              isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
            }`}
          >
            <a 
              href="/matches" 
              className="inline-flex items-center px-6 py-3 font-medium text-sm bg-primary hover:bg-primary/90 text-white rounded-full transition-colors"
            >
              Start Betting
              <ChevronRight className="w-4 h-4 ml-1.5" />
            </a>
            
            <a 
              href="/how-it-works" 
              className="inline-flex items-center px-6 py-3 font-medium text-sm text-foreground hover:text-primary rounded-full border border-slate-200 hover:border-primary/20 hover:bg-primary/5 transition-colors"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
