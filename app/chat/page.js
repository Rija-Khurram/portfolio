import ChatInterface from "./ChatInterface";

export default function ChatPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1
        className="text-2xl italic text-plum mb-6"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Chat
      </h1>
      <ChatInterface />
    </div>
  );
}
