
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SupabaseProvider } from "@/hooks/useSupabase";
import Index from "@/pages/Index";
import Matches from "@/pages/Matches";
import Leaderboard from "@/pages/Leaderboard";
import HowItWorks from "@/pages/HowItWorks";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import MyBets from "@/pages/MyBets";
import Tournament from "@/pages/Tournament";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import FAQ from "@/pages/FAQ";

// Create a new QueryClient instance with caching options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/tournament/:id" element={<Tournament />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/my-bets" element={<MyBets />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Tournament redirects */}
            <Route path="/tournaments/lck" element={<Navigate to="/tournament/lck" replace />} />
            <Route path="/tournaments/lec" element={<Navigate to="/tournament/lec" replace />} />
            <Route path="/tournaments/lpl" element={<Navigate to="/tournament/lpl" replace />} />
            <Route path="/tournaments/lcs" element={<Navigate to="/tournament/lcs" replace />} />
            <Route path="/tournaments/lck-summer" element={<Navigate to="/tournament/lck-summer" replace />} />
            <Route path="/tournaments/lec-summer" element={<Navigate to="/tournament/lec-summer" replace />} />
            <Route path="/tournaments/msi-2023" element={<Navigate to="/tournament/msi-2023" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
