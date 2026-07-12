import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Store, HeartHandshake, TrendingUp, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Impact Leaderboard — PlateFull" },
      { name: "description", content: "See the top restaurants and NGOs rescuing meals and feeding communities on PlateFull." },
      { property: "og:title", content: "Impact Leaderboard — PlateFull" },
      { property: "og:description", content: "Top restaurants and NGOs on PlateFull's impact leaderboard." },
    ],
  }),
  component: LeaderboardPage,
});

type Entry = { name: string; city: string; score: number; meals: number; rating?: number };

function LeaderboardPage() {
  const [tab, setTab] = useState<"restaurants" | "ngos">("restaurants");
  const [restaurants, setRestaurants] = useState<Entry[]>([]);
  const [ngos, setNgos] = useState<Entry[]>([]);

  useEffect(() => {
    supabase.from("restaurants").select("name,city,meals_rescued,rating_sum,rating_count").then(({ data }) => {
      const list: Entry[] = (data ?? []).map((r) => ({
        name: r.name as string,
        city: (r.city as string) || "—",
        meals: r.meals_rescued as number,
        score: (r.meals_rescued as number) * 10 + (r.rating_count ? Math.round(((r.rating_sum as number) / (r.rating_count as number)) * 100) : 0),
        rating: r.rating_count ? +((r.rating_sum as number) / (r.rating_count as number)).toFixed(1) : undefined,
      })).sort((a, b) => b.score - a.score);
      setRestaurants(list);
    });
    supabase.from("ngos").select("name,city,meals_distributed").then(({ data }) => {
      const list: Entry[] = (data ?? []).map((n) => ({
        name: n.name as string,
        city: (n.city as string) || "—",
        meals: n.meals_distributed as number,
        score: (n.meals_distributed as number) * 12,
      })).sort((a, b) => b.score - a.score);
      setNgos(list);
    });
  }, []);

  const list = tab === "restaurants" ? restaurants : ngos;
  const max = list[0]?.score || 1;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 pt-32 pb-24 md:px-6 md:pt-36">
        <div className="mb-10 text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs text-accent">
            <Trophy className="h-3.5 w-3.5" /> Impact Leaderboard
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-7xl">
            Champions of the <span className="text-gradient-gold italic">rescue</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Every meal saved earns points. Every rating raises rank. Ranked live from real activity.
          </p>
        </div>

        <div className="mx-auto mb-10 flex w-fit rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {([
            { k: "restaurants", label: "Top Restaurants", icon: Store },
            { k: "ngos", label: "Top NGOs", icon: HeartHandshake },
          ] as const).map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition md:px-5 md:py-2.5 ${
                tab === t.k ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t.k && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/40" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
              )}
              <t.icon className="relative h-4 w-4" />
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center text-sm text-muted-foreground">
            No {tab} yet. Be the first to sign up and start rescuing!
          </div>
        ) : (
          <>
            {list.length >= 3 && (
              <div className="mb-12 grid gap-4 md:grid-cols-3 md:items-end">
                {[list[1], list[0], list[2]].map((e, idx) => {
                  const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                  const heights = ["md:h-64", "md:h-80", "md:h-56"];
                  const tints = ["from-slate-300/20 ring-slate-300/30", "from-accent/30 ring-accent/50 glow-gold", "from-orange-400/20 ring-orange-400/30"];
                  const Icon = idx === 1 ? Crown : Medal;
                  return (
                    <motion.div
                      key={e.name}
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.6 }}
                      className={`relative flex flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-b ${tints[idx]} to-transparent p-6 ring-1 ${heights[idx]}`}
                    >
                      <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/30 backdrop-blur">
                        <Icon className={`h-5 w-5 ${rank === 1 ? "text-accent" : rank === 2 ? "text-slate-200" : "text-orange-400"}`} />
                      </div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">#{rank}</div>
                      <div className="mt-2 font-display text-2xl">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.city}</div>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-display text-3xl text-gradient-gold">{e.score.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{e.meals.toLocaleString()} meals</div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="glass rounded-3xl p-3 md:p-6">
              <div className="mt-2 space-y-2">
                {list.map((e, i) => {
                  const rank = i + 1;
                  const top3 = rank <= 3;
                  return (
                    <motion.div
                      key={e.name + i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 10) * 0.03 }}
                      className={`grid grid-cols-12 items-center gap-4 rounded-2xl px-4 py-4 transition hover:bg-white/5 ${top3 ? "ring-1 ring-accent/20" : ""}`}
                    >
                      <div className="col-span-2 md:col-span-1">
                        <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${
                          rank === 1 ? "bg-accent text-accent-foreground glow-gold"
                            : rank === 2 ? "bg-slate-200/20 text-slate-100 ring-1 ring-slate-200/40"
                            : rank === 3 ? "bg-orange-400/20 text-orange-200 ring-1 ring-orange-400/40"
                            : "bg-white/5 text-muted-foreground"
                        }`}>{rank}</div>
                      </div>
                      <div className="col-span-6 md:col-span-4">
                        <div className="font-semibold">{e.name}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{e.city}</div>
                      </div>
                      <div className="col-span-2 hidden text-sm text-muted-foreground md:block">{e.city}</div>
                      <div className="col-span-4 hidden md:block">
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${(e.score / max) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.1 + Math.min(i, 10) * 0.03 }}
                            className={`h-full rounded-full ${top3 ? "bg-gradient-to-r from-accent to-primary" : "bg-primary/60"}`}
                          />
                        </div>
                        {e.rating && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-accent text-accent" />{e.rating} · {e.meals.toLocaleString()} meals
                          </div>
                        )}
                      </div>
                      <div className="col-span-4 text-right md:col-span-2">
                        <div className="font-display text-lg tabular-nums text-gradient-gold">{e.score.toLocaleString()}</div>
                        <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3" /> pts
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
