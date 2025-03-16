
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <Card className="w-full max-w-3xl p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to LoL Bet. These Terms of Service govern your use of our website and services. By accessing or using LoL Bet, you agree to be bound by these Terms.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Virtual Currency</h2>
              <p className="text-muted-foreground">
                LoL Bet uses a virtual currency called League Points (LP). LP has no real-world monetary value and cannot be exchanged for cash or other valuable consideration. LP is used solely for entertainment purposes within the LoL Bet platform.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Account Registration</h2>
              <p className="text-muted-foreground">
                To use certain features of LoL Bet, you may need to create an account. You agree to provide accurate information during the registration process and to keep your account information updated.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. User Conduct</h2>
              <p className="text-muted-foreground">
                You agree not to use LoL Bet for any illegal purpose or in violation of any local, state, national, or international law. You also agree not to attempt to circumvent any security features of the platform.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on LoL Bet, including text, graphics, logos, and software, is the property of LoL Bet or its content suppliers and is protected by copyright laws.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">6. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                LoL Bet is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the site will be error-free or uninterrupted.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall LoL Bet be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the platform.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting an announcement on our website.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">9. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us at support@lolbet.com.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Terms;
