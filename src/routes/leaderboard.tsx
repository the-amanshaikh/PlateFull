import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Trophy, Crown, Medal, Store, HeartHandshake, TrendingUp, Star, Sparkles, Flame, Award, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Hall of Impact — PlateFull" },
      { name: "description", content: "The Hall of Impact: PlateFull's most legendary restaurants and NGOs rescuing meals and feeding communities." },
      { property: "og:title", content: "Hall of Impact — PlateFull" },
      { property: "og:description", content: "Legendary restaurants and NGOs on PlateFull's Hall of Impact leaderboard." },
    ],
  }),
  component: LeaderboardPage,
});

type Entry = { name: string; city: string; score: number; meals: number; rating?: number };

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const c = animate(mv, value, { duration: 1.4, ease: "easeOut" });
    return c.stop;
  }, [value, mv]);
  return <motion.span className={className}>{rounded}</motion.span>;
}

function tierFor(score: number, rank: number) {
  if (rank === 1) return { name: "Legend", icon: Crown, tone: "text-accent" };
  if (rank <= 3) return { name: "Champion", icon: Trophy, tone: "text-accent/90" };
  if (rank <= 10) return { name: "Elite", icon: Shield, tone: "text-primary" };
  if (score > 0) return { name: "Rising", icon: Flame, tone: "text-orange-300" };
  return { name: "Contender", icon: Award, tone: "text-muted-foreground" };
}

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

      {/* Ambient hero glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div className="absolute left-1/2 top-24 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
        <div className="absolute left-1/2 top-40 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-32 pb-24 md:px-6 md:pt-36">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs text-accent"
          >
            <Sparkles className="h-3.5 w-3.5" /> Hall of Impact
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mt-6 font-display text-5xl leading-[1.02] md:text-7xl"
          >
            The <span className="text-gradient-gold italic">legends</span><br className="md:hidden" /> of the rescue
          </motion.h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Every meal saved earns points. Every rating earns rank. A living monument, updated in real time.
          </p>
        </div>

        {/* Tabs */}
        <div className="mx-auto mb-14 flex w-fit rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
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
          <div className="glass rounded-3xl p-14 text-center">
            <Trophy className="mx-auto mb-4 h-10 w-10 text-accent/60" />
            <div className="font-display text-2xl">A throne awaits.</div>
            <div className="mt-2 text-sm text-muted-foreground">Be the first {tab === "restaurants" ? "restaurant" : "NGO"} to enter the Hall.</div>
          </div>
        ) : (
          <>
            {/* Podium */}
            {list.length >= 3 && (
              <div className="relative mb-16">
                {/* Radiant halo behind #1 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 60%)" }}
                />
                {/* Rotating conic ring */}
                <motion.div
                  animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
                  style={{ background: "conic-gradient(from 0deg, transparent, hsl(var(--accent) / 0.6), transparent, hsl(var(--primary) / 0.5), transparent)" }}
                />

                <div className="grid gap-6 md:grid-cols-3 md:items-end">
                  {[list[1], list[0], list[2]].map((e, idx) => {
                    const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                    const isFirst = rank === 1;
                    const heights = ["md:h-[340px]", "md:h-[420px]", "md:h-[300px]"];
                    const rings = [
                      "ring-slate-300/40 shadow-[0_20px_80px_-20px_rgba(203,213,225,0.35)]",
                      "ring-accent/60 shadow-[0_30px_120px_-20px_rgba(234,179,8,0.55)] glow-gold",
                      "ring-orange-400/40 shadow-[0_20px_80px_-20px_rgba(251,146,60,0.35)]",
                    ];
                    const tint = [
                      "from-slate-200/15 via-slate-300/5",
                      "from-accent/25 via-accent/10",
                      "from-orange-400/15 via-orange-300/5",
                    ];
                    const medalGrad = [
                      "from-slate-100 to-slate-400",
                      "from-yellow-200 via-amber-400 to-yellow-600",
                      "from-orange-200 to-amber-700",
                    ];
                    const Icon = isFirst ? Crown : Medal;
                    const t = tierFor(e.score, rank);

                    return (
                      <motion.div
                        key={e.name}
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.12, duration: 0.7, type: "spring", damping: 20 }}
                        whileHover={{ y: -6 }}
                        className={`group relative flex flex-col justify-end overflow-hidden rounded-[28px] bg-gradient-to-b ${tint[idx]} to-transparent p-6 pt-8 ring-1 ${rings[idx]} ${heights[idx]}`}
                      >
                        {/* Shimmer sweep */}
                        <motion.div
                          initial={{ x: "-120%" }} animate={{ x: "220%" }}
                          transition={{ duration: isFirst ? 3.4 : 4.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        />

                        {/* Floating sparkles for #1 */}
                        {isFirst && (
                          <>
                            {[0, 1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 1, 0], y: [-20, -60] }}
                                transition={{ duration: 2.6, delay: i * 0.5, repeat: Infinity }}
                                className="pointer-events-none absolute"
                                style={{ left: `${20 + i * 18}%`, bottom: 40 }}
                              >
                                <Sparkles className="h-3 w-3 text-accent" />
                              </motion.div>
                            ))}
                          </>
                        )}

                        {/* Medal */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <div className={`relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${medalGrad[idx]} shadow-2xl ring-4 ring-background`}>
                            <Icon className={`h-7 w-7 ${isFirst ? "text-amber-900" : rank === 2 ? "text-slate-700" : "text-orange-900"}`} />
                            {isFirst && (
                              <motion.div
                                animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full ring-2 ring-accent"
                              />
                            )}
                          </div>
                        </div>

                        <div className="mt-10 text-center">
                          <div className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${t.tone} backdrop-blur`}>
                            <t.icon className="h-3 w-3" /> {t.name}
                          </div>
                          <div className="mt-3 font-display text-2xl md:text-3xl">{e.name}</div>
                          <div className="text-xs text-muted-foreground">{e.city}</div>

                          <div className="mt-5 flex items-baseline justify-center gap-2">
                            <AnimatedNumber value={e.score} className="font-display text-4xl text-gradient-gold md:text-5xl" />
                            <span className="text-xs text-muted-foreground">pts</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{e.meals.toLocaleString()} meals rescued</div>
                          {e.rating != null && (
                            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[11px]">
                              <Star className="h-3 w-3 fill-accent text-accent" /> {e.rating}
                            </div>
                          )}
                        </div>

                        {/* Plinth */}
                        <div className={`mt-6 h-2 rounded-full bg-gradient-to-r ${isFirst ? "from-accent/70 via-yellow-300 to-accent/70" : rank === 2 ? "from-slate-200/40 via-slate-100/60 to-slate-200/40" : "from-orange-400/40 via-orange-200/60 to-orange-400/40"}`} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ranking list */}
            <div className="glass rounded-3xl p-3 md:p-6">
              <div className="mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Award className="h-4 w-4 text-accent" /> Full ranking
                </div>
                <div className="text-xs text-muted-foreground">{list.length} contenders</div>
              </div>
              <div className="space-y-2">
                {list.map((e, i) => {
                  const rank = i + 1;
                  const top3 = rank <= 3;
                  const t = tierFor(e.score, rank);
                  return (
                    <motion.div
                      key={e.name + i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 10) * 0.03 }}
                      whileHover={{ scale: 1.005 }}
                      className={`relative grid grid-cols-12 items-center gap-4 overflow-hidden rounded-2xl px-4 py-4 transition ${
                        rank === 1
                          ? "bg-gradient-to-r from-accent/15 via-transparent to-transparent ring-1 ring-accent/40"
                          : top3
                          ? "bg-white/[0.03] ring-1 ring-accent/20"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {rank === 1 && (
                        <motion.div
                          initial={{ x: "-120%" }} animate={{ x: "220%" }}
                          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                          className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                      )}
                      <div className="col-span-2 md:col-span-1">
                        <div className={`relative grid h-10 w-10 place-items-center rounded-xl text-sm font-bold ${
                          rank === 1 ? "bg-gradient-to-br from-yellow-300 to-amber-600 text-amber-950 shadow-lg shadow-accent/40"
                            : rank === 2 ? "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800"
                            : rank === 3 ? "bg-gradient-to-br from-orange-300 to-amber-700 text-orange-950"
                            : "bg-white/5 text-muted-foreground ring-1 ring-white/10"
                        }`}>
                          {rank}
                        </div>
                      </div>
                      <div className="col-span-6 md:col-span-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{e.name}</span>
                          <span className={`hidden items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] uppercase tracking-widest ${t.tone} md:inline-flex`}>
                            <t.icon className="h-2.5 w-2.5" /> {t.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden">{e.city}</div>
                      </div>
                      <div className="col-span-2 hidden text-sm text-muted-foreground md:block">{e.city}</div>
                      <div className="col-span-4 hidden md:block">
                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${(e.score / max) * 100}%` }}
                            transition={{ duration: 1, delay: 0.1 + Math.min(i, 10) * 0.04, ease: "easeOut" }}
                            className={`h-full rounded-full ${top3 ? "bg-gradient-to-r from-accent via-yellow-300 to-primary shadow-[0_0_12px_rgba(234,179,8,0.5)]" : "bg-gradient-to-r from-primary/60 to-primary/30"}`}
                          />
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {e.meals.toLocaleString()} meals</span>
                          {e.rating != null && (
                            <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-accent text-accent" /> {e.rating}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-4 text-right md:col-span-2">
                        <div className="font-display text-lg tabular-nums text-gradient-gold md:text-xl">{e.score.toLocaleString()}</div>
                        <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                          pts
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
