import { Link } from "@tanstack/react-router";
import { Leaf, Menu } from "lucide-react";
import { useState } from "react";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-4 left-1/2 z-50 w-[min(1200px,calc(100%-2rem))] -translate-x-1/2">
      <nav className="glass-strong flex items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground glow-emerald">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="font-display text-xl">Reserva</span>
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/leaderboard", label: "Leaderboard" },
            { to: "/dashboard/user", label: "User" },
            { to: "/dashboard/restaurant", label: "Restaurant" },
            { to: "/dashboard/ngo", label: "NGO" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-sm text-foreground bg-white/5" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/dashboard/user"
          className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 md:inline-flex"
        >
          Launch app
        </Link>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          <Menu className="h-5 w-5" />
        </button>
      </nav>
      {open && (
        <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-2 md:hidden">
          {[
            { to: "/", label: "Home" },
            { to: "/leaderboard", label: "Leaderboard" },
            { to: "/dashboard/user", label: "User Dashboard" },
            { to: "/dashboard/restaurant", label: "Restaurant Dashboard" },
            { to: "/dashboard/ngo", label: "NGO Dashboard" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
