import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

import { SYSTEM_PROMPT, MODEL_ID } from "@/lib/ai-config";
import { scoreLead } from "@/lib/tools/score-lead";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Caps the max time this streaming handler may run on Vercel's serverless
// functions (in seconds). Prevents a hung stream from consuming a function
// invocation indefinitely.
export const maxDuration = 30;

// Basic input caps to prevent abuse: an unbounded number of messages or an
// extremely long message could waste quota / drive up API cost per request.
const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req) {

  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterSeconds } = checkRateLimit(ip);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests. Please wait a moment and try again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSeconds),
          },
        }
      );
    }

    let messages;

    try {
      const body = await req.json();
      messages = body.messages;

      if (!Array.isArray(messages)) {
        return new Response(
          JSON.stringify({ error: "Invalid request: messages must be an array" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (messages.length > MAX_MESSAGES) {
        return new Response(
          JSON.stringify({ error: "Conversation is too long. Please start a new chat." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const tooLong = messages.some((m) =>
        Array.isArray(m.parts)
          ? m.parts.some(
              (p) => p.type === "text" && p.text?.length > MAX_MESSAGE_LENGTH
            )
          : false
      );

      if (tooLong) {
        return new Response(
          JSON.stringify({ error: "Message is too long." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (parseErr) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = streamText({
      model: google(MODEL_ID),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),

      tools: {
        scoreLead,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const statusCode = error.status || 500;
    const errorMessage = error.message || "An unexpected error occurred";

    if (statusCode === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: statusCode >= 500
          ? "Server error. Please try again later."
          : errorMessage
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    );
  }
}