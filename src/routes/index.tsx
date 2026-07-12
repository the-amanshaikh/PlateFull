import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reserva — Rescuing Food, Feeding the Future" },
      { name: "description", content: "A premium platform uniting restaurants, NGOs, and everyday people to end food waste through real-time donations and flash discounts." },
      { property: "og:title", content: "Reserva — Rescuing Food, Feeding the Future" },
      { property: "og:description", content: "A premium platform uniting restaurants, NGOs, and everyday people to end food waste." },
    ],
  }),
  component: Home,
});

const roles = [
  {
    to: "/dashboard/user",
    icon: Users,
    tag: "For everyone",
    title: "Get Started as a User",
    body: "Discover heavily discounted meals from restaurants near you before they close. Save money. Save meals.",
    accent: "emerald" as const,
  },
  {
    to: "/dashboard/restaurant",
    icon: Store,
    tag: "For restaurants",
    title: "Get Started as a Restaurant",
    body: "Turn surplus into impact. Push flash discounts or donate to verified NGOs — with a reputation score that grows.",
    accent: "gold" as const,
  },
  {
    to: "/dashboard/ngo",
    icon: HeartHandshake,
    tag: "For NGOs",
    title: "Get Started as an NGO",
    body: "Get real-time alerts when partners have food to give. Claim, collect, and rate — all in one place.",
    accent: "emerald" as const,
  },
];

const stats = [
  { k: "2.4M", v: "meals rescued" },
  { k: "1,280", v: "restaurant partners" },
  { k: "340+", v: "NGOs onboarded" },
  { k: "94%", v: "claim rate" },
];

function Home() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-24 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-accent/15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl">
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
            className="mt-8 text-center font-display text-6xl leading-[0.95] tracking-tight md:text-8xl"
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
            Reserva is a real-time network that connects restaurants with surplus food to NGOs and
            neighbors who need it — before it becomes waste.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/dashboard/user"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_20px_60px_-15px] shadow-primary/60 transition hover:brightness-110"
            >
              Find meals near you
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/10"
            >
              See the leaderboard
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-strong mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.v} className="text-center">
                <div className="font-display text-4xl text-gradient-emerald">{s.k}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* THREE ROLES */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-accent">Three ways to join</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Choose your role in the rescue</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {roles.map((r, i) => (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  to={r.to}
                  className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-white/20"
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
                  <div className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">
                    {r.tag}
                  </div>
                  <h3 className="mt-2 font-display text-2xl">{r.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  <div className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
                    <span
                      className={r.accent === "gold" ? "text-accent" : "text-primary"}
                    >
                      Get started
                    </span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { icon: Leaf, title: "Post surplus in seconds", body: "Restaurants tap Donate or Flash Sale and the network sees it instantly." },
              { icon: TrendingUp, title: "Claim in real-time", body: "NGOs get bell alerts. Users see live countdowns on nearby deals." },
              { icon: ShieldCheck, title: "Rate & rise", body: "Every pickup builds a restaurant's reputation score and unlocks leaderboard rank." },
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
        © {new Date().getFullYear()} Reserva. Rescuing food, feeding the future.
      </footer>
    </div>
  );
}
