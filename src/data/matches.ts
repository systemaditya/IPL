import { Match } from "./types";

export const matches: Match[] = [
  { id: "M1",  matchNumber: 1,  teamA: "SRH",  teamB: "RCB", winner: "RCB", status: "completed" },
  { id: "M2",  matchNumber: 2,  teamA: "MI",   teamB: "KKR", winner: "MI",  status: "completed" },
  { id: "M3",  matchNumber: 3,  teamA: "RR",   teamB: "CSK", winner: "RR",  status: "completed" },
  { id: "M4",  matchNumber: 4,  teamA: "PBKS", teamB: "GT",  winner: "PBKS",status: "completed" },
  { id: "M5",  matchNumber: 5,  teamA: "DC",   teamB: "LSG", winner: "DC",  status: "completed" },
  { id: "M6",  matchNumber: 6,  teamA: "SRH",  teamB: "KKR", winner: "SRH", status: "completed" },
  { id: "M7",  matchNumber: 7,  teamA: "PBKS", teamB: "CSK", winner: "PBKS",status: "completed" },
  { id: "M8",  matchNumber: 8,  teamA: "MI",   teamB: "DC",  winner: "DC",  status: "completed" },
  { id: "M9",  matchNumber: 9,  teamA: "RR",   teamB: "GT",  winner: "RR",  status: "completed" },
  { id: "M10", matchNumber: 10, teamA: "SRH",  teamB: "LSG", winner: "LSG", status: "completed" },
  { id: "M11", matchNumber: 11, teamA: "CSK",  teamB: "RCB", winner: "RCB", status: "completed" },
  { id: "M12", matchNumber: 12, teamA: "SRH",  teamB: "RCB", winner: null,  status: "abandoned", carryOverToMatchId: "M13" },
  { id: "M13", matchNumber: 13, teamA: "MI",   teamB: "RR",  winner: "RR",  status: "completed" },
  { id: "M14", matchNumber: 14, teamA: "DC",   teamB: "GT",  winner: "GT",  status: "completed" },
  { id: "M15", matchNumber: 15, teamA: "LSG",  teamB: "KKR", winner: "LSG", status: "completed" },
  { id: "M16", matchNumber: 16, teamA: "RR",   teamB: "RCB", winner: "RR",  status: "completed" },
];
