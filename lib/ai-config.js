// Single source of truth for the streaming chat's model and system prompt.
// Keeping this in one well-commented module means FE-07 (which extends this
// same route handler) has one place to change behavior instead of hunting
// through the route file.

// Model: Google Gemini Flash, called through the Google provider for the AI SDK.
// Switched from Claude to Gemini due to API cost/quota constraints during
// development. Swap this string to point at a different model without
// touching any other file.
export const MODEL_ID = "gemini-3.6-flash";

// System prompt for the capstone's chat feature. Kept short and specific on
// purpose — a vague system prompt produces vague answers, same lesson as
// the FL-01/FL-02 prompting drills.
export const SYSTEM_PROMPT = `You are a helpful assistant embedded in a personal developer portfolio.
You can answer general questions, but you're especially useful for questions about
frontend development, AI-assisted development workflows, and how to think through
building a small project. Keep answers concise and practical. If you don't know
something, say so rather than guessing.`;
