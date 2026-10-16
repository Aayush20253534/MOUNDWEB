import type { Request, Response, NextFunction } from "express";

/** One-instance throttle; production with multiple replicas needs a shared store/WAF. */
export function createSubmissionRateLimiter({
  max = 5, windowMs = 15 * 60 * 1000,
}: { max?: number; windowMs?: number } = {}) {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  return function throttle(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    if (buckets.size > 5000) {
      for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
    }
    const key = req.ip || "unknown";
    const item = buckets.get(key);
    if (!item || item.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }
    if (item.count >= max) {
      res.setHeader("Retry-After", String(Math.ceil((item.resetAt - now) / 1000)));
      res.status(429).json({ error: "Too many requests. Please try again later." });
      return;
    }
    item.count++;
    next();
  };
}
