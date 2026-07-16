import { motion } from "framer-motion";
import { Apple, Cookie, Pizza, Sandwich, Soup, Carrot, Utensils, Coffee, Wheat, Cherry } from "lucide-react";

const items = [
  { Icon: Pizza, x: "6%", y: "12%", size: 28, delay: 0, tone: "text-accent" },
  { Icon: Apple, x: "88%", y: "18%", size: 24, delay: 0.4, tone: "text-primary" },
  { Icon: Sandwich, x: "12%", y: "72%", size: 26, delay: 0.8, tone: "text-accent" },
  { Icon: Soup, x: "84%", y: "68%", size: 30, delay: 1.2, tone: "text-primary" },
  { Icon: Carrot, x: "50%", y: "8%", size: 22, delay: 0.2, tone: "text-accent" },
  { Icon: Cookie, x: "78%", y: "42%", size: 22, delay: 1.6, tone: "text-primary" },
  { Icon: Coffee, x: "18%", y: "42%", size: 22, delay: 0.6, tone: "text-accent" },
  { Icon: Wheat, x: "44%", y: "82%", size: 26, delay: 1.0, tone: "text-primary" },
  { Icon: Cherry, x: "68%", y: "88%", size: 20, delay: 1.4, tone: "text-accent" },
  { Icon: Utensils, x: "30%", y: "22%", size: 20, delay: 0.9, tone: "text-primary" },
];

export function FloatingFood() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {items.map(({ Icon, x, y, size, delay, tone }, i) => (
        <motion.div
          key={i}
          className={`absolute ${tone} opacity-30 md:opacity-40`}
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.4, 0.4, 0.2, 0.4],
            y: [0, -18, 0, -10, 0],
            rotate: [0, 8, -6, 4, 0],
            scale: [0.9, 1.05, 1, 1.05, 0.95],
          }}
          transition={{ duration: 8 + (i % 3), delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.6} />
        </motion.div>
      ))}
    </div>
  );
}
