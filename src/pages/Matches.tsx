import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase mb-4">
          <Receipt size={14} />
          Matches
        </div>

        <h1 className="text-5xl font-black mb-4 text-white">
          Match History
        </h1>

        <p className="text-gray-400">
          Filter matches based on dates and explore results.
        </p>
      </header>

      {/* FILTER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-3xl p-6 shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #0f172a, #020617)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Filter size={14} />
            {filteredMatches.length} matches shown
          </div>

          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
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
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
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

        {/* ACTIVE RANGE */}
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
      </motion.div>

      {/* MATCH LIST */}
      <motion.div layout className="space-y-6">
        {filteredMatches.map((match) => {
          const report = matchReports.find((r) => r.matchId === match.id);
          const matchPredictions = predictions.filter(
            (p) => p.matchId === match.id
          );

          return (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MatchCard
                match={match}
                report={report}
                predictions={matchPredictions}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
