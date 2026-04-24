import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Match, MatchReportRow, PlayerPrediction, TeamCode } from "../data/types";
import { getMatchRoast, cn, formatMatchDate } from "../lib/utils";
import { ChevronDown, Trophy, CloudRain, CalendarDays, CircleAlert } from "lucide-react";

interface MatchCardProps {
  match: Match;
  report?: MatchReportRow;
  predictions?: PlayerPrediction[];
  key?: string | number;
}

const teamColors: Record<TeamCode, string> = {
  CSK: "bg-yellow-500 text-black",
  MI: "bg-blue-600 text-white",
  RCB: "bg-red-600 text-white",
  GT: "bg-slate-800 text-white",
  RR: "bg-pink-500 text-white",
  LSG: "bg-cyan-500 text-black",
  KKR: "bg-purple-700 text-white",
  SRH: "bg-orange-600 text-white",
  PBKS: "bg-red-500 text-white",
  DC: "bg-blue-800 text-white",
};

export default function MatchCard({ match, report, predictions = [] }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const roast = report ? getMatchRoast(match, report) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-bg-card border border-white/5 rounded-2xl overflow-hidden shadow-xl"
    >
      <div 
        className="p-5 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
              Match {match.matchNumber} • {match.status}
            </span>
            {match.date && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-white/70">
                <CalendarDays size={12} />
                {formatMatchDate(match.date)}
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-white/40"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={cn("px-4 py-2 rounded-lg font-display font-bold text-lg w-full text-center", teamColors[match.teamA])}>
              {match.teamA}
            </div>
          </div>
          
          <div className="text-white/20 font-display font-black italic text-2xl">VS</div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={cn("px-4 py-2 rounded-lg font-display font-bold text-lg w-full text-center", teamColors[match.teamB])}>
              {match.teamB}
            </div>
          </div>
        </div>

        {match.winner && (
          <div className="mt-4 flex items-center justify-center gap-2 text-brand-secondary font-display font-bold text-sm uppercase tracking-wider">
            <Trophy size={14} />
            Winner: {match.winner}
          </div>
        )}

        {match.status === "abandoned" && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-400 font-display font-bold text-sm uppercase tracking-wider">
            <CloudRain size={14} />
            Abandoned - Bet Carried Forward
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-5">
              {report ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {predictions.length > 0 ? predictions.map((pred) => {
                      const points = report.pointsByPlayer[pred.playerName];
                      return (
                        <div key={pred.playerName} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">{pred.playerName}</span>
                            <span className="text-xs text-white/40">
                              {pred.predictedTeam ? `Picked ${pred.predictedTeam}` : pred.note || "No pick"}
                            </span>
                          </div>
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold font-mono",
                            points > 0 ? "bg-green-500/20 text-green-400" : 
                            points < 0 ? "bg-red-500/20 text-red-400" : 
                            "bg-white/10 text-white/40"
                          )}>
                            {points > 0 ? `+${points.toFixed(1)}` : points.toFixed(1)}
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-span-full flex items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 text-white/50 text-sm">
                        <CircleAlert size={16} />
                        No predictions available for this match.
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                    <div className="text-[10px] uppercase font-bold text-brand-primary tracking-widest mb-1">Roast of the Match</div>
                    <p className="text-sm italic text-white/80">"{roast}"</p>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/60 text-sm">
                  This match is in your date list, but no report row is attached yet.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}