import { motion } from "motion/react";
import { matchReports } from "../data/matchReports";
import { matches } from "../data/matches";
import { calculatePlayerMoney, getOverallRoast, getPlayerRoast } from "../lib/utils";
import { TrendingUp, TrendingDown, Activity, DollarSign, ArrowRight, Scale } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const summaries = calculatePlayerMoney(matchReports);
  const completedMatches = matches.filter(m => m.status === "completed").length;
  
  const allPoints = matchReports.flatMap(r => Object.values(r.pointsByPlayer));
  const totalPointsMoved = allPoints.reduce((acc, p) => acc + Math.abs(p), 0);
  const biggestWin = Math.max(...allPoints);
  const biggestLoss = Math.min(...allPoints);

  const top3 = summaries.slice(0, 3);
  const overallRoast = getOverallRoast(summaries);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4"
        >
          10 Rupayalu <span className="text-brand-primary">Aatagalu</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-white/60 font-medium"
        >
          Who’s hot, who’s donating. The official IPL 2026 chaos tracker.
        </motion.p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
            <Activity size={24} />
          </div>
          <div className="text-3xl font-display font-bold">{completedMatches}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Matches Played</div>
        </motion.div>

        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
            <DollarSign size={24} />
          </div>
          <div className="text-3xl font-display font-bold">₹{Math.round(totalPointsMoved)}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Total Stakes</div>
        </motion.div>

        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 mb-4">
            <TrendingUp size={24} />
          </div>
          <div className="text-3xl font-display font-bold">+{biggestWin.toFixed(1)}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Biggest Win</div>
        </motion.div>

        <motion.div variants={item} className="bg-bg-card p-6 rounded-3xl border border-white/5 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-400 mb-4">
            <TrendingDown size={24} />
          </div>
          <div className="text-3xl font-display font-bold">{biggestLoss.toFixed(1)}</div>
          <div className="text-sm text-white/40 font-medium uppercase tracking-wider">Biggest Loss</div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-brand-primary p-8 rounded-[2.5rem] text-black relative overflow-hidden group"
        >
          <div className="relative z-10">
            <div className="text-[10px] uppercase font-black tracking-[0.2em] mb-2 opacity-60">Group Consensus</div>
            <h2 className="text-4xl md:text-5xl font-display font-black leading-none mb-6">
              "{overallRoast}"
            </h2>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                View Chaos Log <ArrowRight size={16} />
              </Link>

              <Link
                to="/settlement"
                className="inline-flex items-center gap-2 bg-white/20 text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform border border-black/10"
              >
                View Settlement <Scale size={16} />
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Activity size={300} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-bg-card p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
        >
          <h3 className="text-xl font-display font-bold mb-6 flex items-center justify-between">
            Top Performers
            <Link to="/money" className="text-xs text-brand-primary hover:underline">
              View All
            </Link>
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
                    <span className="text-xs font-mono text-green-400">
                      ₹{player.netRupees.toFixed(2)}
                    </span>
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
    </div>
  );
}
