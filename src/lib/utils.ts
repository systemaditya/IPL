import { MatchReportRow, PlayerMoneySummary, players, PlayerName, Match, RUPEES_PER_POINT, DateRangeFilter } from "../data/types";

const MONTHS: Record<string, number> = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

function parseInputDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function parseMatchDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("-");
  return new Date(2000 + Number(year), MONTHS[month], Number(day));
}

export function formatMatchDate(dateStr: string): string {
  const date = parseMatchDate(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateInputLabel(value?: string): string {
  if (!value) return "All dates";
  return parseInputDate(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isMatchWithinRange(matchDate: string, range?: DateRangeFilter): boolean {
  if (!range?.startDate && !range?.endDate) return true;

  const date = parseMatchDate(matchDate);
  if (range.startDate) {
    const start = parseInputDate(range.startDate);
    if (date < start) return false;
  }
  if (range.endDate) {
    const end = parseInputDate(range.endDate);
    end.setHours(23, 59, 59, 999);
    if (date > end) return false;
  }
  return true;
}

export function getFilteredMatches(matches: Match[], range?: DateRangeFilter): Match[] {
  return matches.filter((match) => isMatchWithinRange(match.date, range));
}

export function calculatePlayerMoney(
  reports: MatchReportRow[],
  matches?: Match[],
  range?: DateRangeFilter
): PlayerMoneySummary[] {
  let filteredReports = reports;

  if (matches && matches.length) {
    const matchMap = new Map(matches.map((match) => [match.id, match]));
    filteredReports = reports.filter((report) => {
      const match = matchMap.get(report.matchId);
      if (!match) return false;
      return isMatchWithinRange(match.date, range);
    });
  }

  const summary: Record<PlayerName, { totalPoints: number }> = {} as any;

  players.forEach((name) => {
    summary[name] = { totalPoints: 0 };
  });

  filteredReports.forEach((report) => {
    Object.entries(report.pointsByPlayer).forEach(([name, points]) => {
      if (summary[name as PlayerName]) {
        summary[name as PlayerName].totalPoints += points;
      }
    });
  });

  return players.map((name) => ({
    playerName: name,
    totalPoints: summary[name].totalPoints,
    netRupees: Math.round(summary[name].totalPoints * RUPEES_PER_POINT * 100) / 100,
  })).sort((a, b) => b.netRupees - a.netRupees);
}

export function getPlayerRoast(summary: PlayerMoneySummary): string {
  const net = summary.netRupees;
  const name = summary.playerName;

  if (net > 60) return `${name} is straight up robbing this group and calling it skill. Absolute bastard. We hate them and we respect them equally.`;
  if (net > 50) return `${name} is winning and is being an insufferable prick about it. Checks the leaderboard more than their WhatsApp. Honestly fair enough.`;
  if (net > 20) return `${name} is up twenty rupees and has already told everyone thrice. Shut the f**k up, it's not a salary hike.`;
  if (net > 10) return `${name} got lucky once and now won't stop acting like a bloody cricket analyst. Sit your ass down.`;
  if (net > 0) return `${name} is technically in profit. By a rounding error. Don't let this idiot talk about "strategy" with a straight face.`;
  if (net === 0) return `${name} broke even. Watched every match. Stressed every ball. Ended up exactly where they started. What a waste of a human brain.`;
  if (net > -15) return `${name} is down and STILL sending predictions in the group chat. Nobody asked you, you overconfident little gremlin.`;
  if (net > -40) return `${name} has donated more to this group than to their own future. A financial disaster wrapped in false confidence. Stunning.`;
  if (net > -60) return `${name}'s prediction strategy is genuinely, scientifically indistinguishable from bullshit. A drunk monkey would've done better.`;
  if (net > -80) return `${name} is out here funding everyone's chai and auto rides without realising it. Absolute disaster of a tipster. Bless them.`;
  return `${name} is the group's official ATM, unofficial clown, and full-time sponsor. The backbone of everyone's profits. The dumbest genius we know.`;
}

export function getOverallRoast(summaries: PlayerMoneySummary[]): string {
  const totalNet = summaries.reduce((acc, s) => acc + s.netRupees, 0);
  const loser = [...summaries].sort((a, b) => a.netRupees - b.netRupees)[0];
  const winner = summaries[0];

  if (totalNet > 50) return `Net positive as a group — and that's entirely ${winner.playerName}'s doing. The rest of you are just deadweight they carried. Pathetic and grateful.`;
  if (totalNet > 10) return `Barely ahead, and only because ${winner.playerName} went full sweat mode. The rest of you were just vibing and losing. Decorative humans.`;
  if (totalNet > -10) return `Eight adults. Whole IPL season. Net result: nearly zero rupees. This group is a masterclass in collective stupidity. Genuinely beautiful.`;
  if (totalNet > -50) return `${loser.playerName} is single-handedly funding everyone else's tiny wins. Not a player anymore — just a charity with bad taste in cricket teams.`;
  return `This group has lost enough money to buy Hotstar Premium for all 8 of you — and watched it suffer anyway. A historic, magnificent, irreversible disaster.`;
}

export function getMatchRoast(match: Match, report: MatchReportRow): string {
  if (match.status === "abandoned") {
    return "Rain said 'not today' and cancelled the match before any of you could embarrass yourselves further. Bets moved to next match. God is merciful.";
  }

  const points = Object.values(report.pointsByPlayer);
  const positiveCount = points.filter(p => p > 0).length;
  const negativeCount = points.filter(p => p < 0).length;
  const zeroCount = points.filter(p => p === 0).length;
  const winnersNames = Object.entries(report.pointsByPlayer)
    .filter(([, p]) => p > 0)
    .map(([n]) => n);

  if (positiveCount === 0) return "Absolutely legendary. Every single one of you got it wrong. EVERY. ONE. Eight people failed a 50-50 coin flip together. This is peak collective dumbassery.";
  if (positiveCount === 1) return `${winnersNames[0]} got it right. The other 7 were confidently, loudly, spectacularly wrong. Embarrassing. Iconic. Very on-brand.`;
  if (positiveCount === 2) return `${winnersNames.join(" and ")} actually used their brains. The other 6 were just shouting nonsense and hoping for the best. Classic.`;
  if (negativeCount === 1) {
    const loserName = Object.entries(report.pointsByPlayer).find(([, p]) => p < 0)?.[0];
    return `Everyone got it right except ${loserName}. Everyone. ${loserName} looked at the same match and somehow ended up in a parallel universe where the other team wins. What the hell, ${loserName}.`;
  }
  if (negativeCount > positiveCount * 2) return "Group-level catastrophe. Even the losing team had more dignity than this group's predictions today. Absolutely cooked.";
  if (positiveCount > negativeCount) return "More winners than losers — a statistical anomaly for this group. Screenshot this. This will not happen again. We don't deserve this.";
  if (zeroCount > 3) return "Half of you scored zero. The IPL is not a game — it is a spiritual examination of your worth. Half of you failed miserably.";

  return "Winners are already being smug little sh*ts. Losers are deep in denial. Nothing new. See you in the next match where this whole circus repeats.";
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}