# Portfolio — Capstone Skeleton

Next.js app scaffold for the portfolio capstone. Routes, navigation, and design tokens are in place.

## Routes

* `/` — Home
* `/work` — Work (case studies)
* `/about` — About
* `/contact` — Contact (the one action: email CTA)
* `/health` — Health-check page, confirms server-side data fetching works
* `/chat` — Streaming AI chat interface (Gemini via the AI SDK)

## Streaming Chat

* **Server:** `app/api/chat/route.js` calls Gemini through the AI SDK's `streamText`, returning a UI message stream.
* **Client:** `app/chat/ChatInterface.js` uses `useChat` to render streamed message parts, with a thinking indicator, a working stop button, auto-scroll, and typed tool-part states.
* **Model and system prompt:** `lib/ai-config.js`
* **AI provider:** Google Gemini through `@ai-sdk/google`
* **Environment variable:** `GOOGLE_GENERATIVE_AI_API_KEY` must be configured server-side.

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

* `input-streaming` — shows that lead-scoring input is being prepared.
* `input-available` — displays the lead information being sent to the scoring tool.
* `output-available` — renders the scoring result as a Lead Score Card.
* `output-error` — renders a designed error state when tool execution fails.

### Lead Score Component

Successful tool results are rendered as a Lead Score Card instead of raw JSON.

The card displays:

* Lead score
* Lead status
* Project type
* Interest level
* Budget range
* Timeline
* Recommendation

### Tool Definition

The server-side tool is defined in:

`lib/tools/score-lead.js`

The tool is registered with the AI model in:

`app/api/chat/route.js`

## Design Tokens

The portfolio uses the Week 3 Identity Kit design tokens:

* **Fonts:** Playfair Display Italic for headings and Nunito for body text
* **Sky:** `#7EC8E3`
* **Lavender:** `#B8A6E0`
* **Plum:** `#2A1B30`
* **Cream:** `#FFF9F5`

## Run Locally

```bash
npm install
npm run dev
```

Open:

`http://localhost:3000`

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to Vercel and sign in with GitHub.
3. Click **Add New Project** and select this repository.
4. Leave the default Next.js settings and click **Deploy**.
5. Add `GOOGLE_GENERATIVE_AI_API_KEY` to the project's environment variables.
6. Every future push to the repository will automatically create a new deployment.

## Project Structure

```text
app/
├── api/
│   └── chat/
│       └── route.js
└── chat/
    ├── ChatInterface.js
    └── page.js

lib/
├── ai-config.js
└── tools/
    └── score-lead.js
```
