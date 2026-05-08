"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  const isClerkError =
    error.message.includes("Clerk") ||
    error.message.includes("clerk-js") ||
    error.message.includes("ClerkRuntimeError");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f1e] p-6 text-center text-white">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-3xl">
        {isClerkError ? "🛡️" : "⚠️"}
      </div>
      <h1 className="text-2xl font-bold">
        {isClerkError ? "Ad Blocker Detected" : "Something went wrong"}
      </h1>
      <p className="mt-4 max-w-lg text-slate-300">
        {isClerkError
          ? "Our authentication system requires certain scripts to run. If you're using Brave Shields or an ad blocker, it might be blocking our secure login provider (Clerk). Please disable shields/blockers for this site and try again."
          : error.message || "An unexpected error occurred while loading the application."}
      </p>

      <button
        onClick={() => reset()}
        className="mt-8 rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400"
      >
        Try Again
      </button>

      {isClerkError && (
        <a
          href="/dashboard"
          className="mt-4 px-6 py-3 font-semibold text-cyan-400 hover:text-cyan-300 transition"
          onClick={() => window.location.reload()}
        >
          Reload Page Without JS Interception
        </a>
      )}
    </div>
  );
}