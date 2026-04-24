import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Trophy, RotateCcw, Filter } from "lucide-react";
import { matchReports } from "../data/matchReports";
import { matches } from "../data/matches";
import {
  calculatePlayerMoney,
  getFilteredMatches,
  formatDateInputLabel,
} from "../lib/utils";
import { DateRangeFilter } from "../data/types";

/* ---------- DATE PRESETS ---------- */
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

export default function MoneyBoard() {
  const [range, setRange] = useState<DateRangeFilter>({});

  const filteredMatches = useMemo(
    () => getFilteredMatches(matches, range),
    [range]
  );

  const leaderboard = useMemo(
    () => calculatePlayerMoney(matchReports, matches, range),
    [range]
  );

  const clearFilters = () => setRange({});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* HEADER */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
          <Trophy size={14} />
          Money Board
        </div>

        <h1 className="text-5xl font-display font-black mb-4">
          Leaderboard
        </h1>
      </header>

      {/* FILTER */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-bg-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-white/60 flex items-center gap-2">
            <Filter size={14} />
            {filteredMatches.length} matches used
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setRange(getTodayRange())} className="filter-btn">Today</button>
          <button onClick={() => setRange(getLast7DaysRange())} className="filter-btn">Last 7 Days</button>
          <button onClick={() => setRange(getThisWeekRange())} className="filter-btn">This Week</button>
        </div>

        {/* DATE INPUT */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            value={range.startDate || ""}
            onChange={(e) =>
              setRange((p) => ({ ...p, startDate: e.target.value }))
            }
            className="date-input"
          />

          <input
            type="date"
            value={range.endDate || ""}
            onChange={(e) =>
              setRange((p) => ({ ...p, endDate: e.target.value }))
            }
            className="date-input"
          />
        </div>

        <div className="text-xs text-white/40 mt-2">
          {range.startDate || range.endDate
            ? `${formatDateInputLabel(range.startDate)} → ${formatDateInputLabel(range.endDate)}`
            : "No filter applied"}
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="space-y-3">
        {leaderboard.map((p, i) => (
          <div
            key={p.playerName}
            className="flex justify-between items-center bg-bg-card p-4 rounded-xl border border-white/5"
          >
            <span className="font-bold">
              {i + 1}. {p.playerName}
            </span>
            <span className="font-mono">₹ {p.netRupees}</span>
          </div>
        ))}
      </div>
    </div>
  );
  
}
