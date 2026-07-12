import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Bell,
  MapPin,
  Building2,
  Star,
  CheckCircle2,
  Package,
  Users,
  Navigation,
} from "lucide-react";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Countdown } from "@/components/countdown";

export const Route = createFileRoute("/dashboard/ngo")({
  head: () => ({
    meta: [
      { title: "NGO dashboard — Reserva" },
      { name: "description", content: "Real-time donations, alerts, and restaurant ratings for verified NGOs." },
    ],
  }),
  component: NGODashboard,
});

const now = Date.now();
const alerts = [
  { r: "Osteria Verde", meals: 120, dist: "0.6 km", exp: now + 1000 * 60 * 45, urgent: true },
  { r: "Blue Fig Bistro", meals: 60, dist: "1.2 km", exp: now + 1000 * 60 * 120, urgent: false },
  { r: "Sakura Ramen House", meals: 40, dist: "2.1 km", exp: now + 1000 * 60 * 25, urgent: true },
];
const pins = [
  { x: 22, y: 30, urgent: true },
  { x: 55, y: 48, urgent: false },
  { x: 72, y: 22, urgent: true },
  { x: 40, y: 68, urgent: false },
  { x: 82, y: 60, urgent: false },
];
const partners = [
  { name: "Osteria Verde", meals: 820, rating: 5 },
  { name: "Blue Fig Bistro", meals: 640, rating: 5 },
  { name: "Sakura Ramen House", meals: 510, rating: 4 },
  { name: "Casa Lupita", meals: 380, rating: 4 },
];

function NGODashboard() {
  const [openBell, setOpenBell] = useState(false);
  const [rated, setRated] = useState<Record<string, number>>({});

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/30">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Verified NGO</p>
              <h1 className="mt-1 truncate font-display text-3xl md:text-4xl">Second Harvest Collective</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">Chicago · 5 branches · Since 2021</p>
            </div>
          </div>
          <div className="relative shrink-0">
            <button
              onClick={() => setOpenBell(!openBell)}
              className="glass relative grid h-11 w-11 place-items-center rounded-full transition hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground glow-gold">
                3
              </span>
            </button>
            {openBell && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong absolute right-0 top-14 z-20 w-80 rounded-2xl p-3"
              >
                <div className="px-2 pb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  New donation offers
                </div>
                {alerts.map((a) => (
                  <div key={a.r} className="rounded-xl p-3 hover:bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{a.r}</div>
                      <Countdown target={a.exp} tone={a.urgent ? "gold" : "emerald"} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {a.meals} meals · {a.dist}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Package, label: "Meals distributed", value: "5,820" },
            { icon: Users, label: "Beneficiaries", value: "2,140" },
            { icon: CheckCircle2, label: "Pickups this wk", value: "38" },
            { icon: Star, label: "Ranking", value: "#1" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <s.icon className="h-4 w-4 text-primary" />
              <div className="mt-3 font-display text-3xl text-gradient-emerald">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Map + feed */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="glass relative overflow-hidden rounded-3xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">Live donations near you</h3>
                <p className="text-xs text-muted-foreground">Radius: 3 km</p>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10">
                <Navigation className="h-3 w-3" /> Recenter
              </button>
            </div>

            {/* Faux map */}
            <div className="relative mt-6 h-80 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,oklch(0.22_0.02_260)_0%,oklch(0.14_0.01_260)_100%)]">
              <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {/* You marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl" />
                  <div className="relative grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground glow-emerald">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
              {/* Pins */}
              {pins.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                  className="absolute"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <div className={`relative ${p.urgent ? "" : ""}`}>
                    {p.urgent && (
                      <span className="absolute inset-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/40" />
                    )}
                    <div
                      className={`relative grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-2 ring-background ${
                        p.urgent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feed under map */}
            <div className="mt-5 space-y-2">
              {alerts.map((a) => (
                <div key={a.r} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                  <MapPin className={`h-4 w-4 shrink-0 ${a.urgent ? "text-accent" : "text-primary"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.r}</div>
                    <div className="text-xs text-muted-foreground">{a.meals} meals · {a.dist} away</div>
                  </div>
                  <Countdown target={a.exp} tone={a.urgent ? "gold" : "emerald"} />
                  <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110">
                    Claim
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Rate partners */}
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl">Rate partners</h3>
            <p className="mt-1 text-xs text-muted-foreground">Your ratings boost their reputation.</p>
            <div className="mt-4 space-y-4">
              {partners.map((p) => {
                const current = rated[p.name] ?? p.rating;
                return (
                  <div key={p.name} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.meals} meals together</div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setRated((r) => ({ ...r, [p.name]: i + 1 }))}
                          className="transition hover:scale-110"
                          aria-label={`Rate ${i + 1}`}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              i < current ? "fill-accent text-accent" : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
