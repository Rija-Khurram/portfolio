# Portfolio — Capstone Skeleton

Next.js app scaffold for the portfolio capstone. Routes, navigation, and design tokens are in place; page content is placeholder for now.

## Routes

- `/` — Home
- `/work` — Work (case studies)
- `/about` — About
- `/contact` — Contact (the one action: email CTA)
- `/health` — Health-check page, confirms server-side data fetching works
- `/chat` — Streaming AI chat interface (Claude via the AI SDK)

## Streaming chat

- Server: `app/api/chat/route.js` calls Claude through the AI SDK's `streamText`, returning a UI message stream.
- Client: `app/chat/ChatInterface.js` uses `useChat` to render streamed message parts, with a thinking indicator, a working stop button, and auto-scroll that releases the moment the user scrolls up.
- Model and system prompt live in one place: `lib/ai-config.js`.
- Requires `ANTHROPIC_API_KEY` set server-side only (see `.env.example`).

## Design tokens (from Week 3 Identity Kit)

- Fonts: Playfair Display Italic (headings), Nunito (body) — loaded via `next/font/google`
- Colors: sky `#7EC8E3`, lavender `#B8A6E0`, plum `#2A1B30`, cream `#FFF9F5`

## Run locally

```
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), sign in with GitHub.
3. Click "Add New Project", select this repo.
4. Leave all settings as default (Vercel auto-detects Next.js) and click "Deploy".
5. Every future push to the repo will automatically build a new preview deployment.

No environment variables are required yet — `.env.example` documents where they'll go as features are added in later weeks.
