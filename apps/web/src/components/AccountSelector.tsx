"use client";
import type { Account } from "@/types/account";

export function AccountSelector({
  accounts,
  selectedId,
  onChange,
}: {
  accounts: Account[];
  selectedId?: string;
  onChange: (id: string) => void;
}) {
  const disabled = accounts.length === 0;

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-zinc-300">Select account</label>
        <span className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-700 text-zinc-400">
          {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
        </span>
      </div>

      <div className="relative group">
        <select
          className={[
            "w-full appearance-none rounded-xl",
            "border border-zinc-800/70 bg-white/5 dark:bg-black/20 backdrop-blur",
            "px-4 py-3 pr-10 text-sm",
            "outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-500/50",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02),0_8px_24px_-12px_rgba(0,0,0,0.50)]",
            disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-white/10 dark:hover:bg-black/30",
          ].join(" ")}
          value={selectedId || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="" disabled>
            {disabled ? "No accounts yet" : "Choose an account"}
          </option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id} className="bg-black text-white">
              {a.label || a.id}
            </option>
          ))}
        </select>

        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-violet-400 transition-colors"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.207l3.71-2.977a.75.75 0 11.94 1.166l-4.25 3.41a.75.75 0 01-.94 0l-4.25-3.41a.75.75 0 01.02-1.166z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {!disabled && (
        <p className="text-[11px] text-zinc-500">
          Tip: You can rename accounts to keep things organized.
        </p>
      )}
    </div>
  );
}