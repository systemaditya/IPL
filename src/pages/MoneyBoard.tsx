import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Trophy, Medal, HeartHandshake, Filter, CalendarRange, RotateCcw } from "lucide-react";
import { matchReports } from "../data/matchReports";
import { matches } from "../data/matches";
import { calculatePlayerMoney, getPlayerRoast, getFilteredMatches, formatDateInputLabel } from "../lib/utils";
import { DateRangeFilter } from "../data/types";

export default function MoneyBoard() {
  const [range, setRange] = useState<DateRangeFilter>({});

  const filteredMatches = useMemo(() => getFilteredMatches(matches, range), [range]);
  const summaries = useMemo(
    () => calculatePlayerMoney(matchReports, matches, range),
    [range]
  );

  const activePresetLabel = useMemo(() => {
    if (!range.startDate && !range.endDate) return "All dates";
    return `${formatDateInputLabel(range.startDate)} → ${formatDateInputLabel(range.endDate)}`;
  }, [range]);

  const totalPointsMoved = useMemo(() => {
    const filteredIds = new Set(filteredMatches.map((match) => match.id));
    return matchReports
      .filter((report) => filteredIds.has(report.matchId))
      .flatMap((report) => Object.values(report.pointsByPlayer))
      .reduce((acc, points) => acc + Math.abs(points), 0);
  }, [filteredMatches]);

  const biggestWin = summaries.length ? Math.max(...summaries.map((summary) => summary.netRupees)) : 0;
  const biggestLoss = summaries.length ? Math.min(...summaries.map((summary) => summary.netRupees)) : 0;
  const top3 = summaries.slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  const clearFilters = () => setRange({});

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-10 text-center sm:text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Trophy size={14} />
          Profit Board
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
          Money <span className="text-brand-primary">Board</span>
        </h1>
        <p className="text-white/60 font-medium text-lg max-w-2xl">
          Filter the season by date and see who made money, who donated, and who somehow still talks the loudest.
        </p>
      </header>

      <section className="mb-8 rounded-[2rem] border border-white/8 bg-bg-card/90 shadow-2xl p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
              <Filter size={14} />
              Date filter
            </div>
            <div className="text-sm text-white/60">
              Showing <span className="text-white font-semibold">{filteredMatches.length}</span> matches • {activePresetLabel}
            </div>
            <div className="text-xs text-white/35">
              Money is recalculated only from matches inside the selected range.
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors self-start lg:self-auto"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <label className="group rounded-2xl border border-white/10 bg-white/5 p-4 focus-within:border-brand-primary/40 transition-colors">
            <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-2">From</span>
            <input
              type="date"
              value={range.startDate || ""}
              onChange={(e) => setRange((prev) => ({ ...prev, startDate: e.target.value || undefined }))}
              className="w-full bg-transparent outline-none text-white text-sm"
            />
          </label>

          <label className="group rounded-2xl border border-white/10 bg-white/5 p-4 focus-within:border-brand-primary/40 transition-colors">
            <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 font-bold mb-2">To</span>
            <input
              type="date"
              value={range.endDate || ""}
              onChange={(e) => setRange((prev) => ({ ...prev, endDate: e.target.value || undefined }))}
              className="w-full bg-transparent outline-none text-white text-sm"
            />
          </label>
        </div>
      </section>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
      >
        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <CalendarRange size={24} />
          </div>
          <div className="text-3xl font-display font-bold">{filteredMatches.length}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Matches in Range</div>
        </motion.div>

        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <HeartHandshake size={24} />
          </div>
          <div className="text-3xl font-display font-bold">₹{Math.round(totalPointsMoved)}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Total Stakes</div>
        </motion.div>

        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
            <Trophy size={24} />
          </div>
          <div className="text-3xl font-display font-bold">+{biggestWin.toFixed(2)}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Biggest Win</div>
        </motion.div>

        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400 mb-4">
            <Medal size={24} />
          </div>
          <div className="text-3xl font-display font-bold">{biggestLoss.toFixed(2)}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Biggest Loss</div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 bg-brand-primary p-8 rounded-[2.5rem] text-black relative overflow-hidden group"
        >
          <div className="relative z-10">
            <div className="text-[10px] uppercase font-black tracking-[0.2em] mb-2 opacity-60">Range Summary</div>
            <h2 className="text-3xl md:text-4xl font-display font-black leading-tight mb-4">
              {filteredMatches.length === matches.length ? "Full season leaderboard" : "Filtered leaderboard"}
            </h2>
            <p className="max-w-xl text-sm md:text-base font-medium opacity-80 mb-6">
              {activePresetLabel}
            </p>
            <button onClick={clearFilters} className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform">
              Clear Filter
              <RotateCcw size={16} />
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Trophy size={300} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
        >
          <h3 className="text-xl font-display font-bold mb-6 flex items-center justify-between">
            Top Performers
            <span className="text-xs text-brand-primary">Filtered</span>
          </h3>
          <div className="space-y-6">
            {top3.map((player, idx) => (
              <div key={player.playerName} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-display font-black text-white/20">
                  0{idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{player.playerName}</span>
                    <span className="text-xs font-mono text-green-400">₹{player.netRupees.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-white/40 italic mt-1 leading-relaxed">
                    "{getPlayerRoast(player)}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/8 bg-bg-card/80 p-5 text-sm text-white/55">
        Date range filter is applied using the match dates you supplied, and it stays aligned with the existing leaderboard logic on your published page.
      </div>
    </div>
  );
}