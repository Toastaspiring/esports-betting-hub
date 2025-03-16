
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">
              Find answers to common questions about LoL Bet
            </p>
          </div>
          
          <Card className="w-full max-w-3xl p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is LoL Bet?</AccordionTrigger>
                <AccordionContent>
                  LoL Bet is a virtual betting platform for League of Legends esports. It allows users to bet on professional matches using virtual currency (LP) without any real money involved.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>Is LoL Bet free to use?</AccordionTrigger>
                <AccordionContent>
                  Yes, LoL Bet is completely free to use. We don't accept or pay out real money. All betting is done with our virtual currency, League Points (LP).
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I get League Points (LP)?</AccordionTrigger>
                <AccordionContent>
                  New users automatically receive 5,000 LP upon registration. You can earn more LP by winning your bets or participating in special events and promotions.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I withdraw or convert LP to real money?</AccordionTrigger>
                <AccordionContent>
                  No, LP has no real-world value and cannot be exchanged for cash or any other form of currency. It exists solely for entertainment purposes within the LoL Bet platform.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>How are odds calculated?</AccordionTrigger>
                <AccordionContent>
                  Our odds are calculated based on team performance data, historical match results, player statistics, and other relevant factors. We continuously update our algorithms to provide the most accurate odds possible.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>What happens if I lose all my LP?</AccordionTrigger>
                <AccordionContent>
                  If your LP balance drops below a certain threshold, you may receive a one-time LP bonus to help you get back in the game. Additionally, we run regular events where users can earn free LP.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>Which tournaments can I bet on?</AccordionTrigger>
                <AccordionContent>
                  LoL Bet covers all major League of Legends tournaments, including LCK, LEC, LPL, LCS, MSI, and Worlds. We also cover some regional leagues and special events.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger>Can I connect my Riot Games account?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can connect your Riot Games account to LoL Bet. This allows us to personalize your experience and offer special features based on your League of Legends profile.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9">
                <AccordionTrigger>How do I report a bug or issue?</AccordionTrigger>
                <AccordionContent>
                  If you encounter any bugs or issues while using LoL Bet, please contact our support team through the Contact page. We appreciate your feedback and work hard to resolve any problems quickly.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10">
                <AccordionTrigger>Is there a mobile app for LoL Bet?</AccordionTrigger>
                <AccordionContent>
                  Currently, LoL Bet is available as a web application that works on all devices, including mobile phones and tablets. We are working on dedicated mobile apps that will be available in the future.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help!
              </p>
              <Link to="/contact">
                <Button>Contact Support</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
