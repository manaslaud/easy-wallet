"use client";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(value)}
      className={className || "text-xs px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-900"}
      type="button"
    >
      Copy
    </button>
  );
}


