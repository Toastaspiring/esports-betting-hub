
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface MockSession {
  user: {
    id: string;
    email: string;
  };
  mockProfile: any;
}

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  setMockSession: (mockSession: MockSession | null) => void;
  isMockSession: boolean;
  mockProfile: any;
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
  refreshAuth: async () => {},
  setMockSession: () => {},
  isMockSession: false,
  mockProfile: null
});

export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockSession, setIsMockSession] = useState(false);
  const [mockProfile, setMockProfile] = useState<any>(null);

  const refreshAuth = async () => {
    if (isMockSession) return; // Skip refresh for mock sessions
    
    console.log('Manually refreshing auth state...');
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user || null);
  };

  const setMockSession = (mockSession: MockSession | null) => {
    if (mockSession) {
      console.log('Setting mock session:', mockSession);
      // Use the mock user data
      setUser(mockSession.user as unknown as User);
      setMockProfile(mockSession.mockProfile);
      setIsMockSession(true);
      setIsLoading(false);
    } else {
      // Clear mock session
      console.log('Clearing mock session');
      setUser(null);
      setSession(null);
      setMockProfile(null);
      setIsMockSession(false);
      setIsLoading(false);
      
      // Force a refresh to ensure clean state
      window.location.reload();
    }
  };

  useEffect(() => {
    // Skip supabase auth initialization if we're using a mock session
    if (isMockSession) return;
    
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
          setIsMockSession(false);
          
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
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isMockSession]);

  return (
    <SupabaseContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      refreshAuth,
      setMockSession,
      isMockSession,
      mockProfile
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  return useContext(SupabaseContext);
};

export default useSupabase;
