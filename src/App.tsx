
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseProvider } from "@/hooks/useSupabase";
import Index from "@/pages/Index";
import Matches from "@/pages/Matches";
import Leaderboard from "@/pages/Leaderboard";
import HowItWorks from "@/pages/HowItWorks";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import MyBets from "@/pages/MyBets";
import Tournament from "@/pages/Tournament";
import Contact from "@/pages/Contact";

const queryClient = new QueryClient();

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
            <Route path="/my-bets" element={<MyBets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
