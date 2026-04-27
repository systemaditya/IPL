export type PlayerBalance = {
  playerName: string;
  amount: number;
};

export type SettlementTransaction = {
  from: string;
  to: string;
  amount: number;
};

const roundToTwo = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export function settleBalances(
  balances: PlayerBalance[],
  epsilon = 0.01
): SettlementTransaction[] {
  const creditors = balances
    .filter((balance) => balance.amount > epsilon)
    .map((balance) => ({
      name: balance.playerName,
      amount: roundToTwo(balance.amount),
    }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter((balance) => balance.amount < -epsilon)
    .map((balance) => ({
      name: balance.playerName,
      amount: roundToTwo(Math.abs(balance.amount)),
    }))
    .sort((a, b) => b.amount - a.amount);

  const transactions: SettlementTransaction[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = roundToTwo(Math.min(debtor.amount, creditor.amount));

    if (amount > epsilon) {
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });
    }

    debtor.amount = roundToTwo(debtor.amount - amount);
    creditor.amount = roundToTwo(creditor.amount - amount);

    if (debtor.amount <= epsilon) debtorIndex += 1;
    if (creditor.amount <= epsilon) creditorIndex += 1;
  }

  return transactions;
}
