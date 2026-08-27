export default function ChatLoading() {
  return (
    <div className="flex flex-col h-screen max-h-screen w-full bg-cream">
      <span className="sr-only" role="status">
        Loading chat interface…
      </span>

      {/* Header skeleton */}
      <div
        aria-hidden="true"
        className="flex-shrink-0 border-b border-lavender/30 px-4 py-4 sm:px-6"
      >
        <div className="h-8 w-24 animate-pulse rounded bg-lavender/30" />
      </div>

      {/* Chat container with skeleton */}
      <div
        aria-hidden="true"
        className="flex-1 overflow-hidden px-4 py-4 sm:px-6 flex flex-col"
      >
        <div className="mx-auto w-full max-w-2xl flex flex-col overflow-hidden rounded-xl border border-lavender/30 h-full">
          {/* Messages area skeleton */}
          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
            <div className="space-y-3">
              {/* Empty state skeleton */}
              <div className="mx-auto mt-8 max-w-lg text-center sm:mt-12">
                <div className="mx-auto mb-4 h-6 w-32 animate-pulse rounded bg-lavender/30" />
                <div className="mx-auto mb-3 h-4 w-48 animate-pulse rounded bg-lavender/30" />
                <div className="mx-auto h-4 w-40 animate-pulse rounded bg-lavender/30" />
              </div>
            </div>
          </div>

          {/* Input skeleton */}
          <div className="border-t border-lavender/30 p-3">
            <div className="flex items-end gap-2">
              <div className="min-h-[40px] flex-1 animate-pulse rounded-lg bg-lavender/30" />
              <div className="h-10 w-16 animate-pulse rounded-lg bg-lavender/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}