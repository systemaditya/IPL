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
  const name = summary.playerName;

  if (net > 80) return `${name} is running this group like a personal ATM. Everyone else is just a customer.`;
  if (net > 50) return `${name} acting like they invented cricket analysis. Bro watched one highlights video and now calls it "research".`;
  if (net > 20) return `${name} is "in profit" and won't stop mentioning it in every group conversation.`;
  if (net > 10) return `${name} found 10 rupees and is now LinkedIn-posting about hustle mindset.`;
  if (net > 0) return `${name} is technically up. Technically. Like, barely. Please don't call it a winning streak.`;
  if (net === 0) return `${name} broke even. The IPL's most spectacular waste of attention and effort.`;
  if (net > -15) return `${name} is down but still confidently giving prediction advice. The audacity is genuinely inspiring.`;
  if (net > -40) return `${name} has donated more to this fund than to their own savings account. Generosity or stupidity — we're not sure.`;
  if (net > -60) return `${name}'s prediction strategy: close eyes, pick random, lose consistently. Peak performance.`;
  if (net > -80) return `${name} could've sponsored a small tea stall with what they've lost. But they chose this instead.`;
  return `${name} is the group's official charity. Main sponsor. Title partner. The backbone of everyone else's profit.`;
}

export function getOverallRoast(summaries: PlayerMoneySummary[]): string {
  const totalNet = summaries.reduce((acc, s) => acc + s.netRupees, 0);
  const loser = [...summaries].sort((a, b) => a.netRupees - b.netRupees)[0];
  const winner = summaries[0];

  if (totalNet > 50) return `Somehow the group is net positive. ${winner.playerName} is mostly responsible. The rest are emotional support players.`;
  if (totalNet > 10) return `Collectively ahead, but only because ${winner.playerName} carried. The rest would've been better off flipping a coin.`;
  if (totalNet > -10) return `Net result: near zero. Eight intelligent adults spent weeks watching cricket just to end up exactly where they started. Beautiful.`;
  if (totalNet > -50) return `${loser.playerName} is single-handedly funding everyone else's tiny profits. A true silent investor. Weeping silently.`;
  return `Collectively, this group has donated enough to buy premium Hotstar subscriptions for everyone — instead of just watching the match in peace.`;
}

export function getMatchRoast(match: Match, report: MatchReportRow): string {
  if (match.status === "abandoned") {
    return "Rain arrived and did what everyone's gut feeling failed to do — saved them from themselves. Bet migrated to the next match like a refugee.";
  }

  const points = Object.values(report.pointsByPlayer);
  const positiveCount = points.filter(p => p > 0).length;
  const negativeCount = points.filter(p => p < 0).length;
  const zeroCount = points.filter(p => p === 0).length;
  const winnersNames = Object.entries(report.pointsByPlayer)
    .filter(([, p]) => p > 0)
    .map(([n]) => n);

  if (positiveCount === 0) return "Historic. Everyone was wrong. A group of 8 people collectively failed to predict a coin flip. Congratulations.";
  if (positiveCount === 1) return `Only ${winnersNames[0]} got it right. Everyone else either panic-picked or googled the wrong team.`;
  if (positiveCount === 2) return `${winnersNames.join(" and ")} ate. The remaining 6 were just spectators with opinions.`;
  if (negativeCount === 1) {
    const loser = Object.entries(report.pointsByPlayer).find(([, p]) => p < 0)?.[0];
    return `Everyone saw it correctly except ${loser}. ${loser} looked at the same match and reached a completely different universe.`;
  }
  if (negativeCount > positiveCount * 2) return "Group disaster of the highest order. Even the losing team predicted themselves to win more accurately.";
  if (positiveCount > negativeCount) return "A rare moment of collective intelligence. Screenshot this. Frame it. It won't happen again.";
  if (zeroCount > 3) return "Half the group mysteriously scored exactly 0. The IPL giveth, and the IPL absolutely taketh away.";

  return "Standard chaos. Winners will boast. Losers will rationalize. Nothing will change for the next match.";
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
