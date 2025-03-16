
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Trophy, Wallet } from 'lucide-react';
import { MOCK_USER } from '@/lib/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 glass-panel backdrop-blur-xl bg-white/70 border-b border-slate-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-xl">L</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              LoL Bet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium text-sm text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/matches" className="font-medium text-sm text-foreground/80 hover:text-primary transition-colors">
              Matches
            </Link>
            <Link to="/leaderboard" className="font-medium text-sm text-foreground/80 hover:text-primary transition-colors">
              Leaderboard
            </Link>
            <Link to="/how-it-works" className="font-medium text-sm text-foreground/80 hover:text-primary transition-colors">
              How It Works
            </Link>
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center px-3 py-1.5 rounded-full bg-secondary">
              <Wallet className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-medium">{MOCK_USER.balance.toLocaleString()} LP</span>
            </div>
            
            <Link to="/profile" className="flex items-center space-x-2 p-1.5 -mr-1.5 rounded-full hover:bg-slate-100 transition-colors">
              <div className="relative">
                <img 
                  src={MOCK_USER.avatar} 
                  alt={MOCK_USER.username}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
                />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg animate-slide-in-bottom">
          <div className="container px-4 py-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/matches" 
              className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Matches
            </Link>
            <Link 
              to="/leaderboard" 
              className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Leaderboard
            </Link>
            <Link 
              to="/how-it-works" 
              className="flex items-center py-2 px-3 rounded-md text-sm font-medium text-foreground hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            
            <div className="border-t border-slate-200 pt-3 mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={MOCK_USER.avatar} 
                  alt={MOCK_USER.username}
                  className="w-8 h-8 rounded-full border border-slate-200 mr-3" 
                />
                <div>
                  <p className="text-sm font-medium">{MOCK_USER.username}</p>
                  <p className="text-xs text-muted-foreground">{MOCK_USER.balance.toLocaleString()} LP</p>
                </div>
              </div>
              
              <Link 
                to="/profile" 
                className="p-2 rounded-md text-primary hover:bg-primary/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
