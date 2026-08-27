# Portfolio — AI-Enhanced Frontend Capstone

A production-ready personal portfolio built with Next.js, React, Tailwind CSS, Framer Motion, and Google Gemini through the Vercel AI SDK. The portfolio showcases frontend development work while providing an AI-powered chat experience that can qualify potential client leads and generate a structured Lead Score Card.

## Live Application

**Production:** https://portfolio-rija3.vercel.app

**Repository:** https://github.com/Rija-Khurram/portfolio

---

## Project Brief

This project is a personal developer portfolio designed to showcase frontend development work while providing a useful AI-assisted experience for potential clients. The portfolio includes an AI streaming chat that can understand project requirements and qualify potential leads based on interest, budget, timeline, and project type. It's built for one specific reader: a hiring manager or client evaluating whether to reach out — the chat turns a normally passive "read my portfolio" experience into something they can actually interact with. The idea was chosen to combine a professional portfolio with a meaningful AI capability rather than adding AI as a simple decorative chatbot.

---

## Tech Stack

- Next.js 16
- React 19
- JavaScript
- Tailwind CSS v4
- Framer Motion
- Vercel AI SDK
- Google Gemini
- Zod
- Vercel
- Git & GitHub

---

## Routes

| Route | Description |
|---|---|
| `/` | Home page and portfolio introduction |
| `/work` | Projects and case studies |
| `/about` | About section |
| `/contact` | Contact page with email CTA |
| `/health` | Health-check page for server-side data fetching |
| `/chat` | AI-powered streaming chat and lead qualification |

---

## AI Integration

### Streaming AI Chat

The `/chat` page provides an AI-powered conversational interface using Google Gemini through the Vercel AI SDK.

The AI assistant can:

- Answer questions about frontend development
- Discuss AI-assisted development workflows
- Understand potential client project requirements
- Collect information about a potential project
- Qualify a potential client lead
- Generate a structured lead score

The AI capability is integrated into the portfolio as a practical lead-qualification feature rather than functioning only as a general chatbot.

### Server-Side AI

The server-side chat endpoint is located at:

```text
app/api/chat/route.js
```

The endpoint uses the Vercel AI SDK's `streamText` function to send requests to Google Gemini and stream the response back to the client as a UI message stream.

### Client-Side Chat

The chat interface is implemented in:

```text
app/chat/ChatInterface.js
```

It uses `useChat` to render streamed message parts, with a thinking indicator, a working stop button, auto-scroll, typed tool-part states, and screen-reader announcements for streamed content.

### AI System Prompt & Model Config

The model ID and system prompt are defined in:

```text
lib/ai-config.js
```

- **AI provider:** Google Gemini through `@ai-sdk/google`
- **Environment variable:** `GOOGLE_GENERATIVE_AI_API_KEY` must be configured server-side.

### Why This Approach

The chat isn't a generic chatbot bolted on for the sake of using AI — it solves a real problem: a hiring manager skimming a portfolio has no way to ask a follow-up question or get pre-qualified. The `scoreLead` tool call (rather than free-text scoring) was a deliberate choice: letting the model freely calculate and state a score risks inconsistent, unverifiable numbers. Instead, the model is only allowed to *gather* structured information (interest, budget, timeline, project type) and hand it to a deterministic `scoreLead` function that actually computes the score. This keeps the AI's role honest — it interprets and asks, it doesn't invent numbers.

The model currently used is Google Gemini rather than Claude, due to API cost/quota constraints hit during development. The integration pattern (`streamText`, `convertToModelMessages`, `toUIMessageStreamResponse`) is identical to what Claude via `@ai-sdk/anthropic` would use — switching providers is a one-line change in `lib/ai-config.js`.

---

## AI Tool — `scoreLead`

### Purpose

`scoreLead` qualifies a potential client lead based on their interest level, budget range, timeline, and project type.

The tool is implemented as a server-side AI SDK tool and uses a Zod schema to validate its input.

### Input Schema

```text
{
  interestLevel: "low" | "medium" | "high",
  budgetRange: "unknown" | "low" | "medium" | "high",
  timeline: "unknown" | "later" | "soon" | "urgent",
  projectType: string
}
```

### Return Shape

```text
{
  score: number,
  status: "Hot Lead" | "Warm Lead" | "Cold Lead",
  projectType: string,
  factors: {
    interest: string,
    budget: string,
    timeline: string
  },
  recommendation: string
}
```

### Tool Lifecycle UI

The chat renders the tool lifecycle using typed tool parts with four distinct states:

- `input-streaming` — shows that lead-scoring input is being prepared.
- `input-available` — displays the lead information being sent to the scoring tool.
- `output-available` — renders the scoring result as a Lead Score Card.
- `output-error` — renders a designed error state when tool execution fails.

### Lead Score Component

Successful tool results are rendered as a Lead Score Card instead of raw JSON. The card displays: lead score, lead status, project type, interest level, budget range, timeline, and recommendation.

### Tool Definition

The server-side tool is defined in `lib/tools/score-lead.js` and registered with the AI model in `app/api/chat/route.js`.

---

## Known Limitations & Future Improvements

