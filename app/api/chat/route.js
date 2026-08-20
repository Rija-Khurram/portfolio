import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT, MODEL_ID } from "@/lib/ai-config";

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: google(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}