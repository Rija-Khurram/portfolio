"use client";

import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

function LeadScoreCard({ result }) {
  if (!result || typeof result !== "object") return null;

  // Ensure required fields exist with safe defaults
  const score = typeof result.score === "number" ? result.score : "N/A";
  const status = result.status || "Unknown";
  const projectType = result.projectType || "Unknown";
  const recommendation = result.recommendation || "No recommendation available";

  return (
    <div className="mt-3 rounded-xl border border-lavender/40 bg-cream/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-plum/50">
            Lead Score
          </p>

          <p className="text-3xl font-bold text-plum">
            {score}
            {typeof score === "number" && (
              <span className="text-sm font-normal text-plum/50"> / 100</span>
            )}
          </p>
        </div>

        <span className="rounded-full bg-sky px-3 py-1 text-sm font-medium text-plum">
          {status}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-plum/50">
          Project
        </p>

        <p className="text-sm font-medium text-plum">
          {projectType}
        </p>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-lavender/20 p-2">
          <p className="text-xs text-plum/50">Interest</p>
          <p className="text-sm font-medium capitalize text-plum">
            {result.factors?.interest || "Unknown"}
          </p>
        </div>

        <div className="rounded-lg bg-lavender/20 p-2">
          <p className="text-xs text-plum/50">Budget</p>
          <p className="text-sm font-medium capitalize text-plum">
            {result.factors?.budget || "Unknown"}
          </p>
        </div>

        <div className="rounded-lg bg-lavender/20 p-2">
          <p className="text-xs text-plum/50">Timeline</p>
          <p className="text-sm font-medium capitalize text-plum">
            {result.factors?.timeline || "Unknown"}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-sky/30 p-3">
        <p className="text-xs uppercase tracking-wide text-plum/50">
          Recommendation
        </p>

        <p className="text-sm text-plum">
          {recommendation}
        </p>
      </div>
    </div>
  );
}

function ToolPart({ part }) {
  if (part.type !== "tool-scoreLead") {
    return null;
  }

  try {
    if (part.state === "input-streaming") {
      return (
        <div className="mt-2 rounded-xl border border-sky/40 bg-sky/10 p-3 text-sm text-plum">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">●</span>
            <span>Preparing lead scoring...</span>
          </div>
        </div>
      );
    }

    if (part.state === "input-available") {
      return (
        <div className="mt-2 rounded-xl border border-lavender/40 bg-lavender/10 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-plum/50">
            Lead scoring input
          </p>

          <div className="grid grid-cols-1 gap-2 text-xs text-plum sm:grid-cols-2">
            <div>
              <span className="text-plum/50">Interest:</span>{" "}
              <span className="font-medium capitalize">
                {part.input?.interestLevel || "Unknown"}
              </span>
            </div>

            <div>
              <span className="text-plum/50">Budget:</span>{" "}
              <span className="font-medium capitalize">
                {part.input?.budgetRange || "Unknown"}
              </span>
            </div>

            <div>
              <span className="text-plum/50">Timeline:</span>{" "}
              <span className="font-medium capitalize">
                {part.input?.timeline || "Unknown"}
              </span>
            </div>

            <div>
              <span className="text-plum/50">Project:</span>{" "}
              <span className="font-medium">
                {part.input?.projectType || "Unknown"}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs text-plum/50">
            Scoring lead...
          </p>
        </div>
      );
    }

    if (part.state === "output-available") {
      // Validate the result has required fields
      if (part.output && typeof part.output === "object" && "score" in part.output) {
        return <LeadScoreCard result={part.output} />;
      } else {
        throw new Error("Invalid lead score output structure");
      }
    }

    if (part.state === "output-error") {
      return (
        <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-red-600">✕</span>

            <p className="font-medium text-red-700">
              Lead scoring failed
            </p>
          </div>

          <p className="text-sm text-red-600">
            {part.errorText ||
              "The lead could not be scored. Please try again."}
          </p>
        </div>
      );
    }

    return null;
  } catch (err) {
    // Fallback error UI for any unexpected errors in tool rendering
    return (
      <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-red-600">✕</span>

          <p className="font-medium text-red-700">
            Tool response error
          </p>
        </div>

        <p className="text-sm text-red-600">
          The tool response could not be processed. This typically means the response was malformed.
        </p>
      </div>
    );
  }
}

function LoadingSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[80%] rounded-2xl bg-lavender/20 px-4 py-3">
        <div className="space-y-2.5">
          {/* First line - full width */}
          <div className="h-4 w-full animate-pulse rounded bg-lavender/40" />
          
          {/* Second line - 85% width */}
          <div className="h-4 w-[85%] animate-pulse rounded bg-lavender/40" />
          
          {/* Third line - 70% width (breathing room before next message) */}
          <div className="h-4 w-[70%] animate-pulse rounded bg-lavender/40" />
          
          {/* Add some vertical spacing for more realistic placeholder */}
          <div className="pt-1" />
          
          {/* Optional fourth line for longer responses */}
          <div className="h-4 w-[75%] animate-pulse rounded bg-lavender/40" />
        </div>
      </div>
    </div>
  );
}

function ChatError({ error, onRetry, isRetrying }) {
  return (
    <div className="mx-auto mt-4 w-full max-w-md rounded-xl border border-red-300 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          !
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-red-700">
            Message failed to send
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error?.message || "The response could not be completed. Check your connection and try again."}
          </p>

          <p className="mt-2 text-xs text-red-500">
            This will retry only the last message, not the entire conversation.
          </p>

          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? "Retrying..." : "Try again"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    reload,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const [inputError, setInputError] = useState("");

  const scrollContainerRef = useRef(null);
  const isPinnedToBottomRef = useRef(true);
  const retryTimeoutRef = useRef(null);

  const isThinking = status === "submitted";
  const isStreaming = status === "streaming";
  const isBusy = isThinking || isStreaming;

  function handleScroll() {
    const el = scrollContainerRef.current;

    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;

    isPinnedToBottomRef.current = distanceFromBottom < 40;
  }

  useEffect(() => {
    const el = scrollContainerRef.current;

    if (el && isPinnedToBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();

    const text = input.trim();

    if (!text) {
      setInputError("Please enter a message");
      return;
    }

    if (isBusy) {
      return;
    }

    setInputError("");
    isPinnedToBottomRef.current = true;

    sendMessage({ text });

    setInput("");
  }

  function handleRetry() {
    if (isRetrying) return;

    setIsRetrying(true);
    isPinnedToBottomRef.current = true;

    // Clear any pending timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Debounce retry - minimum 500ms between attempts
    retryTimeoutRef.current = setTimeout(() => {
      reload();
      setIsRetrying(false);
    }, 300);
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col overflow-hidden rounded-xl border border-lavender/30 h-full">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 sm:px-4"
      >
        {messages.length === 0 && !isBusy && !error && (
          <div className="mx-auto mt-8 max-w-lg text-center sm:mt-12">
            <p className="text-lg font-semibold text-plum">
              How can I help?
            </p>

            <p className="mt-2 text-sm text-plum/60">
              Ask me about frontend development, AI workflows, or describe a
              potential client project to score the lead.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setInput(
                    "What technologies should I use to build a modern portfolio?"
                  )
                }
                className="rounded-xl border border-lavender/30 bg-lavender/10 p-3 text-left text-sm text-plum transition hover:bg-lavender/20"
              >
                💻 Ask about frontend development
              </button>

              <button
                type="button"
                onClick={() =>
                  setInput(
                    "I need a website redesign. I am highly interested, my budget is medium, and I want to start soon. Please qualify me as a lead."
                  )
                }
                className="rounded-xl border border-lavender/30 bg-lavender/10 p-3 text-left text-sm text-plum transition hover:bg-lavender/20"
              >
                📊 Score a potential lead
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`w-fit max-w-[90%] rounded-2xl px-4 py-2 text-sm sm:max-w-[80%] ${
                  message.role === "user"
                    ? "bg-sky text-plum"
                    : "bg-lavender/20 text-plum"
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={i}
                        className="prose prose-sm max-w-none"
                      >
                        <ReactMarkdown>
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    );
                  }

                  if (part.type === "tool-scoreLead") {
                    return (
                      <ToolPart
                        key={i}
                        part={part}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}

          {(isThinking || isStreaming) && <LoadingSkeleton />}

          {error && (
            <ChatError
              error={error}
              onRetry={handleRetry}
              isRetrying={isRetrying}
            />
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-t border-lavender/30 p-3"
      >
        {inputError && (
          <div className="text-xs text-red-600 px-1">
            {inputError}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (inputError) setInputError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            placeholder="Type a message..."
            disabled={isBusy}
            className="min-h-[40px] min-w-0 flex-1 resize-none rounded-lg border border-lavender/30 px-3 py-2 text-sm outline-none focus:border-sky disabled:opacity-60"
          />

          {isBusy ? (
            <button
              type="button"
              onClick={stop}
              className="shrink-0 rounded-lg bg-plum px-3 py-2 text-sm font-medium text-cream sm:px-4"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 rounded-lg bg-sky px-3 py-2 text-sm font-medium text-plum disabled:opacity-40 sm:px-4"
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}