import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Star, Flame, Heart, Search, SlidersHorizontal } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Countdown } from "@/components/countdown";

export const Route = createFileRoute("/dashboard/user")({
  head: () => ({
    meta: [
      { title: "Your feed — Reserva" },
      { name: "description", content: "Live discounted meals from restaurants near you, expiring soon." },
    ],
  }),
  component: UserDashboard,
});

const now = Date.now();
const offers = [
  { r: "Osteria Verde", city: "Downtown", item: "Family lasagna trays", old: 42, now: 12, tag: "Vegetarian", exp: now + 1000 * 60 * 105, rating: 4.9 },
  { r: "Sakura Ramen House", city: "Midtown", item: "Tonkotsu bowls (x4)", old: 56, now: 18, tag: "Hot meal", exp: now + 1000 * 60 * 42, rating: 4.8 },
  { r: "Blue Fig Bistro", city: "Riverside", item: "Artisan bakery bundle", old: 28, now: 7, tag: "Bakery", exp: now + 1000 * 60 * 200, rating: 4.7 },
  { r: "Casa Lupita", city: "Old Town", item: "Taco party pack", old: 34, now: 11, tag: "Mexican", exp: now + 1000 * 60 * 75, rating: 4.6 },
  { r: "Maison Doré", city: "Uptown", item: "Pastry surprise box", old: 24, now: 6, tag: "Sweet", exp: now + 1000 * 60 * 30, rating: 4.9 },
  { r: "The Copper Pan", city: "Harbor", item: "Chef's seasonal stew", old: 38, now: 14, tag: "Comfort", exp: now + 1000 * 60 * 150, rating: 4.5 },
];

function UserDashboard() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-16">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Your feed</p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Tonight, near you</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              6 flash offers within 2.4 km · updated 12s ago
            </p>
          </div>
          <Link
            to="/leaderboard"
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
          >
            View leaderboard
          </Link>
        </div>

        {/* Search bar */}
        <div className="glass mt-8 flex flex-wrap items-center gap-3 rounded-full p-2">
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search restaurants, cuisines, items…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs hover:bg-white/10">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            <MapPin className="h-3.5 w-3.5" /> 2.4 km
          </button>
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o, i) => {
            const pct = Math.round(((o.old - o.now) / o.old) * 100);
            return (
              <motion.div
                key={o.r + o.item}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{o.tag}</div>
                    <h3 className="mt-1 font-display text-xl leading-tight">{o.item}</h3>
                  </div>
                  <button
                    aria-label="Save"
                    className="rounded-full bg-white/5 p-2 text-muted-foreground transition hover:bg-white/10 hover:text-accent"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{o.r}</span>
                  <span>·</span>
                  <span>{o.city}</span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl text-gradient-emerald">${o.now}</span>
                      <span className="text-sm text-muted-foreground line-through">${o.old}</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <Flame className="h-3 w-3" /> {pct}% off
                    </div>
                  </div>
                  <Countdown target={o.exp} />
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    {o.rating} · Read reviews
                  </div>
                  <button className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110">
                    Reserve
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
