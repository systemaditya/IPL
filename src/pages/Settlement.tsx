import { useMemo, useState } from "react";
import { Scale, RotateCcw, Filter } from "lucide-react";
import { matches } from "../data/matches";
import { matchReports } from "../data/matchReports";
import { DateRangeFilter, players } from "../data/types";
import { getFilteredMatches, formatDateInputLabel } from "../lib/utils";
import { settleBalances, type SettlementTransaction } from "../lib/settlement";

const getTodayRange = () => {
  const today = new Date().toISOString().split("T")[0];
  return { startDate: today, endDate: today };
};

const getLast7DaysRange = () => {
  const today = new Date();
  const past = new Date();
  past.setDate(today.getDate() - 6);

  return {
    startDate: past.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  };
};

const getThisWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: monday.toISOString().split("T")[0],
    endDate: sunday.toISOString().split("T")[0],
  };
};

const formatMoney = (amount: number) => `₹ ${Math.abs(amount).toFixed(2)}`;

export default function Settlement() {
  const [range, setRange] = useState<DateRangeFilter>({});

  const filteredMatches = useMemo(
    () => getFilteredMatches(matches, range),
    [range]
  );

  const balances = useMemo(() => {
    const matchIds = new Set(filteredMatches.map((match) => match.id));
    const filteredReports = matchReports.filter((report) =>
      matchIds.has(report.matchId)
    );

    const totals = new Map<string, number>();
    players.forEach((player) => totals.set(player, 0));

    filteredReports.forEach((report) => {
      Object.entries(report.pointsByPlayer).forEach(([player, points]) => {
        totals.set(player, (totals.get(player) || 0) + points);
      });
    });

    return players.map((playerName) => ({
      playerName,
      amount: totals.get(playerName) || 0,
    }));
  }, [filteredMatches]);

  const transactions = useMemo(
    () => settleBalances(balances),
    [balances]
  );

  const clearFilters = () => setRange({});

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase mb-4">
          <Scale size={14} />
          Settlement
        </div>

        <h1 className="text-5xl font-black mb-4 text-white">
          Who Pays Whom
        </h1>

        <p className="text-gray-400">
          Final settlement based on the selected date range.
        </p>
      </header>

      <div
        className="mb-8 rounded-3xl p-6 shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #0f172a, #020617)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Filter size={14} />
            {filteredMatches.length} matches used
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
          {[
            { label: "Today", fn: getTodayRange },
            { label: "Last 7 Days", fn: getLast7DaysRange },
            { label: "This Week", fn: getThisWeekRange },
          ].map((btn) => {
            const isActive =
              range.startDate === btn.fn().startDate &&
              range.endDate === btn.fn().endDate;

            return (
              <button
                key={btn.label}
                onClick={() => setRange(btn.fn())}
                className="px-5 py-2 rounded-full font-semibold text-sm transition-all"
                style={{
                  background: isActive
                    ? "linear-gradient(90deg, #22c55e, #3b82f6)"
                    : "rgba(255,255,255,0.05)",
                  color: isActive ? "black" : "white",
                  border: isActive
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: isActive
                    ? "0 0 20px rgba(59,130,246,0.5)"
                    : "none",
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            value={range.startDate || ""}
            onChange={(e) =>
              setRange((p) => ({ ...p, startDate: e.target.value }))
            }
            className="p-3 rounded-xl text-white"
            style={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />

          <input
            type="date"
            value={range.endDate || ""}
            onChange={(e) =>
              setRange((p) => ({ ...p, endDate: e.target.value }))
            }
            className="p-3 rounded-xl text-white"
            style={{
              background: "#020617",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>

        <div className="mt-4">
          {range.startDate || range.endDate ? (
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(34,197,94,0.2)",
                color: "#22c55e",
              }}
            >
              {formatDateInputLabel(range.startDate)} →{" "}
              {formatDateInputLabel(range.endDate)}
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              No filter applied
            </span>
          )}
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-bg-card p-6 text-gray-300">
          No matches found in the selected date range.
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-bg-card p-6 text-gray-300">
          All players are balanced. No settlement needed.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {balances.map((balance) => (
              <div
                key={balance.playerName}
                className="rounded-2xl border border-white/10 bg-bg-card p-4"
              >
                <div className="text-sm text-gray-400 mb-2">
                  {balance.playerName}
                </div>
                <div
                  className={`text-lg font-bold ${
                    balance.amount > 0
                      ? "text-green-400"
                      : balance.amount < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {balance.amount > 0
                    ? `${formatMoney(balance.amount)} to receive`
                    : balance.amount < 0
                    ? `${formatMoney(balance.amount)} to pay`
                    : "Settled"}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Transactions</h2>
            </div>

            <div className="divide-y divide-white/10">
              {transactions.map((txn: SettlementTransaction, index: number) => (
                <div
                  key={`${txn.from}-${txn.to}-${index}`}
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="text-white font-medium">
                    <span className="text-red-400">{txn.from}</span> pays{" "}
                    <span className="text-green-400">{txn.to}</span>
                  </div>
                  <div className="font-mono text-white">
                    {formatMoney(txn.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
