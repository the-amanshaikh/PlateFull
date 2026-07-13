import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bell, Building2, Star, CheckCircle2, Package, Users, HeartHandshake, Gift, Zap, MapPin, Truck, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Countdown } from "@/components/countdown";
import { SignInGate } from "@/components/sign-in-gate";
import { ClientOnly } from "@/components/client-only";
import { StatusTracker, nextStatus, statusLabel, type DonationStatus } from "@/components/status-tracker";
import { ReviewsPanel, ReviewsButton } from "@/components/reviews-panel";
import { DonationMap, type MapPin as PinT } from "@/components/donation-map";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/ngo")({
  head: () => ({
    meta: [
      { title: "NGO dashboard — PlateFull" },
      { name: "description", content: "Live map, real-time donations, pickup tracking, and restaurant reviews." },
    ],
  }),
  component: NGODashboard,
});

type NGO = { id: string; name: string; city: string; meals_distributed: number };
type Donation = {
  id: string; title: string; kind: "donation" | "flash_sale"; meals: number;
  expires_at: string; status: DonationStatus; restaurant_id: string;
  image_url: string | null; address: string | null;
  lat: number | null; lng: number | null;
  claimed_by_ngo_id: string | null;
};
type Restaurant = { id: string; name: string; city: string };

function NGODashboard() {
  const { user, role, loading } = useAuth();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [restaurants, setRestaurants] = useState<Record<string, Restaurant>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [openBell, setOpenBell] = useState(false);

  useEffect(() => {
    if (!user || role !== "ngo") return;
    supabase.from("ngos").select("*").eq("owner_id", user.id).maybeSingle().then(({ data }) => setNgo(data as NGO | null));
  }, [user, role]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(80);
      const list = (data ?? []) as Donation[];
      setDonations(list);
      const ids = Array.from(new Set(list.map(d => d.restaurant_id)));
      if (ids.length) {
        const { data: rs } = await supabase.from("restaurants").select("id,name,city").in("id", ids);
        const map: Record<string, Restaurant> = {};
        (rs ?? []).forEach((r) => { map[r.id] = r as Restaurant; });
        setRestaurants(map);
      }
    };
    load();
    const ch = supabase.channel("ngo-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => {
    if (!ngo) return;
    supabase.from("ratings").select("restaurant_id,stars").eq("ngo_id", ngo.id).then(({ data }) => {
      const map: Record<string, number> = {};
      (data ?? []).forEach((r) => { map[r.restaurant_id as string] = r.stars as number; });
      setRatings(map);
    });
  }, [ngo]);

  if (loading) return <div className="pt-40 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!user) return (<><SiteNav /><SignInGate needRole="ngo" /></>);
  if (role !== "ngo") return (<><SiteNav /><SignInGate needRole="ngo" hasRole={role} /></>);

  if (!ngo) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-lg px-6 pt-40"><CreateNgoForm userId={user.id} onCreated={setNgo} /></div>
      </div>
    );
  }

  const activeAlerts = donations.filter(d => d.status === "active");
  const myClaims = donations.filter(d => d.claimed_by_ngo_id === ngo.id && d.status !== "collected" && d.status !== "expired");
  const partners = Object.values(restaurants);
  const mapPins: PinT[] = donations
    .filter((d) => d.status === "active" && d.lat != null && d.lng != null)
    .map((d) => ({
      id: d.id,
      lat: d.lat as number,
      lng: d.lng as number,
      title: `${restaurants[d.restaurant_id]?.name ?? ""} · ${d.title}`,
      subtitle: `${d.meals} meals · ${d.address ?? ""}`,
      kind: d.kind,
      onClaim: () => claim(d.id),
    }));

  const rate = async (restaurantId: string, stars: number) => {
    const prev = ratings[restaurantId];
    setRatings((r) => ({ ...r, [restaurantId]: stars }));
    if (prev) {
      await supabase.from("ratings").update({ stars }).eq("ngo_id", ngo.id).eq("restaurant_id", restaurantId);
    } else {
      await supabase.from("ratings").insert({ ngo_id: ngo.id, restaurant_id: restaurantId, stars });
    }
  };

  async function claim(id: string) {
    await supabase.from("donations").update({ status: "claimed", claimed_by_ngo_id: ngo!.id }).eq("id", id);
  }

  async function advance(d: Donation) {
    const next = nextStatus(d.status);
    if (!next) return;
    await supabase.from("donations").update({ status: next }).eq("id", d.id);
  }

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 pt-28 pb-16 md:px-6 md:pt-32">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/30"><Building2 className="h-6 w-6" /></div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Verified NGO</p>
              <h1 className="mt-1 truncate font-display text-2xl md:text-4xl">{ngo.name}</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">{ngo.city || "—"}</p>
            </div>
          </div>
          <div className="relative shrink-0">
            <button onClick={() => setOpenBell(!openBell)} className="glass relative grid h-11 w-11 place-items-center rounded-full hover:bg-white/10">
              <Bell className="h-5 w-5" />
              {activeAlerts.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground glow-gold">
                  {activeAlerts.length}
                </span>
              )}
            </button>
            {openBell && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="glass-strong absolute right-0 top-14 z-20 w-80 rounded-2xl p-3">
                <div className="px-2 pb-2 text-xs uppercase tracking-widest text-muted-foreground">New offers</div>
                {activeAlerts.slice(0, 5).map((a) => (
                  <div key={a.id} className="rounded-xl p-3 hover:bg-white/5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{restaurants[a.restaurant_id]?.name ?? "…"}</div>
                      <Countdown target={new Date(a.expires_at).getTime()} tone="gold" />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.title} · {a.meals} meals</div>
                  </div>
                ))}
                {activeAlerts.length === 0 && <div className="p-3 text-xs text-muted-foreground">No active offers right now.</div>}
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Package, label: "Meals distributed", value: ngo.meals_distributed.toLocaleString() },
            { icon: Users, label: "Active offers", value: activeAlerts.length },
            { icon: CheckCircle2, label: "In progress", value: myClaims.length },
            { icon: HeartHandshake, label: "Partners", value: partners.length },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <s.icon className="h-4 w-4 text-primary" />
              <div className="mt-3 font-display text-3xl text-gradient-emerald">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Live map */}
        <div className="glass mt-8 rounded-3xl p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-xl">Nearby surplus map</h3>
              <p className="text-xs text-muted-foreground">Pins update in realtime as restaurants post surplus.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs text-primary"><MapPin className="h-3 w-3" /> {mapPins.length} pinned</span>
          </div>
          <ClientOnly fallback={<div className="grid h-[380px] place-items-center rounded-3xl border border-white/10 text-sm text-muted-foreground">Loading map…</div>}>
            <DonationMap pins={mapPins} />
          </ClientOnly>
          {mapPins.length === 0 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">Restaurants can add a pickup pin when they post — those will appear here.</p>
          )}
        </div>

        {/* My active pickups with tracker */}
        {myClaims.length > 0 && (
          <div className="glass mt-8 rounded-3xl p-6">
            <h3 className="font-display text-xl">Your pickups</h3>
            <p className="text-xs text-muted-foreground">Track pickup progress in realtime.</p>
            <div className="mt-4 space-y-4">
              {myClaims.map((d) => (
                <div key={d.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-black/30">
                      {d.image_url ? <img src={d.image_url} alt={d.title} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-primary"><Gift className="h-5 w-5" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{restaurants[d.restaurant_id]?.name ?? "…"} · {d.title}</div>
                      <div className="text-xs text-muted-foreground">{d.meals} meals{d.address ? ` · ${d.address}` : ""}</div>
                    </div>
                    <button
                      onClick={() => advance(d)}
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110"
                    >
                      {d.status === "claimed" ? (<><Truck className="mr-1 inline h-3 w-3" /> Out for pickup</>) : (<><Sparkles className="mr-1 inline h-3 w-3" /> Mark received</>)}
                    </button>
                  </div>
                  <div className="mt-4"><StatusTracker status={d.status} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Live donations</h3>
              <span className="text-xs text-muted-foreground">Realtime</span>
            </div>
            <div className="mt-4 space-y-2">
              {donations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
                  No donations posted yet. When a restaurant posts, it appears here instantly.
                </div>
              )}
              {donations.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 md:flex md:flex-wrap"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/30">
                    {a.image_url ? (
                      <img src={a.image_url} alt={a.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`grid h-full w-full place-items-center ${a.kind === "donation" ? "text-primary" : "text-accent"}`}>
                        {a.kind === "donation" ? <Gift className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{restaurants[a.restaurant_id]?.name ?? "…"} · {a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.meals} meals · {statusLabel(a.status)}</div>
                  </div>
                  <div className="col-span-3 flex items-center justify-between gap-3 md:col-span-1">
                    <Countdown target={new Date(a.expires_at).getTime()} tone={a.kind === "donation" ? "emerald" : "gold"} />
                    <button
                      disabled={a.status !== "active"}
                      onClick={() => claim(a.id)}
                      className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-40"
                    >
                      {a.status === "active" ? "Claim" : statusLabel(a.status)}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl">Rate & review partners</h3>
            <p className="mt-1 text-xs text-muted-foreground">Your feedback boosts their reputation.</p>
            <div className="mt-4 space-y-4">
              {partners.length === 0 && <p className="text-xs text-muted-foreground">No partners yet.</p>}
              {partners.map((p) => {
                const current = ratings[p.id] ?? 0;
                return (
                  <div key={p.id} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.city || "—"}</div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button key={i} onClick={() => rate(p.id, i + 1)} className="transition hover:scale-110" aria-label={`Rate ${i + 1}`}>
                            <Star className={`h-5 w-5 ${i < current ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                          </button>
                        ))}
                      </div>
                      <ReviewsButton targetType="restaurant" targetId={p.id} targetName={p.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews for this NGO */}
        <div className="glass mt-8 rounded-3xl p-6">
          <ReviewsPanel targetType="ngo" targetId={ngo.id} targetName={ngo.name} />
        </div>
      </section>
    </div>
  );
}

function CreateNgoForm({ userId, onCreated }: { userId: string; onCreated: (n: NGO) => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      onSubmit={async (e) => {
        e.preventDefault(); setBusy(true); setErr(null);
        const { data, error } = await supabase.from("ngos").insert({ owner_id: userId, name, city }).select("*").maybeSingle();
        setBusy(false);
        if (error) { setErr(error.message); return; }
        if (data) onCreated(data as NGO);
      }}
      className="glass-strong rounded-3xl p-8"
    >
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30"><HeartHandshake className="h-5 w-5" /></div>
      <h1 className="font-display text-3xl">Set up your NGO</h1>
      <p className="mt-1 text-sm text-muted-foreground">Just two fields to get you claiming.</p>
      <div className="mt-6 space-y-3">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Organization name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50" />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {busy ? "…" : "Create NGO"}
        </button>
      </div>
    </motion.form>
  );
}
