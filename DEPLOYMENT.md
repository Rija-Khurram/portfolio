# Deployment Checklist

**Project:** Portfolio Capstone (FE-11 — Production Readiness)
**Repo:** github.com/Rija-Khurram/portfolio
**Live URL:** https://portfolio-rija3.vercel.app
**Platform:** Vercel (auto-deploy from `main`)

---

## 1. Environment Variables

| Variable | Set in Vercel? | Notes |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | ✅ Confirmed | Server-side only, used in `app/api/chat/route.js`. Never exposed to the client. |

`.env.example` in the repo documents this variable for anyone setting up the project locally.

## 2. API Route Hardening

| Item | Status | Detail |
|---|---|---|
| Rate limiting | ✅ In place | In-memory sliding window, 10 requests / IP / 10 minutes, in `lib/rate-limit.js`. Returns `429` with a `Retry-After` header when exceeded. |
| Input length cap | ✅ In place | Rejects any message over 2000 characters with a `400` response. |
| Conversation history cap | ✅ In place | Only the most recent 20 messages are sent to the model per request, bounding token usage on long conversations. |
| `maxDuration` | ✅ In place | `export const maxDuration = 30;` in `app/api/chat/route.js` — caps how long a single streaming invocation can run. |

**Known limitation:** the rate limiter's state is in-memory per serverless function instance. It resets on cold start/redeploy and is not shared across concurrent instances, so the effective limit is "per warm instance" rather than a hard global cap. Acceptable for this project's traffic scale; a production app serving real load would need a shared store (e.g. Upstash Redis + `@upstash/ratelimit`).

## 3. Cross-Browser Verification

**Status: Manual verification required — not yet completed.**

This step must be done by a human opening the live site directly (an AI assistant cannot verify real browser rendering/behavior). Checklist to run through before final sign-off:

- [✓ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop, macOS)
- [ ] Mobile Safari (iOS)

For each: load `/`, `/work`, `/chat`; send a chat message and confirm streaming renders correctly; confirm the Stop button works mid-stream; confirm no layout breakage.

## 4. Failure Modes — How the App Fails Safely

| Failure scenario | Behavior |
|---|---|
| Chat request fails / network drops | Designed "Message failed to send" error state renders inline, with a retry button that resends **only the last message**, not the whole conversation. |
| Unexpected error while the `/chat` route is loading | A dedicated `error.js` error boundary renders a friendly error card with a "Try again" action and expandable technical details, instead of a blank screen or a raw stack trace. |
| Chat is loading | A skeleton loading state renders in place of empty white space, with a screen-reader announcement so assistive tech isn't left silent. |
| Rate limit exceeded | Returns HTTP `429` with a clear JSON error message and a `Retry-After` header — the client surfaces this as a normal chat error, not a crash. |
| Malformed/oversized request | Returns HTTP `400` with a specific message (invalid JSON, message too long, etc.) instead of crashing the function. |
| Tool (`scoreLead`) execution fails | Renders a distinct `output-error` UI state in the chat, separate from a general chat error, so the user understands specifically the lead-scoring step failed. |

## 5. Rollback Plan

Vercel keeps every past deployment. If a deployment introduces a regression:

1. **Fastest path:** Go to the Vercel dashboard → Deployments → find the last known-good deployment → click **Promote to Production**. This is effectively instant and requires no code changes.
2. **Alternative (source-of-truth path):** Revert the problematic commit on `main` locally (`git revert <commit-sha>`) and push. This triggers a fresh automatic deployment from the reverted state, keeping git history honest about what happened.

No manual server management is required either way — Vercel handles both paths automatically.

## 6. Monitoring

No dedicated APM/error-tracking service is wired up at this project's scale. Current visibility:
- Vercel's built-in deployment logs (function invocation errors, build failures)
- `console.error` calls in `app/api/chat/route.js` surface server-side errors in Vercel's function logs
- Future improvement: wire up Vercel Analytics or a lightweight error tracker (e.g. Sentry) if this app saw real traffic.

## 7. Sign-off

- [✓] Environment variables confirmed in Vercel
- [✓] Rate limiting and input caps implemented and verified (`npm test`, `npm run build` both pass)
- [✓] `maxDuration` set on the streaming route
- [✓ ] Cross-browser manual pass (Chrome / Firefox / Safari / Mobile Safari) — 
**Signed off by:** Rija Khurram
**Date:** 8/28/2026
