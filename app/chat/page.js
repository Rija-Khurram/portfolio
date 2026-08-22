import ChatInterface from "./ChatInterface";

export const metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen w-full bg-cream">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-lavender/30 px-4 py-4 sm:px-6">
        <h1
          className="text-2xl italic text-plum"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Chat
        </h1>
      </div>

      {/* Chat container - takes remaining space */}
      <div className="flex-1 overflow-hidden px-4 py-4 sm:px-6 flex flex-col">
        <ChatInterface />
      </div>
    </div>
  );
}