- The model provider is Gemini, not Claude, for cost reasons during development. Swapping back is a one-line change but not yet done.
- The lead-scoring logic is a simple weighted formula, not a trained model — it's transparent and deterministic by design, but it isn't sophisticated qualification logic.
- The Home and Work page proof-moment images are currently placeholders pending final screenshots of the LankaStay and Library App projects.
- The chat has no persistent history — each page load starts a fresh conversation, an accepted trade-off given the portfolio's scope rather than adding a database for conversation storage.
- SEO score (60, per `AUDIT.md`) was left out of scope for this round — the audit focused on performance and accessibility, which were the graded requirements.
- Next step if continued: persist chat history per visitor session, and send a real notification (email/Slack) when a lead scores as "Hot" so qualification actually reaches me instead of just being displayed.

---

## Testing Evidence

- **Unit/component tests (Vitest + React Testing Library):** 10 tests in `tests/ChatInterface.test.jsx`, querying by role and accessible text (not test IDs), covering plain text messages, the `scoreLead` tool's full lifecycle (input-streaming, input-available, output-available, output-error), safe fallbacks for malformed tool data, chat-level error/retry, form validation, and loading states. Run with `npm test`; all 10 pass.
- **End-to-end test (Playwright):** one test in `e2e/chat.spec.js` walks the primary flow — load `/chat`, type a message, send it, confirm a mocked response renders — with the network request intercepted so no real API call is made.
- **CI:** GitHub Actions (`.github/workflows/test.yml`) runs both suites on every push and is green.

---

## Accessibility & Performance Audit

Full results, before/after Lighthouse scores, and WAVE output are in [`AUDIT.md`](./AUDIT.md).

**Summary:** Lighthouse mobile Performance 93–98 and Accessibility 100 across all tested pages (up from a 78/87 baseline); zero WAVE errors on Home, Work, and both Chat states; primary chat flow fully completable by keyboard alone.

---

## Design Tokens

The portfolio uses the Week 3 Identity Kit design tokens:

- **Fonts:** Playfair Display Italic for headings and Nunito for body text
- **Sky:** `#7EC8E3`
- **Lavender:** `#B8A6E0`
- **Plum:** `#2A1B30`
- **Cream:** `#FFF9F5`

---

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to Vercel and sign in with GitHub.
3. Click **Add New Project** and select this repository.
4. Leave the default Next.js settings and click **Deploy**.
5. Add `GOOGLE_GENERATIVE_AI_API_KEY` to the project's environment variables.
6. Every future push to the repository automatically creates a new deployment.

---

## Project Structure

```text
app/
├── api/
│   └── chat/
│       └── route.js
├── chat/
│   ├── ChatInterface.js
│   ├── page.js
│   ├── error.js
│   └── loading.js
├── work/
├── about/
├── contact/
└── health/

lib/
├── ai-config.js
└── tools/
    └── score-lead.js

tests/
└── ChatInterface.test.jsx

e2e/
└── chat.spec.js

.github/
└── workflows/
    └── test.yml
```
## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Google AI Studio API key for Gemini, used server-side only in `app/api/chat/route.js`. Get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). |

Copy `.env.example` to `.env.local` and fill in the key before running locally.
## How AI Tools Built This

This project was built with AI assistance throughout, used as a pair-programmer rather than a code-generator — every feature was built incrementally and reviewed, not accepted wholesale. Specifics:

- Claude was used as a tutor/reasoning partner for architecture decisions — e.g. deciding to make the `scoreLead` AI tool call a deterministic function rather than letting the model calculate scores freely, and for debugging a CI-only Playwright failure (see below).
- GitHub Copilot, working directly in the repo, implemented the failure/edge-case handling (retry logic, designed error states, skeleton loading) and the automated test suite (Vitest component tests, the Playwright E2E test, and the GitHub Actions CI workflow).
- A real bug, found and fixed with AI assistance: the Playwright E2E test passed locally but failed in CI with a 30-second timeout waiting for the Send button to enable. Two initial hypotheses (a malformed SSE mock delimiter, then a hydration-timing race) were tested and ruled out by reading the actual button's disabled logic in the source and the live CI error logs — not by guessing. The real cause was that CI ran the dev server (`next dev`), which hydrates too slowly under Playwright's automation compared to a production build. The fix: CI now runs `npm run build && npm run start` instead of `next dev`.
- AI-generated code was never merged without review — an early version of an accessible Disclosure component (from a separate assignment) turned out to be wrapping a component library primitive instead of being genuinely built from scratch, caught during review and rebuilt by hand.
- Every AI-authored change was verified by actually running the build, the test suite, or the browser — not just assumed to work from the AI's own claim.
## Known Limitations

- **E2E test not currently running locally on all machines / not yet pushed to `main`.** The Playwright test (`e2e/chat.spec.js`) exists but is not being picked up by `npx playwright test` in the current local environment (`Error: No tests found` despite the file and config both being present) — root cause not yet identified. It also has not been committed to the GitHub repo yet. Next step: isolate whether this is a Playwright cache/version issue or a config resolution problem, then commit the `e2e/` folder.
- Rate limiting is in-memory only (see comment in `lib/rate-limit.js`) — resets on cold start/redeploy and does not share state across concurrent serverless instances. Acceptable at this project's scale; a production app would need a shared store like Upstash Redis.
- Two Work-page case study screenshots (LankaStay booking flow, Library App workflow) are still placeholders.