import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";

import { SYSTEM_PROMPT, MODEL_ID } from "@/lib/ai-config";
import { scoreLead } from "@/lib/tools/score-lead";

export async function POST(req) {
   
  try {
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
    } catch (parseErr) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for rate limiting (demo: you can add actual rate limiting logic here)
    // For now, we'll just pass through to the model

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
    // Handle specific error types
    const statusCode = error.status || 500;
    const errorMessage = error.message || "An unexpected error occurred";
    
    // Check for rate limit errors (429)
    if (statusCode === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // For other errors, return appropriate response
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