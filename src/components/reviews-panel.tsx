import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type ReviewTarget = "restaurant" | "ngo";

type Review = {
  id: string;
  author_id: string;
  author_name: string;
  author_role: string;
  stars: number;
  comment: string;
  created_at: string;
};

export function ReviewsPanel({
  targetType,
  targetId,
  targetName,
  compact = false,
}: {
  targetType: ReviewTarget;
  targetId: string;
  targetName?: string;
  compact?: boolean;
}) {
  const { user, role } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .order("created_at", { ascending: false })
      .limit(20);
    setReviews((data ?? []) as Review[]);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`reviews-${targetType}-${targetId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews", filter: `target_id=eq.${targetId}` },
        load,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType, targetId]);

  const submit = async () => {
    if (!user || !comment.trim()) return;
    setBusy(true);
    setErr(null);
    const authorName =
      (user.user_metadata?.display_name as string) || user.email?.split("@")[0] || "Anonymous";
    const { error } = await supabase.from("reviews").insert({
      author_id: user.id,
      author_name: authorName,
      author_role: role ?? "user",
      target_type: targetType,
      target_id: targetId,
      stars,
      comment: comment.trim(),
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setComment("");
    setStars(5);
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Reviews</div>
          {targetName && <div className="text-sm font-medium">{targetName}</div>}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-semibold">{avg ? avg.toFixed(1) : "—"}</span>
          <span className="text-xs text-muted-foreground">({reviews.length})</span>
        </div>
      </div>

      {user && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setStars(i + 1)} className="transition hover:scale-110">
                <Star className={`h-4 w-4 ${i < stars ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-end gap-2">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience…"
              rows={2}
              className="flex-1 resize-none rounded-xl border border-white/10 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <button
              type="button"
              onClick={submit}
              disabled={busy || !comment.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 disabled:opacity-40"
              aria-label="Post review"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
        </div>
      )}
      {!user && (
        <div className="rounded-2xl border border-dashed border-white/10 p-3 text-xs text-muted-foreground">
          Sign in to leave a review.
        </div>
      )}

      <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {reviews.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/5 bg-white/5 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{r.author_name || "Anonymous"}</div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < r.stars ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">{r.author_role}</div>
              {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
            </motion.div>
          ))}
        </AnimatePresence>
        {reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-xs text-muted-foreground">
            No reviews yet. Be the first.
          </div>
        )}
      </div>
    </div>
  );
}

export function ReviewsButton(props: {
  targetType: ReviewTarget;
  targetId: string;
  targetName?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground"
      >
        <MessageSquare className="h-3.5 w-3.5" /> {props.label ?? "Reviews"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 20, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              className="glass-strong w-full max-w-md rounded-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl">{props.targetName ?? "Reviews"}</h3>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/5">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4">
                <ReviewsPanel {...props} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
