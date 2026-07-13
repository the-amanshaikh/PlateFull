import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, Star, Flame, Heart, Search } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Countdown } from "@/components/countdown";
import { supabase } from "@/integrations/supabase/client";
import { ReviewsButton } from "@/components/reviews-panel";

export const Route = createFileRoute("/dashboard/user")({
  head: () => ({
    meta: [
      { title: "Your feed — PlateFull" },
      { name: "description", content: "Live discounted meals from restaurants near you, expiring soon." },
    ],
  }),
  component: UserDashboard,
});

type Offer = {
  id: string; title: string; kind: "donation" | "flash_sale"; meals: number;
  price_cents: number | null; original_price_cents: number | null; expires_at: string; status: string;
  restaurant_id: string; image_url: string | null; address: string | null;
};
type Restaurant = { id: string; name: string; city: string; rating_sum: number; rating_count: number };

function UserDashboard() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({});
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("donations").select("*").eq("status", "active").order("expires_at", { ascending: true });
      const list = (data ?? []) as Offer[];
      setOffers(list);
      const ids = Array.from(new Set(list.map(d => d.restaurant_id)));
      if (ids.length) {
        const { data: rs } = await supabase.from("restaurants").select("id,name,city,rating_sum,rating_count").in("id", ids);
        const map: Record<string, Restaurant> = {};
        (rs ?? []).forEach((r) => { map[r.id] = r as Restaurant; });
        setRestaurants(map);
      }
    };
    load();
    const ch = supabase.channel("user-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = offers.filter((o) => {
    if (!q) return true;
    const r = restaurants[o.restaurant_id];
    return o.title.toLowerCase().includes(q.toLowerCase()) || (r?.name.toLowerCase().includes(q.toLowerCase()) ?? false);
  });

  const toggleSave = (id: string) => {
    setSaved((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 pt-28 pb-16 md:px-6 md:pt-32">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Your feed</p>
            <h1 className="mt-2 font-display text-3xl md:text-5xl">Tonight, near you</h1>
            <p className="mt-2 text-sm text-muted-foreground">{filtered.length} live offers · updated in realtime</p>
          </div>
          <Link to="/leaderboard" className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">Leaderboard</Link>
        </div>

        <div className="glass mt-8 flex items-center gap-3 rounded-full p-2">
          <div className="flex flex-1 items-center gap-2 px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search restaurants or items…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="glass col-span-full rounded-3xl p-10 text-center text-sm text-muted-foreground">
              No active offers yet. Check back soon — new drops post in realtime.
            </div>
          )}
          {filtered.map((o, i) => {
            const r = restaurants[o.restaurant_id];
            const price = (o.price_cents ?? 0) / 100;
            const original = (o.original_price_cents ?? 0) / 100;
            const pct = original > 0 ? Math.round(((original - price) / original) * 100) : null;
            const rating = r && r.rating_count > 0 ? (r.rating_sum / r.rating_count).toFixed(1) : null;
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.5 }}
                whileHover={{ y: -6, rotateX: 3, rotateY: -3 }}
                style={{ transformPerspective: 1000 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{o.kind === "donation" ? "Donation" : "Flash sale"}</div>
                    <h3 className="mt-1 font-display text-xl leading-tight">{o.title}</h3>
                  </div>
                  <button
                    onClick={() => toggleSave(o.id)}
                    aria-label="Save"
                    className={`rounded-full p-2 transition ${saved.has(o.id) ? "bg-accent/20 text-accent" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-accent"}`}
                  >
                    <Heart className={`h-4 w-4 ${saved.has(o.id) ? "fill-accent" : ""}`} />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{r?.name ?? "…"}</span>
                  {r?.city && <><span>·</span><span>{r.city}</span></>}
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    {o.kind === "flash_sale" && price > 0 ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-3xl text-gradient-emerald">${price.toFixed(0)}</span>
                          {original > 0 && <span className="text-sm text-muted-foreground line-through">${original.toFixed(0)}</span>}
                        </div>
                        {pct !== null && (
                          <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
                            <Flame className="h-3 w-3" /> {pct}% off
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="font-display text-3xl text-gradient-emerald">Free</div>
                    )}
                    <div className="mt-1 text-xs text-muted-foreground">{o.meals} meals</div>
                  </div>
                  <Countdown target={new Date(o.expires_at).getTime()} />
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {rating ? <><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {rating}</> : <><MapPin className="h-3 w-3" /> Nearby</>}
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
