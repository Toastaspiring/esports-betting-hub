
// Types
export interface Team {
  id: string;
  name: string;
  logo: string;
  winRate: number;
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  date: string;
  league: League;
  odds: {
    teamA: number;
    teamB: number;
  };
  status: 'upcoming' | 'live' | 'completed';
}

export interface League {
  id: string;
  name: string;
  region: string;
  logo: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  balance: number;
  winRate: number;
  betsWon: number;
  betsLost: number;
}

// Mock data
export const MOCK_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'T1',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/T1_logo.svg/1200px-T1_logo.svg.png',
    winRate: 0.82
  },
  {
    id: 'g2',
    name: 'G2 Esports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Esports_organization_G2_Esports_logo.svg/1200px-Esports_organization_G2_Esports_logo.svg.png',
    winRate: 0.71
  },
  {
    id: 'gen',
    name: 'Gen.G',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Gen.G_logo.svg/1200px-Gen.G_logo.svg.png',
    winRate: 0.68
  },
  {
    id: 'fnc',
    name: 'Fnatic',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Esports_organization_Fnatic_logo.svg/1200px-Esports_organization_Fnatic_logo.svg.png',
    winRate: 0.65
  },
  {
    id: 'tes',
    name: 'Top Esports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/Top_Esports_logo.svg/1200px-Top_Esports_logo.svg.png',
    winRate: 0.70
  },
  {
    id: 'jdg',
    name: 'JD Gaming',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/JD_Gaming_logo.svg/1200px-JD_Gaming_logo.svg.png',
    winRate: 0.75
  }
];

export const MOCK_LEAGUES: League[] = [
  {
    id: 'lck',
    name: 'LCK',
    region: 'Korea',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b6/LCK_logo.svg/1200px-LCK_logo.svg.png'
  },
  {
    id: 'lec',
    name: 'LEC',
    region: 'Europe',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/LEC_2019_Logo.svg/1200px-LEC_2019_Logo.svg.png'
  },
  {
    id: 'lpl',
    name: 'LPL',
    region: 'China',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/League_of_Legends_Pro_League_logo.svg/1200px-League_of_Legends_Pro_League_logo.svg.png'
  },
  {
    id: 'lcs',
    name: 'LCS',
    region: 'North America',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/LCS_2023_logo.svg/1200px-LCS_2023_logo.svg.png'
  }
];

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    teamA: MOCK_TEAMS[0], // T1
    teamB: MOCK_TEAMS[2], // Gen.G
    date: '2023-06-15T18:00:00Z',
    league: MOCK_LEAGUES[0], // LCK
    odds: {
      teamA: 1.75,
      teamB: 2.10
    },
    status: 'upcoming'
  },
  {
    id: 'm2',
    teamA: MOCK_TEAMS[1], // G2
    teamB: MOCK_TEAMS[3], // Fnatic
    date: '2023-06-15T20:00:00Z',
    league: MOCK_LEAGUES[1], // LEC
    odds: {
      teamA: 1.90,
      teamB: 1.95
    },
    status: 'upcoming'
  },
  {
    id: 'm3',
    teamA: MOCK_TEAMS[4], // Top Esports
    teamB: MOCK_TEAMS[5], // JD Gaming
    date: '2023-06-16T14:00:00Z',
    league: MOCK_LEAGUES[2], // LPL
    odds: {
      teamA: 2.20,
      teamB: 1.70
    },
    status: 'upcoming'
  },
  {
    id: 'm4',
    teamA: MOCK_TEAMS[0], // T1
    teamB: MOCK_TEAMS[5], // JD Gaming
    date: '2023-06-17T16:00:00Z',
    league: MOCK_LEAGUES[0], // LCK
    odds: {
      teamA: 1.85,
      teamB: 2.00
    },
    status: 'upcoming'
  }
];

export const MOCK_USER: User = {
  id: 'u1',
  username: 'ProBettor',
  avatar: 'https://i.pravatar.cc/150?img=68',
  balance: 5000,
  winRate: 0.68,
  betsWon: 42,
  betsLost: 20
};
