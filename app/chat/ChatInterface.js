"use client";

import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

function LeadScoreCard({ result }) {
  if (!result) return null;

  return (
    <div className="mt-3 rounded-xl border border-lavender/40 bg-cream/70 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-plum/50">
            Lead Score
          </p>
          <p className="text-3xl font-bold text-plum">
            {result.score}
            <span className="text-sm font-normal text-plum/50"> / 100</span>
          </p>
        </div>

        <span className="rounded-full bg-sky px-3 py-1 text-sm font-medium text-plum">
          {result.status}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs uppercase tracking-wide text-plum/50">
          Project
        </p>
        <p className="text-sm font-medium text-plum">
          {result.projectType}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg bg-lavender/20 p-2">
          <p className="text-xs text-plum/50">Interest</p>
          <p className="text-sm font-medium capitalize text-plum">
            {result.factors?.interest}
          </p>
        </div>

        <div className="rounded-lg bg-lavender/20 p-2">
          <p className="text-xs text-plum/50">Budget</p>
          <p className="text-sm font-medium capitalize text-plum">
            {result.factors?.budget}
          </p>
        </div>

        <div className="rounded-lg bg-lavender/20 p-2">
          <p className="text-xs text-plum/50">Timeline</p>
          <p className="text-sm font-medium capitalize text-plum">
            {result.factors?.timeline}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-sky/30 p-3">
        <p className="text-xs uppercase tracking-wide text-plum/50">
          Recommendation
        </p>
        <p className="text-sm text-plum">
          {result.recommendation}
        </p>
      </div>
    </div>
  );
}

function ToolPart({ part }) {
  if (part.type !== "tool-scoreLead") {
    return null;
  }

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
        <p className="text-xs uppercase tracking-wide text-plum/50 mb-2">
          Lead scoring input
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-plum">
          <div>
            <span className="text-plum/50">Interest:</span>{" "}
            <span className="font-medium capitalize">
              {part.input?.interestLevel}
            </span>
          </div>

          <div>
            <span className="text-plum/50">Budget:</span>{" "}
            <span className="font-medium capitalize">
              {part.input?.budgetRange}
            </span>
          </div>

          <div>
            <span className="text-plum/50">Timeline:</span>{" "}
            <span className="font-medium capitalize">
              {part.input?.timeline}
            </span>
          </div>

          <div>
            <span className="text-plum/50">Project:</span>{" "}
            <span className="font-medium">
              {part.input?.projectType}
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
    return <LeadScoreCard result={part.output} />;
  }

  if (part.state === "output-error") {
    return (
      <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-red-600">✕</span>
          <p className="font-medium text-red-700">
            Lead scoring failed
          </p>
        </div>

        <p className="text-sm text-red-600">
          {part.errorText || "The lead could not be scored. Please try again."}
        </p>
      </div>
    );
  }

  return null;
}

export default function ChatInterface() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollContainerRef = useRef(null);
  const isPinnedToBottomRef = useRef(true);

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

    if (!text || isBusy) return;

    isPinnedToBottomRef.current = true;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-xl mx-auto border border-lavender/30 rounded-xl overflow-hidden">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-sm text-plum/50 text-center mt-8">
            Ask something — this streams a real response from Claude.
          </p>
        )}

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
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
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
                  return <ToolPart key={i} part={part} />;
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-lavender/20 text-plum/60 italic">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-lavender/30 p-3 flex gap-2 items-end"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="flex-1 resize-none rounded-lg border border-lavender/30 px-3 py-2 outline-none focus:border-sky"
          style={{ minHeight: "40px" }}
        />

        {isBusy ? (
          <button
            type="button"
            onClick={stop}
            className="shrink-0 bg-plum text-cream px-4 py-2 rounded-lg text-sm font-medium"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="shrink-0 bg-sky text-plum px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}