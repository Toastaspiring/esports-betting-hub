import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Matches from '@/pages/Matches';
import Tournament from '@/pages/Tournament';
import MyBets from '@/pages/MyBets';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import HowItWorks from '@/pages/HowItWorks';
import FAQ from '@/pages/FAQ';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Leaderboard from '@/pages/Leaderboard';
import AuthCallback from '@/pages/AuthCallback';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/tournament/:id?" element={<Tournament />} />
        <Route path="/my-bets" element={<MyBets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
