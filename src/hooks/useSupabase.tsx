
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
  refreshAuth: async () => {}
});

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    console.log('Manually refreshing auth state...');
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user || null);
  };

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Initial auth session:', data.session ? 'logged in' : 'not logged in');
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
    };
    
    initializeAuth();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          setSession(null);
          setUser(null);
          
          // Force a refresh to ensure clean state
          window.location.reload();
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed');
          setSession(currentSession);
          setUser(currentSession?.user || null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ user, session, isLoading, refreshAuth }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  return useContext(SupabaseContext);
};

export default useSupabase;
