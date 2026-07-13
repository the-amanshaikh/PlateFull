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
} from "lucide-react";
import { useRef } from "react";
import { SiteNav } from "@/components/site-nav";
import { ClientOnly } from "@/components/client-only";
import { Hero3D } from "@/components/hero-3d";

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


function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteNav />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden px-4 pt-32 pb-24 md:px-6 md:pt-40 md:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-24 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-accent/15 blur-3xl" />
        </div>

        {/* 3D floating scene behind headline */}
        <div className="pointer-events-none absolute inset-x-0 top-16 -z-0 mx-auto h-[420px] max-w-3xl opacity-70 md:opacity-90">
          <ClientOnly>
            <Hero3D />
          </ClientOnly>
        </div>

        <motion.div style={{ y, scale }} className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>Now live in 42 cities</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 text-center font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-8xl"
          >
            Rescuing food,
            <br />
            <span className="text-gradient-emerald italic">feeding the future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground md:text-lg"
          >
            PlateFull is a real-time network that connects restaurants with surplus food to NGOs and neighbors who need it — before it becomes waste.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <MagneticLink to="/dashboard/user" primary>
              Find meals near you <ArrowRight className="h-4 w-4" />
            </MagneticLink>
            <MagneticLink to="/leaderboard">See the leaderboard</MagneticLink>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-strong mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 rounded-3xl p-6 md:mt-20 md:grid-cols-4 md:p-8"
          >
            {stats.map((s) => (
              <div key={s.v} className="text-center">
                <div className="font-display text-3xl text-gradient-emerald md:text-4xl">{s.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* THREE ROLES */}
      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-accent">Three ways to join</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl">Choose your role in the rescue</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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
                  className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl transition-all duration-500 hover:border-white/20"
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
                  <div className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">{r.tag}</div>
                  <h3 className="mt-2 font-display text-2xl">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
                    <span className={r.accent === "gold" ? "text-accent" : "text-primary"}>Get started</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-20 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
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
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-transform duration-200 ${
        primary
          ? "bg-primary text-primary-foreground shadow-[0_20px_60px_-15px] shadow-primary/60 hover:brightness-110"
          : "border border-white/15 bg-white/5 backdrop-blur hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}
