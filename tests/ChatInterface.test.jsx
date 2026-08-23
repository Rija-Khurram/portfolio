import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const chatState = {
  messages: [],
  sendMessage: vi.fn(),
  status: "ready",
  stop: vi.fn(),
  error: null,
  reload: vi.fn(),
};

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => chatState),
}));

import ChatInterface from "../app/chat/ChatInterface";

function renderChat(overrides = {}) {
  Object.assign(chatState, {
    messages: [],
    status: "ready",
    error: null,
    ...overrides,
  });
  return render(<ChatInterface />);
}

describe("ChatInterface", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user and assistant text messages", () => {
    renderChat({
      messages: [
        { id: "user-1", role: "user", parts: [{ type: "text", text: "Hello" }] },
        { id: "assistant-1", role: "assistant", parts: [{ type: "text", text: "Hi there" }] },
      ],
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("shows the streaming lead-scoring state", () => {
    renderChat({
      messages: [{ id: "tool-1", role: "assistant", parts: [{ type: "tool-scoreLead", state: "input-streaming" }] }],
    });

    expect(screen.getByText("Preparing lead scoring...")).toBeInTheDocument();
  });

  it("shows the available lead-scoring input while scoring", () => {
    renderChat({
      messages: [{
        id: "tool-2",
        role: "assistant",
        parts: [{
          type: "tool-scoreLead",
          state: "input-available",
          input: { interestLevel: "high", budgetRange: "medium", timeline: "soon", projectType: "Website redesign" },
        }],
      }],
    });

    expect(screen.getByText("Lead scoring input")).toBeInTheDocument();
    expect(screen.getByText("Website redesign")).toBeInTheDocument();
    expect(screen.getByText("Scoring lead...")).toBeInTheDocument();
  });

  it("renders the lead score card for a successful tool result", () => {
    renderChat({
      messages: [{
        id: "tool-3",
        role: "assistant",
        parts: [{
          type: "tool-scoreLead",
          state: "output-available",
          output: {
            score: 90,
            status: "Hot Lead",
            projectType: "Brand website",
            factors: { interest: "high", budget: "high", timeline: "urgent" },
            recommendation: "Prioritize this lead.",
          },
        }],
      }],
    });

    expect(screen.getByText("Lead Score")).toBeInTheDocument();
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("Hot Lead")).toBeInTheDocument();
    expect(screen.getByText("Brand website")).toBeInTheDocument();
    expect(screen.getByText("Prioritize this lead.")).toBeInTheDocument();
  });

  it("uses safe defaults for an incomplete lead score result", () => {
    renderChat({
      messages: [{
        id: "tool-4",
        role: "assistant",
        parts: [{ type: "tool-scoreLead", state: "output-available", output: { score: 42 } }],
      }],
    });

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("No recommendation available")).toBeInTheDocument();
    expect(screen.getAllByText("Unknown")).toHaveLength(5);
  });

  it("renders a designed error state for a failed tool result", () => {
    renderChat({
      messages: [{
        id: "tool-5",
        role: "assistant",
        parts: [{ type: "tool-scoreLead", state: "output-error", errorText: "Scoring service unavailable" }],
      }],
    });

    expect(screen.getByText("Lead scoring failed")).toBeInTheDocument();
    expect(screen.getByText("Scoring service unavailable")).toBeInTheDocument();
  });

  it("shows a validation error when the chat form is submitted empty", async () => {
    const user = userEvent.setup();
    renderChat();

    await user.click(screen.getByPlaceholderText("Type a message..."));
    await user.keyboard("{Enter}");

    expect(screen.getByText("Please enter a message")).toBeInTheDocument();
    expect(chatState.sendMessage).not.toHaveBeenCalled();
  });

  it("submits a valid chat form message", async () => {
    const user = userEvent.setup();
    renderChat();
    const input = screen.getByPlaceholderText("Type a message...");

    await user.type(input, "Tell me about the portfolio");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(chatState.sendMessage).toHaveBeenCalledWith({ text: "Tell me about the portfolio" });
    expect(input).toHaveValue("");
  });

  it("renders the chat-level error and retry action", () => {
    renderChat({ error: new Error("Network unavailable") });

    expect(screen.getByText("Message failed to send")).toBeInTheDocument();
    expect(screen.getByText("Network unavailable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("shows the loading skeleton while submitted or streaming", () => {
    const { rerender } = renderChat({ status: "submitted" });
    expect(screen.queryByText("How can I help?")).not.toBeInTheDocument();

    chatState.status = "streaming";
    rerender(<ChatInterface />);
    expect(screen.getByPlaceholderText("Type a message...")).toBeDisabled();
  });
});
