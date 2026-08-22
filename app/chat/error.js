"use client";

import { useEffect } from "react";

export default function ChatError({ error, reset }) {
  useEffect(() => {
    // Log the error for debugging
    console.error("Chat page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-cream p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
          ⚠️
        </div>

        <h2 className="text-xl font-semibold text-plum">
          Chat encountered an error
        </h2>

        <p className="mt-2 text-sm text-plum/60">
          Something unexpected happened while loading the chat interface.
          This might be due to a network issue or temporary server problem.
        </p>

        {error?.message && (
          <details className="mt-3 text-left">
            <summary className="cursor-pointer text-xs text-plum/50 hover:text-plum/70">
              Error details
            </summary>
            <p className="mt-2 rounded bg-red-50 p-2 font-mono text-xs text-red-700 break-words">
              {error.message}
            </p>
          </details>
        )}

        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-lg bg-plum px-4 py-2 text-sm font-medium text-cream hover:opacity-90 transition"
        >
          Try again
        </button>

        <p className="mt-3 text-xs text-plum/40">
          If this persists, try refreshing the page.
        </p>
      </div>
    </main>
  );
}