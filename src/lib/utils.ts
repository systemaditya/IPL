import { MatchReportRow, PlayerMoneySummary, players, PlayerName, Match, RUPEES_PER_POINT } from "../data/types";

export function calculatePlayerMoney(reports: MatchReportRow[]): PlayerMoneySummary[] {
  const summary: Record<PlayerName, { totalPoints: number }> = {} as any;

  players.forEach(name => {
    summary[name] = { totalPoints: 0 };
  });

  reports.forEach(report => {
    Object.entries(report.pointsByPlayer).forEach(([name, points]) => {
      if (summary[name as PlayerName]) {
        summary[name as PlayerName].totalPoints += points;
      }
    });
  });

  return players.map(name => ({
    playerName: name,
    totalPoints: summary[name].totalPoints,
    netRupees: Math.round(summary[name].totalPoints * RUPEES_PER_POINT * 100) / 100,
  })).sort((a, b) => b.netRupees - a.netRupees);
}

export function getPlayerRoast(summary: PlayerMoneySummary): string {
  const net = summary.netRupees;
  if (net > 50) return "Currently running this league like a side business.";
  if (net > 10) return "Side income unlocked. Everyone else is just investing.";
  if (net > 0) return "In profit and now suddenly an IPL 'expert'.";
  if (net === 0) return "Break-even merchant: talks like champion, earns like savings account interest.";
  if (net > -20) return "Wins just enough to talk, loses just enough to stay quiet occasionally.";
  if (net > -50) return "Basically paying subscription fees for everyone else’s entertainment.";
  return "Official title sponsor of 10 Rupayalu Aatagalu. Main Sponsor.";
}

export function getOverallRoast(summaries: PlayerMoneySummary[]): string {
  const totalNet = summaries.reduce((acc, s) => acc + s.netRupees, 0);
  if (totalNet > 10) return "As a group you’re somehow beating the house. This won’t last, enjoy it.";
  if (totalNet < -10) return "Collectively, you could’ve just bought match tickets with this money.";
  return "Collective net result: zero. Purely emotional damage league.";
}

export function getMatchRoast(match: Match, report: MatchReportRow): string {
  if (match.status === "abandoned") {
    return "Rain saved everyone from their own predictions. Bet quietly migrated to the next match.";
  }

  const points = Object.values(report.pointsByPlayer);
  const positiveCount = points.filter(p => p > 0).length;
  const negativeCount = points.filter(p => p < 0).length;

  if (positiveCount === 1) return "One person clearly watched the match; everyone else just guessed.";
  if (negativeCount > positiveCount * 2) return "Group prediction disaster. Bookies would be proud.";
  if (positiveCount > negativeCount) return "Rare moment of group wisdom. Screenshot this for memories.";
  
  return "Standard chaos. Some won, some donated, all complained.";
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
