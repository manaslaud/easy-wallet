"use client";
import type { KeyPair } from "@/types/account";
import { CopyButton } from "@/components/CopyButton";
import { truncateMiddle } from "@/helpers/format";

export function KeyPairCard({
  kp,
  balance,
}: {
  kp: KeyPair;
  balance?: string;
}) {
  const chainColor = kp.chain === "solana" ? "text-violet-400" : "text-emerald-400";
  return (
    <div className="rounded-xl border border-zinc-800/70 bg-white/5 dark:bg-black/20 backdrop-blur p-4 grid gap-2">
      <div className="flex items-center justify-between">
        <div className={`text-xs uppercase tracking-wide ${chainColor}`}>{kp.chain}</div>
        <div className="text-[10px] text-zinc-500">{kp.derivationPath}</div>
      </div>
      <div className="grid gap-1">
        <div className="flex items-center justify-between text-xs text-zinc-400"><span>Address</span><CopyButton value={kp.address} /></div>
        <div className="font-mono break-all text-sm">{truncateMiddle(kp.address, 10, 8)}</div>
      </div>
      <div className="grid gap-1">
        <div className="flex items-center justify-between text-xs text-zinc-400"><span>Public Key</span><CopyButton value={kp.publicKey} /></div>
        <div className="font-mono break-all text-sm">{truncateMiddle(kp.publicKey, 12, 10)}</div>
      </div>
      <div className="grid gap-1">
        <div className="text-xs text-zinc-400">Balance</div>
        <div className="font-mono text-sm">{balance || "…"}</div>
      </div>
    </div>
  );
}


