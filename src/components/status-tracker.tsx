import { motion } from "framer-motion";
import { Check, Package, HandHeart, Truck, Sparkles } from "lucide-react";

const STEPS = [
  { key: "active", label: "Posted", icon: Package },
  { key: "claimed", label: "Accepted", icon: HandHeart },
  { key: "out_for_delivery", label: "Out for pickup", icon: Truck },
  { key: "collected", label: "Received", icon: Sparkles },
] as const;

export type DonationStatus = (typeof STEPS)[number]["key"] | "expired";

export function StatusTracker({ status }: { status: DonationStatus }) {
  const activeIndex = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="relative flex items-center justify-between gap-1">
      <div className="absolute left-4 right-4 top-4 h-0.5 rounded-full bg-white/10" />
      <motion.div
        initial={false}
        animate={{ width: `${(Math.max(activeIndex, 0) / (STEPS.length - 1)) * 100}%` }}
        transition={{ type: "spring", damping: 24, stiffness: 200 }}
        className="absolute left-4 top-4 h-0.5 rounded-full bg-gradient-to-r from-primary via-primary to-accent"
        style={{ maxWidth: "calc(100% - 32px)" }}
      />
      {STEPS.map((step, i) => {
        const done = i <= activeIndex;
        const current = i === activeIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
            <motion.div
              animate={current ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={current ? { repeat: Infinity, duration: 1.6 } : {}}
              className={`grid h-8 w-8 place-items-center rounded-full border-2 transition-colors ${
                done
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                  : "border-white/15 bg-background/80 text-muted-foreground"
              }`}
            >
              {done && i < activeIndex ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </motion.div>
            <span className={`text-[10px] font-medium tracking-wide ${done ? "text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function nextStatus(current: DonationStatus): DonationStatus | null {
  const idx = STEPS.findIndex((s) => s.key === current);
  if (idx < 0 || idx >= STEPS.length - 1) return null;
  return STEPS[idx + 1].key;
}

export function statusLabel(s: DonationStatus) {
  return STEPS.find((x) => x.key === s)?.label ?? s;
}
