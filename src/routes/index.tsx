import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Users,
  Store,
  HeartHandshake,
  Sparkles,
  Leaf,
  TrendingUp,
  ShieldCheck,
  UtensilsCrossed,
  Soup,
  Apple,
  Pizza,
  Salad,
  Sandwich,
  Croissant,
  Cookie,
  Carrot,
  HandHeart,
} from "lucide-react";
import { useRef } from "react";
import { SiteNav } from "@/components/site-nav";
import { ClientOnly } from "@/components/client-only";
import { Hero3D } from "@/components/hero-3d";
import { FloatingFood } from "@/components/floating-food";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlateFull — Rescuing Food, Feeding the Future" },
      { name: "description", content: "A premium platform uniting restaurants, NGOs, and everyday people to end food waste through real-time donations and flash discounts." },
      { property: "og:title", content: "PlateFull — Rescuing Food, Feeding the Future" },
      { property: "og:description", content: "A premium platform uniting restaurants, NGOs, and everyday people to end food waste." },
    ],
  }),
  component: Home,
});

const roles = [
  { to: "/dashboard/user", icon: Users, tag: "For everyone", title: "Get started as a User", body: "Discover heavily discounted meals from restaurants near you before they close.", accent: "emerald" as const },
  { to: "/dashboard/restaurant", icon: Store, tag: "For restaurants", title: "Get started as a Restaurant", body: "Turn surplus into impact. Push flash discounts or donate to verified NGOs.", accent: "gold" as const },
  { to: "/dashboard/ngo", icon: HeartHandshake, tag: "For NGOs", title: "Get started as an NGO", body: "Get real-time alerts when partners have food to give. Claim, collect, rate.", accent: "emerald" as const },
];

const marqueeItems = [
  { Icon: Pizza, label: "Warm meals" },
  { Icon: HandHeart, label: "Given, not wasted" },
  { Icon: Soup, label: "Hot soup drops" },
  { Icon: Apple, label: "Fresh produce" },
  { Icon: HeartHandshake, label: "NGO pickups" },
  { Icon: Croissant, label: "Bakery surplus" },
  { Icon: Salad, label: "Farm-fresh greens" },
  { Icon: Sandwich, label: "Cafe leftovers" },
  { Icon: Cookie, label: "Sweet rescues" },
  { Icon: Carrot, label: "Zero waste" },
  { Icon: UtensilsCrossed, label: "Restaurant partners" },
  { Icon: Leaf, label: "Planet positive" },
];


