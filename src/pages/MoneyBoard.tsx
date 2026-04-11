import { motion } from "motion/react";
import { matchReports } from "../data/matchReports";
import { calculatePlayerMoney, getPlayerRoast, cn } from "../lib/utils";
import { Trophy, Medal, HeartHandshake } from "lucide-react";

export default function MoneyBoard() {
  const summaries = calculatePlayerMoney(matchReports);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4"
        >
          <Trophy size={14} />
          The Hall of Fame & Shame
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter"
        >
          Money <span className="text-brand-primary">Board</span>
        </motion.h1>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {summaries.map((player, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === summaries.length - 1;
          const roast = getPlayerRoast(player);

          return (
            <motion.div
              key={player.playerName}
              variants={item}
              className={cn(
                "group relative p-6 rounded-3xl border transition-all duration-300",
                isFirst ? "bg-brand-primary/10 border-brand-primary/30 shadow-[0_0_30px_rgba(242,125,38,0.1)]" : 
                isLast ? "bg-red-500/5 border-red-500/20" :
                "bg-bg-card border-white/5 hover:border-white/10"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-xl shadow-inner",
                    isFirst ? "bg-brand-primary text-black" : 
                    isLast ? "bg-red-500 text-white" :
                    "bg-white/5 text-white/40"
                  )}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-display font-bold">{player.playerName}</h3>
                      {isFirst && <span className="px-2 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-wider">King of 10rs</span>}
                      {isLast && <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-wider">Group Sponsor</span>}
                    </div>
                    <p className="text-sm text-white/40 italic mt-1">"{roast}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 sm:text-right">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Points</span>
                    <span className="font-mono font-bold">{player.totalPoints.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-col min-w-[100px]">
                    <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Net Rupees</span>
                    <span className={cn(
                      "text-2xl font-display font-black",
                      player.netRupees > 0 ? "text-green-400" : 
                      player.netRupees < 0 ? "text-red-400" : 
                      "text-white/40"
                    )}>
                      {player.netRupees > 0 ? `+₹${player.netRupees.toFixed(2)}` : `₹${player.netRupees.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/5 text-center"
      >
        <p className="text-white/40 text-sm leading-relaxed">
          Calculations are based on the official 10 Rupayalu Aatagalu ledger. 
          If you have a problem with your score, please submit a complaint to the nearest wall.
        </p>
      </motion.footer>
    </div>
  );
}
