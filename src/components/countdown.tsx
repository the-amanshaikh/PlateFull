import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function Countdown({ target, tone = "gold" }: { target: number; tone?: "gold" | "emerald" }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const isGold = tone === "gold";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium tabular-nums ${
        isGold
          ? "bg-accent/15 text-accent ring-1 ring-accent/30"
          : "bg-primary/15 text-primary ring-1 ring-primary/30"
      }`}
    >
      <Clock className="h-3.5 w-3.5" />
      <span>
        {h > 0 && `${h}h `}
        {pad(m)}m {pad(s)}s
      </span>
    </div>
  );
}
