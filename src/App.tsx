import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MoneyBoard from "./pages/MoneyBoard";
import Matches from "./pages/Matches";
import Rules from "./pages/Rules";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/money" element={<MoneyBoard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="py-8 px-4 border-t border-white/5 text-center text-white/20 text-xs font-mono uppercase tracking-[0.3em]">
        10 Rupayalu Aatagalu • IPL 2026 • No Refunds
      </footer>
    </div>
  );
}
