import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { matches } from "../data/matches";
import { matchReports } from "../data/matchReports";
import { predictions } from "../data/predictions";
import MatchCard from "../components/MatchCard";
import { Receipt, RotateCcw, Filter } from "lucide-react";
import { DateRangeFilter } from "../data/types";
import { getFilteredMatches, formatDateInputLabel } from "../lib/utils";

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

export default function Matches() {
  const [range, setRange] = useState<DateRangeFilter>({});

  const filteredMatches = useMemo(
    () => getFilteredMatches(matches, range),
    [range]
  );

  const clearFilters = () => setRange({});

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* HEADER */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-xs font-bold uppercase tracking-widest mb-4">
          <Receipt size={14} />
          Matches
        </div>

        <h1 className="text-5xl font-display font-black mb-4">
          Match History
        </h1>

        <p className="text-white/60">
          Filter matches based on dates and explore results.
        </p>
      </header>

      {/* FILTER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-3xl border border-white/10 bg-bg-card p-6 shadow-xl"
      >
        {/* Top row */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-white/60 flex items-center gap-2">
            <Filter size={14} />
            {filteredMatches.length} matches shown
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        {/* FILTER BUTTONS */}
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
              <motion.button
                key={btn.label}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setRange(btn.fn())}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-black shadow-lg"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10"
                }`}
              >
                {btn.label}

                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary blur opacity-30 -z-10" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* DATE INPUTS */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="date"
            value={range.startDate || ""}
            onChange={(e) =>
              setRange((p) => ({ ...p, startDate: e.target.value }))
            }
            className="bg-black/30 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-brand-primary transition-all"
          />

          <input
            type="date"
            value={range.endDate || ""}
            onChange={(e) =>
              setRange((p) => ({ ...p, endDate: e.target.value }))
            }
            className="bg-black/30 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-brand-primary transition-all"
          />
        </div>

        {/* ACTIVE FILTER BADGE */}
        <div className="mt-4">
          {range.startDate || range.endDate ? (
            <span className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-semibold">
              {formatDateInputLabel(range.startDate)} →{" "}
              {formatDateInputLabel(range.endDate)}
            </span>
          ) : (
            <span className="text-xs text-white/40">
              No filter applied
            </span>
          )}
        </div>
      </motion.div>

      {/* MATCH LIST */}
      <motion.div layout className="space-y-6">
        {filteredMatches.map((match) => {
          const report = matchReports.find((r) => r.matchId === match.id);
          const matchPredictions = predictions.filter(
            (p) => p.matchId === match.id
          );

          return (
            <MatchCard
              key={match.id}
              match={match}
              report={report}
              predictions={matchPredictions}
            />
          );
        })}
      </motion.div>
    </div>
  );
}