function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteNav />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden px-4 pt-28 pb-16 sm:pt-32 md:px-6 md:pt-40 md:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-24 h-[420px] w-[720px] max-w-[95vw] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl md:h-[520px] md:w-[820px]" />
          <div className="absolute right-0 top-0 h-[280px] w-[280px] rounded-full bg-accent/15 blur-3xl md:h-[380px] md:w-[380px]" />
        </div>

        <FloatingFood />

        {/* 3D floating scene behind headline — hidden on small phones to keep UI clean */}
        <div className="pointer-events-none absolute inset-x-0 top-16 -z-0 mx-auto hidden h-[420px] max-w-3xl opacity-70 md:block md:opacity-90">
          <ClientOnly>
            <Hero3D />
          </ClientOnly>
        </div>

        <motion.div style={{ y, scale }} className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur-md sm:px-4 sm:text-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Real-time surplus rescue network</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-center font-display text-[2.5rem] leading-[1] tracking-tight sm:text-6xl md:mt-8 md:text-8xl"
          >
            Rescuing food,
            <br />
            <span className="text-gradient-emerald italic">feeding the future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl px-2 text-center text-[15px] text-muted-foreground sm:text-base md:mt-6 md:text-lg"
          >
            PlateFull is a real-time network that connects restaurants with surplus food to NGOs and neighbors who need it — before it becomes waste.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col items-stretch justify-center gap-3 px-4 sm:flex-row sm:items-center sm:px-0 md:mt-10"
          >
            <MagneticLink to="/dashboard/user" primary>
              Find meals near you <ArrowRight className="h-4 w-4" />
            </MagneticLink>
            <MagneticLink to="/leaderboard">See the leaderboard</MagneticLink>
          </motion.div>

          {/* Mobile-only floating chips row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 grid grid-cols-3 gap-2 px-2 sm:hidden"
          >
            {[
              { Icon: Pizza, label: "Meals" },
              { Icon: HandHeart, label: "Donate" },
              { Icon: Leaf, label: "Rescue" },
            ].map(({ Icon, label }) => (
              <div key={label} className="glass flex flex-col items-center gap-1 rounded-2xl px-2 py-3">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE — food & impact vocabulary */}
      <section className="relative overflow-hidden border-y border-white/5 bg-white/[0.02] py-4 sm:py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...marqueeItems, ...marqueeItems].map((m, i) => (
            <div key={i} className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
              <m.Icon className="h-4 w-4 text-primary" />
              <span className="font-display text-lg italic">{m.label}</span>
              <span className="text-accent">•</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* THREE ROLES */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center md:mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-accent sm:text-sm">Three ways to join</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">Choose your role in the rescue</h2>
          </div>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {roles.map((r, i) => (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
                style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
              >
                <Link
                  to={r.to}
                  className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 md:p-8"
                >
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                      r.accent === "gold" ? "bg-accent/25" : "bg-primary/25"
                    } opacity-40`}
                  />
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-2xl ${
                      r.accent === "gold"
                        ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                        : "bg-primary/15 text-primary ring-1 ring-primary/30"
                    }`}
                  >
                    <r.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground md:mt-8">{r.tag}</div>
                  <h3 className="mt-2 font-display text-2xl">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium md:mt-8">
                    <span className={r.accent === "gold" ? "text-accent" : "text-primary"}>Get started</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE JOURNEY OF A PLATE */}
      <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center md:mb-14">
            <p className="text-xs uppercase tracking-[0.2em] text-primary sm:text-sm">The journey of a plate</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              From <span className="text-gradient-gold italic">surplus</span> to <span className="text-gradient-emerald italic">smile</span>
            </h2>
          </div>
          <div className="relative grid gap-4 md:grid-cols-4">
            {[
              { Icon: UtensilsCrossed, title: "Cooked", body: "Restaurant closes with warm surplus meals ready to go.", tone: "gold" },
              { Icon: Sparkles, title: "Posted", body: "One tap posts it live — donation or flash sale.", tone: "emerald" },
              { Icon: HandHeart, title: "Claimed", body: "NGOs and neighbors claim before the countdown ends.", tone: "gold" },
              { Icon: HeartHandshake, title: "Feeds someone", body: "Delivered, received, rated. A plate becomes impact.", tone: "emerald" },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass relative overflow-hidden rounded-2xl p-5"
              >
                <div className="absolute right-3 top-3 font-display text-3xl italic text-white/10">0{i + 1}</div>
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl ${
                    s.tone === "gold"
                      ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                      : "bg-primary/15 text-primary ring-1 ring-primary/30"
                  }`}
                >
                  <s.Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 font-display text-xl">{s.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {[
              { icon: Leaf, title: "Post surplus in seconds", body: "Restaurants tap Donate or Flash Sale and the network sees it instantly." },
              { icon: TrendingUp, title: "Claim in real-time", body: "NGOs get bell alerts. Users see live countdowns on nearby deals." },
              { icon: ShieldCheck, title: "Rate & rise", body: "Every pickup builds a restaurant's reputation and unlocks leaderboard rank." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <f.icon className="h-6 w-6 text-primary" />
                <h4 className="mt-4 text-lg font-semibold">{f.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE CTA */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8 text-center md:p-14">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
            <HandHeart className="mx-auto h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              Every plate deserves a <span className="text-gradient-emerald italic">second chance</span>
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Join thousands turning tonight's leftovers into tomorrow's dignity.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <MagneticLink to="/auth" primary>
                Join PlateFull <ArrowRight className="h-4 w-4" />
              </MagneticLink>
              <MagneticLink to="/dashboard/ngo">I'm an NGO</MagneticLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PlateFull. Rescuing food, feeding the future.
      </footer>
    </div>
  );
}

function MagneticLink({ to, primary, children }: { to: string; primary?: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <Link
      to={to}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform duration-200 ${
        primary
          ? "bg-primary text-primary-foreground shadow-[0_20px_60px_-15px] shadow-primary/60 hover:brightness-110"
          : "border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}
