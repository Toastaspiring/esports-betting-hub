
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, DollarSign, HelpCircle, Trophy } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col gap-12">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">How LoL Bet Works</h1>
            <p className="text-lg text-muted-foreground">
              LoL Bet makes esports betting simple, fun, and engaging. Learn how to get started and make your first bet.
            </p>
          </div>
          
          {/* Step-by-step guide */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border border-slate-200 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Create an Account</h3>
              <p className="text-muted-foreground mb-4">Sign up for an account to receive your initial balance of League Points (LP).</p>
              <Link to="/register">
                <Button variant="outline" className="w-full">Register Now</Button>
              </Link>
            </Card>
            
            <Card className="p-6 border border-slate-200 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Place Your Bets</h3>
              <p className="text-muted-foreground mb-4">Browse upcoming matches, analyze the odds, and place bets on your favorite teams.</p>
              <Link to="/matches">
                <Button variant="outline" className="w-full">See Matches</Button>
              </Link>
            </Card>
            
            <Card className="p-6 border border-slate-200 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Win & Earn</h3>
              <p className="text-muted-foreground mb-4">Track your bets live, collect winnings, and climb the leaderboard rankings.</p>
              <Link to="/leaderboard">
                <Button variant="outline" className="w-full">View Leaderboard</Button>
              </Link>
            </Card>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Got questions? We've got answers.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  What are League Points (LP)?
                </h3>
                <p className="text-muted-foreground pl-7">
                  League Points (LP) is our virtual currency. New users start with 10,000 LP and can earn more by winning bets.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  How are odds calculated?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Odds are calculated based on team performance, historical match data, and other relevant factors.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Can I bet on multiple matches?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Yes, you can place bets on as many matches as you want, as long as you have sufficient LP.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  When do I receive my winnings?
                </h3>
                <p className="text-muted-foreground pl-7">
                  Winnings are automatically credited to your account shortly after a match concludes.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact CTA */}
          <div className="bg-primary/5 p-8 rounded-xl text-center mt-8">
            <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              Our support team is always ready to help. Reach out with any questions about LoL Bet.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="secondary">Learn More</Button>
              <Link to="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
