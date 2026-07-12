import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Store, HeartHandshake, TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Impact Leaderboard — Reserva" },
      { name: "description", content: "See the top restaurants and NGOs rescuing meals and feeding communities on Reserva." },
      { property: "og:title", content: "Impact Leaderboard — Reserva" },
      { property: "og:description", content: "Top restaurants and NGOs on Reserva's impact leaderboard." },
    ],
  }),
  component: LeaderboardPage,
});

type Entry = { name: string; city: string; score: number; meals: number; rating?: number };

const restaurants: Entry[] = [
  { name: "Osteria Verde", city: "Milan", score: 9820, meals: 4210, rating: 4.9 },
  { name: "Blue Fig Bistro", city: "Brooklyn", score: 8940, meals: 3860, rating: 4.8 },
  { name: "Sakura Ramen House", city: "Austin", score: 8410, meals: 3520, rating: 4.9 },
  { name: "Casa Lupita", city: "Mexico City", score: 7620, meals: 3100, rating: 4.7 },
  { name: "The Copper Pan", city: "London", score: 7180, meals: 2980, rating: 4.6 },
  { name: "Maison Doré", city: "Paris", score: 6720, meals: 2740, rating: 4.7 },
  { name: "Nordic Table", city: "Copenhagen", score: 6210, meals: 2510, rating: 4.5 },
];

const ngos: Entry[] = [
  { name: "Second Harvest Collective", city: "Chicago", score: 11240, meals: 5820 },
  { name: "Mercy Kitchen", city: "Mumbai", score: 10120, meals: 5310 },
  { name: "Food Bridge", city: "Berlin", score: 9450, meals: 4920 },
  { name: "Hands & Hearts", city: "Nairobi", score: 8210, meals: 4180 },
  { name: "Neighborly Table", city: "Toronto", score: 7480, meals: 3820 },
  { name: "Casa Solidaria", city: "Madrid", score: 6890, meals: 3510 },
];

function LeaderboardPage() {
  const [tab, setTab] = useState<"restaurants" | "ngos">("restaurants");
  const list = tab === "restaurants" ? restaurants : ngos;
  const max = list[0].score;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-36 pb-24">
        <div className="mb-10 text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs text-accent">
            <Trophy className="h-3.5 w-3.5" /> Impact Leaderboard
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl">
            Champions of the <span className="text-gradient-gold italic">rescue</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Every meal saved earns points. Every rating raises rank. The world's most generous kitchens and organizations, ranked live.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mb-10 flex w-fit rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {(
            [
              { k: "restaurants", label: "Top Restaurants", icon: Store },
              { k: "ngos", label: "Top NGOs", icon: HeartHandshake },
            ] as const
          ).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                tab === t.k ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t.k && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/40"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <t.icon className="relative h-4 w-4" />
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="mb-12 grid gap-4 md:grid-cols-3 md:items-end">
          {[list[1], list[0], list[2]].map((e, idx) => {
            const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
            const heights = ["md:h-64", "md:h-80", "md:h-56"];
            const tints = [
              "from-slate-300/20 ring-slate-300/30",
              "from-accent/30 ring-accent/50 glow-gold",
              "from-orange-400/20 ring-orange-400/30",
            ];
            const icons = [Medal, Crown, Medal];
            const Icon = icons[idx];
            return (
              <motion.div
                key={e.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={`relative flex flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-b ${tints[idx]} to-transparent p-6 ring-1 ${heights[idx]}`}
              >
                <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/30 backdrop-blur">
                  <Icon className={`h-5 w-5 ${rank === 1 ? "text-accent" : rank === 2 ? "text-slate-200" : "text-orange-400"}`} />
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">#{rank}</div>
                <div className="mt-2 font-display text-2xl">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.city}</div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl text-gradient-gold">
                    {e.score.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{e.meals.toLocaleString()} meals rescued</div>
              </motion.div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="glass rounded-3xl p-3 md:p-6">
          <div className="hidden grid-cols-12 gap-4 px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground md:grid">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Name</div>
            <div className="col-span-2">City</div>
            <div className="col-span-3">Progress</div>
            <div className="col-span-2 text-right">Points</div>
          </div>
          <div className="mt-2 space-y-2">
            {list.map((e, i) => {
              const rank = i + 1;
              const top3 = rank <= 3;
              return (
                <motion.div
                  key={e.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`grid grid-cols-12 items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-white/5 ${
                    top3 ? "ring-1 ring-accent/20" : ""
                  }`}
                >
                  <div className="col-span-2 md:col-span-1">
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${
                        rank === 1
                          ? "bg-accent text-accent-foreground glow-gold"
                          : rank === 2
                          ? "bg-slate-200/20 text-slate-100 ring-1 ring-slate-200/40"
                          : rank === 3
                          ? "bg-orange-400/20 text-orange-200 ring-1 ring-orange-400/40"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {rank}
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-4">
                    <div className="font-semibold">{e.name}</div>
                    <div className="text-xs text-muted-foreground md:hidden">{e.city}</div>
                  </div>
                  <div className="col-span-2 hidden text-sm text-muted-foreground md:block">
                    {e.city}
                  </div>
                  <div className="col-span-4 hidden md:block">
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(e.score / max) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.1 + i * 0.03 }}
                        className={`h-full rounded-full ${
                          top3 ? "bg-gradient-to-r from-accent to-primary" : "bg-primary/60"
                        }`}
                      />
                    </div>
                    {e.rating && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {e.rating} · {e.meals.toLocaleString()} meals
                      </div>
                    )}
                  </div>
                  <div className="col-span-4 text-right md:col-span-2">
                    <div className="font-display text-lg tabular-nums text-gradient-gold">
                      {e.score.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" /> +{Math.floor(e.score / 100)} wk
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
