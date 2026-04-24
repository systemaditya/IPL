import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { matches } from "../data/matches";
import { matchReports } from "../data/matchReports";
import { predictions } from "../data/predictions";
import MatchCard from "../components/MatchCard";
import { Receipt, RotateCcw, Filter, Sparkles } from "lucide-react";
import { DateRangeFilter } from "../data/types";
import { getFilteredMatches, formatDateInputLabel } from "../lib/utils";

const presets: Array<{ label: string; range: DateRangeFilter }> = [
  { label: "All", range: {} },
  { label: "Phase 1", range: { startDate: "2026-03-28", endDate: "2026-04-05" } },
  { label: "Phase 2", range: { startDate: "2026-04-06", endDate: "2026-04-12" } },
  { label: "Phase 3", range: { startDate: "2026-04-13", endDate: "2026-04-22" } },
];

export default function Matches() {
  const [range, setRange] = useState<DateRangeFilter>({});

  const filteredMatches = useMemo(() => getFilteredMatches(matches, range), [range]);

  const activePreset = presets.find((preset) =>
    preset.range.startDate === range.startDate && preset.range.endDate === range.endDate
  );

  const clearFilters = () => setRange({});

  const totalMatches = matches.length;
  const completedVisible = filteredMatches.filter((m) => m.status === "completed").length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Receipt size={14} />
          Chaos Log
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
          Match <span className="text-brand-secondary">History</span>
        </h1>
        <p className="text-white/60 font-medium text-lg max-w-2xl">
          Browse every match, filter by date, and see exactly when the predictions turned into profit or pain.
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-[2rem] border border-white/8 bg-bg-card/90 shadow-2xl p-5 md:p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
              <Filter size={14} />
              Date filter
            </div>
            <div className="text-sm text-white/60">
              Showing <span className="text-white font-semibold">{filteredMatches.length}</span> of <span className="text-white font-semibold">{totalMatches}</span> matches
              {activePreset ? ` • ${activePreset.label}` : ""}
            </div>
            <div className="text-xs text-white/35">
              {range.startDate || range.endDate ? `Range: ${formatDateInputLabel(range.startDate)} → ${formatDateInputLabel(range.endDate)}` : "No filter applied"}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => {
              const active = activePreset?.label === preset.label;
              return (
                <button
                  key={preset.label}
                  onClick={() => setRange(preset.range)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${active
                    ? "bg-brand-primary text-black border-brand-primary"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <label className="group rounded-2xl border border-white/10 bg-white/5 p-4 focus-within:border-brand-primary/40 transition-colors">
            <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-2">From</span>
            <input
              type="date"
              value={range.startDate || ""}
              onChange={(e) => setRange((prev) => ({ ...prev, startDate: e.target.value || undefined }))}
              className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/30"
            />
          </label>

          <label className="group rounded-2xl border border-white/10 bg-white/5 p-4 focus-within:border-brand-primary/40 transition-colors">
            <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-2">To</span>
            <input
              type="date"
              value={range.endDate || ""}
              onChange={(e) => setRange((prev) => ({ ...prev, endDate: e.target.value || undefined }))}
              className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/30"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-5 border-t border-white/5">
          <div className="flex items-center gap-2 text-sm text-white/55">
            <Sparkles size={14} className="text-brand-secondary" />
            {completedVisible} completed matches visible in this range
          </div>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </motion.section>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {filteredMatches.length > 0 ? filteredMatches.map((match) => {
          const report = matchReports.find(r => r.matchId === match.id);
          const matchPredictions = predictions.filter(p => p.matchId === match.id);
          return (
            <MatchCard 
              key={match.id}
              match={match}
              report={report}
              predictions={matchPredictions}
            />
          );
        }) : (
          <div className="rounded-3xl border border-white/10 bg-bg-card p-8 text-center text-white/60">
            No matches fall inside this date range.
          </div>
        )}
      </motion.div>
    </div>
  );
}