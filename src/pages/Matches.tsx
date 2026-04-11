import { motion } from "motion/react";
import { matches } from "../data/matches";
import { matchReports } from "../data/matchReports";
import { predictions } from "../data/predictions";
import MatchCard from "../components/MatchCard";
import { Receipt } from "lucide-react";

export default function Matches() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
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
        <p className="text-white/60 font-medium text-lg">
          Where your 10 rupayalu decisions come to be judged.
        </p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6"
      >
        {matches.map((match) => {
          const report = matchReports.find(r => r.matchId === match.id)!;
          const matchPredictions = predictions.filter(p => p.matchId === match.id);
          
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
