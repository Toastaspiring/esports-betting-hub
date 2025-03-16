
export interface RiotApiResponse {
  summoner: {
    id: string;
    puuid: string;
    name: string;
    profileIconId: number;
    summonerLevel: number;
    riotId: string;
  };
  account: {
    gameName: string;
    tagLine: string;
  };
  region: string;
  profilePictureUrl: string;
}
