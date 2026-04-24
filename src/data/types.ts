export const players = [
  "Aditya",
  "Bhargav",
  "Harsha",
  "Kartikeya",
  "Pursh",
  "Uma",
  "Vinay",
  "Yash",
] as const;

export type PlayerName = typeof players[number];

export type TeamCode = "CSK" | "MI" | "RCB" | "GT" | "RR" | "LSG" | "KKR" | "SRH" | "PBKS" | "DC";

export type MatchStatus = "scheduled" | "completed" | "abandoned";

export interface Match {
  id: string;
  matchNumber: number;
  date: string;
  teamA: TeamCode;
  teamB: TeamCode;
  winner: TeamCode | null;
  status: MatchStatus;
  carryOverToMatchId?: string;
}

export interface PlayerPrediction {
  matchId: string;
  matchNumber: number;
  playerName: PlayerName;
  predictedTeam: TeamCode | null;
  note?: string;
}

export interface MatchReportRow {
  matchId: string;
  matchNumber: number;
  pointsByPlayer: Record<PlayerName, number>;
  remark?: string;
}

export interface PlayerMoneySummary {
  playerName: PlayerName;
  totalPoints: number;
  netRupees: number;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export const ENTRY_AMOUNT_PER_MATCH = 10;
export const RUPEES_PER_POINT = 1;

export const rulesDescription = `
Each match, everyone throws in 10 rupayalu and predicts a winner.
Points roughly equal how many rupayalu you've won or lost.
Match 12 was abandoned due to rain; that match gives 0 points to everyone and the bet is effectively carried into the next match (already baked into these report numbers).
`;