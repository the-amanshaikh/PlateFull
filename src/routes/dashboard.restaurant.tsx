import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Gift,
  Zap,
  TrendingUp,
  Star,
  Package,
  Clock,
  DollarSign,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Countdown } from "@/components/countdown";

export const Route = createFileRoute("/dashboard/restaurant")({
  head: () => ({
    meta: [
      { title: "Restaurant dashboard — Reserva" },
      { name: "description", content: "Donate surplus, run flash discount sales, and grow your reputation." },
    ],
  }),
  component: RestaurantDashboard,
});

const now = Date.now();
const active = [
  { title: "Sourdough loaves (12)", type: "Donation", target: "Second Harvest", exp: now + 1000 * 60 * 55, status: "Claimed" },
  { title: "Truffle risotto trays", type: "Flash sale", target: "$14 (was $38)", exp: now + 1000 * 60 * 30, status: "8 sold" },
  { title: "Seasonal salad bowls", type: "Flash sale", target: "$6 (was $18)", exp: now + 1000 * 60 * 110, status: "2 sold" },
];
const reviews = [
  { by: "Mercy Kitchen", stars: 5, text: "Always on time, always generous. A model partner.", when: "2d" },
  { by: "Food Bridge", stars: 5, text: "Beautiful packaging, careful handoff. Truly premium.", when: "5d" },
  { by: "Neighborly Table", stars: 4, text: "Great volumes, would love a bit more notice next time.", when: "1w" },
];

function RestaurantDashboard() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        {/* Header */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Restaurant</p>
            <h1 className="mt-2 truncate font-display text-4xl md:text-5xl">Osteria Verde</h1>
          </div>
          <div className="glass shrink-0 rounded-full px-4 py-2 text-xs text-muted-foreground">
            Reputation · <span className="text-gradient-gold text-sm font-semibold">4.9</span>
          </div>
        </div>

        {/* Primary actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <motion.button
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-8 text-left glow-emerald"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-display text-2xl">Donate Surplus Food</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Push an offer to verified NGOs near you. They'll get an instant alert.
            </p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary">
              New donation <ArrowUpRight className="h-4 w-4" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/25 via-accent/10 to-transparent p-8 text-left glow-gold"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <h2 className="mt-6 font-display text-2xl">Create Flash Discount Sale</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Move large volumes fast — 8 PM to close — before it becomes waste.
            </p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
              New flash sale <ArrowUpRight className="h-4 w-4" />
            </div>
          </motion.button>
        </div>

        {/* Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Star, label: "Reputation", value: "4.9", tone: "gold" },
            { icon: Package, label: "Meals rescued", value: "4,210", tone: "emerald" },
            { icon: DollarSign, label: "Recovered", value: "$18.4k", tone: "emerald" },
            { icon: TrendingUp, label: "Rank", value: "#1", tone: "gold" },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <m.icon className={`h-4 w-4 ${m.tone === "gold" ? "text-accent" : "text-primary"}`} />
              <div className={`mt-3 font-display text-3xl ${m.tone === "gold" ? "text-gradient-gold" : "text-gradient-emerald"}`}>
                {m.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Active offers + reviews */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Active offers</h3>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="mt-4 space-y-3">
              {active.map((a) => (
                <div key={a.title} className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                    a.type === "Donation" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                  }`}>
                    {a.type === "Donation" ? <Gift className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.type} · {a.target}</div>
                  </div>
                  <Countdown target={a.exp} tone={a.type === "Donation" ? "emerald" : "gold"} />
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-display text-xl">Recent reviews</h3>
            </div>
            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <div key={r.by} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{r.by}</div>
                    <div className="text-xs text-muted-foreground">{r.when}</div>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.stars ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
