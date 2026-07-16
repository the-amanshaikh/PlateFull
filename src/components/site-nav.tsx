import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/dashboard/user", label: "Feed" },
    { to: "/dashboard/restaurant", label: "Restaurant" },
    { to: "/dashboard/ngo", label: "NGO" },
  ] as const;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="fixed top-3 left-1/2 z-50 w-[min(1200px,calc(100%-1rem))] -translate-x-1/2">
      <nav className="glass-strong flex items-center justify-between gap-2 rounded-full px-3 py-2 md:px-5 md:py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground glow-emerald">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="font-display text-xl">PlateFull</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
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
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="hidden rounded-full bg-white/5 px-3 py-1.5 text-xs text-muted-foreground lg:inline-flex">
                <User className="mr-1.5 h-3 w-3" />{role ?? "no role"}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
            >
              Sign in
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          {!user && (
            <Link
              to="/auth"
              className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30"
            >
              Sign in
            </Link>
          )}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { setOpen(false); handleSignOut(); }}
              className="rounded-xl px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
