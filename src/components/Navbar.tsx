import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Trophy, LayoutDashboard, Receipt, BookOpen } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Money Board", path: "/money", icon: Trophy },
  { name: "Matches", path: "/matches", icon: Receipt },
  { name: "Rules", path: "/rules", icon: BookOpen },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-display font-bold text-black group-hover:scale-110 transition-transform">
            10
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">
            10 Rupayalu Aatagalu
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={16} />
                <span className="hidden md:block">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
