"use client";


// Client-side chat UI. Renders streamed message parts, a thinking indicator
// that hands off into the first token (not a hard swap), a working stop
// button, and auto-scroll that releases the moment the user scrolls up —
// per the mentor tips, this is the part most submissions get wrong.
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

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

  // Track whether the user is currently at the bottom of the scroll area.
  // Only auto-scroll while they are; the moment they scroll up, release the
  // pin so we never yank them back down mid-read.
  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
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
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-sky text-plum"
                  : "bg-lavender/20 text-plum"
              }`}
            >
             {message.parts.map((part, i) =>
  part.type === "text" ? (
    <div key={i} className="prose prose-sm max-w-none">
      <ReactMarkdown>{part.text}</ReactMarkdown>
    </div>
  ) : null
)}
            </div>
          </div>
        ))}

        {/* Thinking indicator: shown only before the first token arrives.
            It sits in the same message-row position the assistant's reply
            will occupy, so when text starts streaming it reads as a
            handoff rather than a flicker/swap. */}
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
          className="flex-1 resize-none rounded-lg border border-lavender/30 px-3 py-2 text-base outline-none focus:border-sky text-base"
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
