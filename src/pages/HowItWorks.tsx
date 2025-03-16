
import Navbar from '@/components/Navbar';
import { Check, HelpCircle, Zap, Target, Trophy, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="mx-auto max-w-4xl">
          {/* Hero section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">How LoL Bet Works</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Place virtual bets on League of Legends matches, climb the leaderboard, and compete with friends - 
              all without risking real money.
            </p>
          </div>
          
          {/* Key features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Virtual Currency</CardTitle>
                <CardDescription>
                  Bet with LP (League Points), our virtual currency. No real money involved!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Start with 10,000 LP when you create your account</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Earn more LP by winning bets on matches</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Get daily bonuses just for logging in</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Betting on Matches</CardTitle>
                <CardDescription>
                  Place bets on upcoming LoL Esports matches across all major leagues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Bet on match winners, total kills, first objectives, and more</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Dynamic odds based on team performance and stats</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Live betting available during active matches</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Leaderboards & Rewards</CardTitle>
                <CardDescription>
                  Compete with other bettors and earn special rewards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Climb the leaderboard based on your betting performance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Win special badges and profile customization options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Seasonal rewards for top performers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fair Play & Community</CardTitle>
                <CardDescription>
                  We ensure a fair, fun, and engaging environment for all users.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Transparent betting system with clear rules</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Active community of LoL esports fans</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Regular events and special betting opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Getting Started Steps */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Getting Started in 3 Simple Steps</h2>
            
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-10 left-10 h-[calc(100%-40px)] w-0.5 bg-primary/30 hidden sm:block"></div>
              
              <div className="space-y-12">
                <div className="relative flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">1</div>
                  </div>
                  <div className="flex-1 glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                    <p className="text-muted-foreground mb-4">
                      Sign up for an account and receive your initial 10,000 LP balance to start betting.
                    </p>
                    <a 
                      href="/signup" 
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      Create an account
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="relative flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">2</div>
                  </div>
                  <div className="flex-1 glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">Browse Upcoming Matches</h3>
                    <p className="text-muted-foreground mb-4">
                      Explore the upcoming LoL esports matches across all major leagues and tournaments.
                    </p>
                    <a 
                      href="/matches" 
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      View matches
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="relative flex flex-col sm:flex-row gap-6">
                  <div className="sm:w-20 flex-shrink-0 flex items-start justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">3</div>
                  </div>
                  <div className="flex-1 glass-card p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-2">Place Your Bets</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a match, choose your bet type, set your stake, and confirm your bet.
                    </p>
                    <a 
                      href="/matches" 
                      className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                    >
                      Start betting
                      <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="glass-card rounded-xl p-6">
              <AccordionItem value="item-1" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium">
                  Is LoL Bet gambling with real money?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No, LoL Bet uses virtual currency called League Points (LP). You cannot deposit real money, 
                  and LP has no real-world value. It's purely for entertainment and competing with other fans.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium">
                  What happens if I run out of LP?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Don't worry! We provide daily login bonuses and periodic boosts to help you get back in the game. 
                  You'll never be completely out of action.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium">
                  How are the odds calculated?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our odds are calculated based on team performance data, head-to-head history, 
                  current form, and other relevant statistics. We aim to provide realistic odds 
                  that reflect the actual chances of each outcome.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium">
                  Can I bet on matches that have already started?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! We offer live betting on matches that are already in progress. The odds are 
                  updated in real-time based on the current state of the game.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5" className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium">
                  Which tournaments and leagues are covered?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We cover all major League of Legends tournaments and leagues, including LCS, LEC, LCK, 
                  LPL, MSI, Worlds, and many regional leagues. If there's a professional LoL match, 
                  chances are you can bet on it!
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6" className="border-b-0">
                <AccordionTrigger className="text-left font-medium">
                  How do seasonal resets work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  At the end of each competitive season (after Worlds), we reset the leaderboards and 
                  award special badges and bonuses to top performers. Everyone's LP is reset to a base 
                  amount, giving everyone a fresh start for the next season.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Contact Support */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-bold">Still have questions?</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
