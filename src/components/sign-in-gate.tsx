import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { AppRole } from "@/hooks/use-auth";

export function SignInGate({ needRole, hasRole }: { needRole?: AppRole; hasRole?: AppRole | null }) {
  const mismatch = needRole && hasRole && hasRole !== needRole;
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
          <Lock className="h-5 w-5" />
        </div>
        <h2 className="mt-4 font-display text-2xl">
          {mismatch ? `This dashboard is for ${needRole}s` : "Sign in to continue"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {mismatch
            ? `Your account is registered as ${hasRole}. Create a new account with the ${needRole} role to access this area.`
            : `You need a PlateFull account${needRole ? ` (${needRole})` : ""} to see this page.`}
        </p>
        <Link to="/auth" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110">
          Go to sign in
        </Link>
      </motion.div>
    </div>
  );
}
