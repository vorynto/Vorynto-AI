"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-10">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">Page Error</h2>
          <p className="text-sm text-white/40">{error.message || "This page encountered an error."}</p>
          {error.digest && (
            <p className="text-xs text-white/20 mt-1 font-mono">Ref: {error.digest}</p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
          >
            Retry
          </button>
          <Link href="/admin" className="px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-sm transition-colors">
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
