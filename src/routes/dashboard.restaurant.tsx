import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Gift, Zap, Star, Package, DollarSign, Sparkles, Plus, X, Trash2, Store, MapPin, Camera, Loader2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Countdown } from "@/components/countdown";
import { SignInGate } from "@/components/sign-in-gate";
import { StatusTracker, statusLabel, type DonationStatus } from "@/components/status-tracker";
import { ReviewsPanel, ReviewsButton } from "@/components/reviews-panel";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/restaurant")({
  head: () => ({
    meta: [
      { title: "Restaurant dashboard — PlateFull" },
      { name: "description", content: "Donate surplus, run flash discount sales, and grow your reputation." },
    ],
  }),
  component: RestaurantDashboard,
});

type Restaurant = { id: string; name: string; city: string; meals_rescued: number; rating_sum: number; rating_count: number };
type Donation = {
  id: string; title: string; kind: "donation" | "flash_sale"; meals: number;
  price_cents: number | null; original_price_cents: number | null;
  expires_at: string; status: DonationStatus; created_at: string;
  image_url: string | null; address: string | null;
};

function RestaurantDashboard() {
  const { user, role, loading } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showForm, setShowForm] = useState<"donation" | "flash_sale" | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user || role !== "restaurant") return;
    supabase.from("restaurants").select("*").eq("owner_id", user.id).maybeSingle().then(({ data }) => {
      setRestaurant(data as Restaurant | null);
    });
  }, [user, role]);

  useEffect(() => {
    if (!restaurant) return;
    const load = () => supabase.from("donations").select("*").eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false }).then(({ data }) => setDonations((data ?? []) as Donation[]));
    load();
    const ch = supabase.channel("rest-don-" + restaurant.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "donations", filter: `restaurant_id=eq.${restaurant.id}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [restaurant]);

  if (loading) return <div className="pt-40 text-center text-sm text-muted-foreground">Loading…</div>;
  if (!user) return (<><SiteNav /><SignInGate needRole="restaurant" /></>);
  if (role !== "restaurant") return (<><SiteNav /><SignInGate needRole="restaurant" hasRole={role} /></>);

  if (!restaurant) {
    return (
      <div className="min-h-screen">
        <SiteNav />
        <div className="mx-auto max-w-lg px-6 pt-40">
          <CreateRestaurantForm onCreated={setRestaurant} userId={user.id} />
        </div>
      </div>
    );
  }

  const rating = restaurant.rating_count > 0 ? (restaurant.rating_sum / restaurant.rating_count).toFixed(1) : "—";

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-4 pt-28 pb-16 md:px-6 md:pt-32">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Restaurant</p>
            <h1 className="mt-2 truncate font-display text-3xl md:text-5xl">{restaurant.name}</h1>
            <p className="mt-1 text-xs text-muted-foreground">{restaurant.city || "—"}</p>
          </div>
          <div className="glass shrink-0 rounded-full px-4 py-2 text-xs text-muted-foreground">
            Reputation · <span className="text-gradient-gold text-sm font-semibold">{rating}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => setShowForm("donation")}
            className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-8 text-left glow-emerald"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><Gift className="h-6 w-6" /></div>
            <h2 className="mt-6 font-display text-2xl">Donate Surplus Food</h2>
            <p className="mt-2 text-sm text-muted-foreground">Push an offer to verified NGOs near you. Instant alert.</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary"><Plus className="h-4 w-4" /> New donation</div>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => setShowForm("flash_sale")}
            className="group relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/25 via-accent/10 to-transparent p-8 text-left glow-gold"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><Zap className="h-6 w-6" /></div>
            <h2 className="mt-6 font-display text-2xl">Create Flash Discount Sale</h2>
            <p className="mt-2 text-sm text-muted-foreground">Move volumes fast before the doors close.</p>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent"><Plus className="h-4 w-4" /> New flash sale</div>
          </motion.button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Star, label: "Reputation", value: rating, tone: "gold" as const },
            { icon: Package, label: "Meals rescued", value: restaurant.meals_rescued.toLocaleString(), tone: "emerald" as const },
            { icon: DollarSign, label: "Active offers", value: donations.filter(d => d.status === "active").length, tone: "emerald" as const },
            { icon: Sparkles, label: "Total offers", value: donations.length, tone: "gold" as const },
          ].map((m) => (
            <div key={m.label} className="glass rounded-2xl p-5">
              <m.icon className={`h-4 w-4 ${m.tone === "gold" ? "text-accent" : "text-primary"}`} />
              <div className={`mt-3 font-display text-3xl ${m.tone === "gold" ? "text-gradient-gold" : "text-gradient-emerald"}`}>{m.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Your offers</h3>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="mt-4 space-y-4">
              {donations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
                  No offers yet. Create your first donation or flash sale above.
                </div>
              )}
              {donations.map((a) => (
                <motion.div key={a.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
                  <div className="grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
                    <div className="h-24 w-full overflow-hidden rounded-xl bg-black/30 sm:h-24 sm:w-[120px]">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className={`grid h-full w-full place-items-center ${a.kind === "donation" ? "text-primary" : "text-accent"}`}>
                          {a.kind === "donation" ? <Gift className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.kind === "donation" ? `${a.meals} meals` : `$${((a.price_cents ?? 0) / 100).toFixed(0)} (was $${((a.original_price_cents ?? 0) / 100).toFixed(0)})`} · {statusLabel(a.status)}
                      </div>
                      {a.address && <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {a.address}</div>}
                    </div>
                    <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end">
                      <Countdown target={new Date(a.expires_at).getTime()} tone={a.kind === "donation" ? "emerald" : "gold"} />
                      <button
                        onClick={async () => { setBusy(true); await supabase.from("donations").delete().eq("id", a.id); setBusy(false); }}
                        disabled={busy}
                        className="rounded-full bg-white/5 p-2 text-muted-foreground hover:bg-white/10 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {a.status !== "active" && a.status !== "expired" && (
                    <div className="border-t border-white/5 px-4 pb-4 pt-3">
                      <StatusTracker status={a.status} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <ReviewsPanel targetType="restaurant" targetId={restaurant.id} targetName={restaurant.name} />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showForm && (
          <NewDonationModal
            kind={showForm}
            restaurantId={restaurant.id}
            userId={user.id}
            onClose={() => setShowForm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateRestaurantForm({ userId, onCreated }: { userId: string; onCreated: (r: Restaurant) => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true); setErr(null);
        const { data, error } = await supabase.from("restaurants").insert({ owner_id: userId, name, city }).select("*").maybeSingle();
        setBusy(false);
        if (error) { setErr(error.message); return; }
        if (data) onCreated(data as Restaurant);
      }}
      className="glass-strong rounded-3xl p-8"
    >
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30"><Store className="h-5 w-5" /></div>
      <h1 className="font-display text-3xl">Set up your restaurant</h1>
      <p className="mt-1 text-sm text-muted-foreground">Just two fields to get you posting.</p>
      <div className="mt-6 space-y-3">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Restaurant name" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50" />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
          {busy ? "…" : "Create restaurant"}
        </button>
      </div>
    </motion.form>
  );
}

function NewDonationModal({ kind, restaurantId, userId, onClose }: { kind: "donation" | "flash_sale"; restaurantId: string; userId: string; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [meals, setMeals] = useState(20);
  const [price, setPrice] = useState(10);
  const [original, setOriginal] = useState(30);
  const [minutes, setMinutes] = useState(90);
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [locBusy, setLocBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFile = (f: File | null) => {
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) { setErr("Geolocation not supported"); return; }
    setLocBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setLocBusy(false); },
      (e) => { setErr(e.message); setLocBusy(false); },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setErr(null);
          let image_url: string | null = null;
          if (file) {
            const ext = file.name.split(".").pop() || "jpg";
            const path = `${userId}/${crypto.randomUUID()}.${ext}`;
            const up = await supabase.storage.from("donation-images").upload(path, file, { contentType: file.type, upsert: false });
            if (up.error) { setErr(up.error.message); setBusy(false); return; }
            // Bucket is private (workspace blocks public buckets); use a long-lived signed URL
            const signed = await supabase.storage.from("donation-images").createSignedUrl(path, 60 * 60 * 24 * 365);
            if (signed.error) { setErr(signed.error.message); setBusy(false); return; }
            image_url = signed.data.signedUrl;
          }
          const expires_at = new Date(Date.now() + minutes * 60_000).toISOString();
          const payload = {
            restaurant_id: restaurantId,
            kind,
            title,
            meals,
            expires_at,
            price_cents: kind === "flash_sale" ? Math.round(price * 100) : null,
            original_price_cents: kind === "flash_sale" ? Math.round(original * 100) : null,
            image_url,
            address,
            lat,
            lng,
          };
          const { error } = await supabase.from("donations").insert(payload);
          setBusy(false);
          if (error) { setErr(error.message); return; }
          onClose();
        }}
        className="glass-strong w-full max-w-md rounded-3xl p-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{kind === "donation" ? "New donation" : "New flash sale"}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-4 space-y-3">
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. Sourdough loaves)" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50" />

          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground"><Camera className="h-3 w-3" /> Photo</span>
            <div className="flex items-center gap-3">
              <label className="grid h-20 w-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/5 hover:border-primary/40">
                {preview ? <img src={preview} alt="preview" className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
              </label>
              <p className="text-xs text-muted-foreground">Upload a photo so everyone can see the item.</p>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Meals"><input required type="number" min={1} value={meals} onChange={(e) => setMeals(+e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" /></Field>
            <Field label="Expires in (min)"><input required type="number" min={5} value={minutes} onChange={(e) => setMinutes(+e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" /></Field>
          </div>
          {kind === "flash_sale" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price ($)"><input required type="number" min={0} step="0.5" value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" /></Field>
              <Field label="Original ($)"><input required type="number" min={0} step="0.5" value={original} onChange={(e) => setOriginal(+e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" /></Field>
            </div>
          )}

          <Field label="Pickup address">
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city" className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary/50" />
          </Field>
          <button type="button" onClick={useMyLocation} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10">
            {locBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
            {lat && lng ? `Located · ${lat.toFixed(3)}, ${lng.toFixed(3)}` : "Use my location for map pin"}
          </button>

          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={busy} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-60">
            {busy ? "Posting…" : "Post offer"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

// Re-export to keep ReviewsButton import used if needed elsewhere.
export const _ReviewsButton = ReviewsButton;
