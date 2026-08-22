import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

import { SYSTEM_PROMPT, MODEL_ID } from "@/lib/ai-config";
import { scoreLead } from "@/lib/tools/score-lead";

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: google(MODEL_ID),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),

    tools: {
      scoreLead,
    },
  });

  return result.toUIMessageStreamResponse();
}