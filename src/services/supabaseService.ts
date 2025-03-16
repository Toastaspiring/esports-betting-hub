
import { supabase } from "@/integrations/supabase/client";
import { Match, Team, League, User } from "@/lib/constants";

// User related functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};

// League functions
export const fetchLeagues = async () => {
  const { data, error } = await supabase
    .from('leagues')
    .select('*');
  
  if (error) throw error;
  
  // Add region property if it doesn't exist
  const enhancedData = data?.map(league => ({
    ...league,
    region: league.region || 'Unknown'
  }));
  
  return { data: enhancedData };
};

export const fetchLeagueDetails = async (leagueId: string) => {
  const { data, error } = await supabase
    .from('leagues')
    .select('*')
    .eq('id', leagueId)
    .single();
  
  if (error) throw error;
  
  // Add region property if it doesn't exist
  return {
    ...data,
    region: data.region || 'Unknown'
  };
};

export const createLeague = async (league: { name: string, logo: string, region?: string }) => {
  const { data, error } = await supabase
    .from('leagues')
    .insert(league)
    .select();
  
  if (error) throw error;
  return data;
};

// Team functions
export const fetchTeams = async (leagueId?: string) => {
  let query = supabase
    .from('teams')
    .select(`
      *,
      league:leagues(*)
    `);
  
  if (leagueId) {
    query = query.eq('league_id', leagueId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return { data };
};

export const createTeam = async (team: { name: string, logo: string, league_id: string, win_rate?: number }) => {
  const { data, error } = await supabase
    .from('teams')
    .insert(team)
    .select();
  
  if (error) throw error;
  return data;
};

// Match functions
export const fetchMatches = async (status?: string) => {
  let query = supabase
    .from('matches')
    .select(`
      *,
      league:leagues(*),
      teamA:teams!matches_team_a_id_fkey(*),
      teamB:teams!matches_team_b_id_fkey(*)
    `);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Transform data to match the expected format in the frontend
  const transformedData = data?.map(match => ({
    id: match.id,
    teamA: {
      id: match.teamA.id,
      name: match.teamA.name,
      logo: match.teamA.logo,
      winRate: match.teamA.win_rate
    },
    teamB: {
      id: match.teamB.id,
      name: match.teamB.name,
      logo: match.teamB.logo,
      winRate: match.teamB.win_rate
    },
    date: match.match_date,
    league: {
      id: match.league.id,
      name: match.league.name,
      logo: match.league.logo,
      region: match.league.region || 'Unknown' // Add default value for region
    },
    odds: {
      teamA: match.odds_team_a,
      teamB: match.odds_team_b
    },
    status: match.status as 'upcoming' | 'live' | 'completed'
  }));
  
  return { data: transformedData || [] };
};

export const fetchMatchesByLeague = async (leagueId: string) => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      league:leagues(*),
      teamA:teams!matches_team_a_id_fkey(*),
      teamB:teams!matches_team_b_id_fkey(*)
    `)
    .eq('league_id', leagueId);
  
  if (error) throw error;
  
  // Transform data to match the expected format in the frontend
  const transformedData = data?.map(match => ({
    id: match.id,
    teamA: {
      id: match.teamA.id,
      name: match.teamA.name,
      logo: match.teamA.logo,
      winRate: match.teamA.win_rate
    },
    teamB: {
      id: match.teamB.id,
      name: match.teamB.name,
      logo: match.teamB.logo,
      winRate: match.teamB.win_rate
    },
    date: match.match_date,
    league: {
      id: match.league.id,
      name: match.league.name,
      logo: match.league.logo,
      region: match.league.region || 'Unknown' // Add default value for region
    },
    odds: {
      teamA: match.odds_team_a,
      teamB: match.odds_team_b
    },
    status: match.status as 'upcoming' | 'live' | 'completed'
  }));
  
  return transformedData || [];
};

export const createMatch = async (match: {
  league_id: string,
  team_a_id: string,
  team_b_id: string,
  match_date: string,
  odds_team_a: number,
  odds_team_b: number,
  status?: string
}) => {
  const { data, error } = await supabase
    .from('matches')
    .insert(match)
    .select();
  
  if (error) throw error;
  return data;
};

// Betting functions
export const placeBet = async (matchId: string, teamId: string, amount: number, odds: number) => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('You must be logged in to place a bet');
  
  // Start a transaction
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('balance')
    .eq('id', user.id)
    .single();
  
  if (profileError) throw profileError;
  
  if (profile.balance < amount) {
    return { 
      success: false, 
      message: 'Insufficient balance' 
    };
  }
  
  // Insert bet
  const { data: bet, error: betError } = await supabase
    .from('bets')
    .insert({
      user_id: user.id,
      match_id: matchId,
      team_id: teamId,
      amount,
      odds
    })
    .select();
  
  if (betError) throw betError;
  
  // Update user balance
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      balance: profile.balance - amount 
    })
    .eq('id', user.id);
  
  if (updateError) throw updateError;
  
  return { 
    success: true, 
    message: 'Bet placed successfully!',
    bet
  };
};

export const fetchUserBets = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { data: [] };
  
  const { data, error } = await supabase
    .from('bets')
    .select(`
      *,
      match:matches(
        *,
        league:leagues(*),
        teamA:teams!matches_team_a_id_fkey(*),
        teamB:teams!matches_team_b_id_fkey(*)
      ),
      team:teams(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return { data: data || [] };
};
