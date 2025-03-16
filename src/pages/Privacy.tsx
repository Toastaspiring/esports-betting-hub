
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <Card className="w-full max-w-3xl p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect information that you provide directly to us, such as when you create an account, update your profile, or contact us. This may include your name, email address, and Riot Games account information.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience on LoL Bet.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">3. Information Sharing</h2>
              <p className="text-muted-foreground">
                We do not share your personal information with third parties except as described in this Privacy Policy, or when we have your permission.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">4. Data Security</h2>
              <p className="text-muted-foreground">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">5. Your Choices</h2>
              <p className="text-muted-foreground">
                You can access, update, or delete your account information at any time by logging into your account and accessing your profile settings.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">6. Cookies and Similar Technologies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our website.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">7. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">8. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@lolbet.com.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
