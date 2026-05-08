"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global App Error:", error);
  }, [error]);

  const isClerkError =
    error.message.includes("Clerk") ||
    error.message.includes("clerk-js") ||
    String(error) === "failed_to_load_clerk_js";

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f1e] p-6 text-center text-white">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-3xl">
          {isClerkError ? "🛡️" : "⚠️"}
        </div>
        <h1 className="text-2xl font-bold">
          {isClerkError ? "Authentication Blocked" : "Something went wrong"}
        </h1>
        <p className="mt-4 max-w-lg text-slate-300">
          {isClerkError
            ? "Your browser or an extension (like an ad blocker or Brave Shields) is blocking our authentication system from loading. Please disable the tracker blocker/shields for this site and reload."
            : error.message || "A critical error occurred while loading the application."}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400"
        >
          Reload Page
        </button>
      </body>
    </html>
  );
}