/**
 * Minimal in-memory rate limiter, keyed by client IP.
 *
 * Known limitation: this state lives in a single serverless function
 * instance's memory. On Vercel, concurrent/cold-started instances do
 * NOT share this store, so the effective limit is "per warm instance,"
 * not truly global. That's an acceptable trade-off for a portfolio-scale
 * project with low traffic, but a production app serving real load
 * would need a shared store (e.g. Upstash Redis + @upstash/ratelimit).
 */

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // per IP, per window

const hits = new Map(); // ip -> array of request timestamps

export function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || "unknown";
  const timestamps = hits.get(key) || [];

  // Drop timestamps outside the current window
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestInWindow = recent[0];
    const retryAfterSeconds = Math.ceil(
      (WINDOW_MS - (now - oldestInWindow)) / 1000
    );
    return { allowed: false, retryAfterSeconds };
  }

  recent.push(now);
  hits.set(key, recent);

  // Prevent unbounded growth of the map across many distinct IPs
  if (hits.size > 5000) {
    const oldestKey = hits.keys().next().value;
    hits.delete(oldestKey);
  }

  return { allowed: true };
}

export function getClientIp(req) {
  // Vercel sets x-forwarded-for; fall back gracefully in local dev
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "local-dev";
}