import { motion } from "motion/react";
import { rulesDescription, ENTRY_AMOUNT_PER_MATCH, RUPEES_PER_POINT } from "../data/types";
import { BookOpen, Info, ShieldAlert, CloudRain } from "lucide-react";

export default function Rules() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4"
        >
          <BookOpen size={14} />
          The Rulebook
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4">
          How it <span className="text-brand-primary">Works</span>
        </h1>
        <p className="text-white/60 font-medium text-lg">
          The 10-rupayalu circus explained.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-bg-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-6">
            <Info size={24} />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight">The Basics</h2>
          <ul className="space-y-4 text-white/60">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <span>Each match, everyone throws in <span className="text-white font-bold">₹{ENTRY_AMOUNT_PER_MATCH}</span>.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <span>Predict a winner before the match starts.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <span>Points roughly equal <span className="text-white font-bold">rupayalu</span> won or lost.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
              <span>Conversion rate: <span className="text-white font-bold">{RUPEES_PER_POINT} Point = ₹1</span>.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
            <CloudRain size={24} />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight">Abandoned Matches</h2>
          <p className="text-white/60 leading-relaxed">
            Match 12 was abandoned due to rain. That match gives 0 points to everyone and the bet is effectively carried into the next match. 
            This is already baked into the report numbers.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-red-500/10 p-8 rounded-[2.5rem] border border-red-500/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-xl font-display font-bold uppercase tracking-tight text-red-400">The Golden Rule</h2>
        </div>
        <p className="text-white/80 italic text-lg leading-relaxed">
          "Don't cry about your predictions. You're the one who made them. 
          If you're losing, you're just a sponsor. If you're winning, you're just lucky."
        </p>
      </motion.div>
    </div>
  );
}
