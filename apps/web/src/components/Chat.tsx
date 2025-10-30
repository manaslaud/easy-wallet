"use client";
import { useMemo, useState } from "react";
import type { Account } from "@/types/account";
import { chat as apiChat, type ChatMessage } from "@/helpers/chat";
import { getSolanaBalance } from "@/helpers/getSolanaBalance";
import { getEthereumBalance } from "@/helpers/getEthereumBalance";

export default function Chat({ selectedAccount, solanaNet, ethereumNet, canSend, sendEth, sendSol }: {
  selectedAccount?: Account;
  solanaNet: "devnet" | "testnet" | "mainnet-beta";
  ethereumNet: "sepolia" | "mainnet";
  canSend?: boolean;
  sendEth?: (to: string, amountEther: string) => Promise<string>;
  sendSol?: (to: string, amountSol: string) => Promise<string>;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingSend, setPendingSend] = useState<null | { chain: "solana" | "ethereum"; to: string; amount: string }>(null);
  const [confirming, setConfirming] = useState(false);

  const context = useMemo(() => {
    const acct = selectedAccount;
    const addresses: Record<string, string | undefined> = {
      solana: acct?.keyPairs.find((k) => k.chain === "solana")?.address,
      ethereum: acct?.keyPairs.find((k) => k.chain === "ethereum")?.address,
    };
    return {
      accountId: acct?.id,
      accountLabel: acct?.label,
      networks: { solana: solanaNet, ethereum: ethereumNet },
      addresses,
    };
  }, [selectedAccount, solanaNet, ethereumNet]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: input.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const resp = await apiChat(next, context);
      console.log(resp);
      const lines: string[] = [resp.content];
      if (resp.intent === "get_balance") {
        if (resp.data?.balance) {
          const b: any = resp.data.balance;
          if (b.chain === "ethereum") lines.push(`Balance: ${b.ether} ETH`);
          if (b.chain === "solana") lines.push(`Balance: ${b.sol} SOL`);
        } else {
          const p: any = resp.params || {};
          let chain: "solana" | "ethereum" | undefined = p.chain;
          if (!chain && (p.network === "solana" || p.network === "ethereum")) chain = p.network;
          if (!chain && p.address) chain = p.address.startsWith("0x") ? "ethereum" : "solana";
          const address: string | undefined = p.address || (chain === "solana"
            ? selectedAccount?.keyPairs.find((k) => k.chain === "solana")?.address
            : selectedAccount?.keyPairs.find((k) => k.chain === "ethereum")?.address);
          const network: any = (() => {
            const n = p.network;
            if (chain === "solana") return n === "devnet" || n === "testnet" || n === "mainnet-beta" ? n : solanaNet;
            if (chain === "ethereum") return n === "mainnet" || n === "sepolia" ? n : ethereumNet;
            return undefined;
          })();
          if (chain && address) {
            try {
              if (chain === "ethereum") {
                const b = await getEthereumBalance(address, { network });
                lines.push(`Balance: ${b.ether} ETH`);
              } else if (chain === "solana") {
                const b = await getSolanaBalance(address, network);
                lines.push(`Balance: ${b.sol} SOL`);
              }
            } catch {}
          }
        }
      }

      if (resp.intent === "send") {
        const p: any = resp.params || {};
        // infer chain
        let chain: "solana" | "ethereum" | undefined = p.chain;
        if (!chain && (p.network === "solana" || p.network === "ethereum")) chain = p.network;
        if (!chain && p.to) chain = String(p.to).startsWith("0x") ? "ethereum" : "solana";
        const to: string | undefined = p.to || p.toAddress;
        const amount: string | undefined = p.amount || p.amountEther || p.amountSol;

        if (!canSend) {
          lines.push("Unlock your wallet to send.");
        } else if (!chain || !to || !amount) {
          lines.push("Missing chain/to/amount.");
        } else {
          lines.push("Review and confirm the transaction in the modal.");
          setPendingSend({ chain, to, amount });
        }
      }
      setMessages((prev) => [...prev, { role: "assistant", content: lines.filter(Boolean).join("\n") }]);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${e?.message || e}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="rounded border border-zinc-800 p-3 min-h-[180px] max-h-[320px] overflow-auto bg-black/10">
        {messages.length === 0 ? (
          <div className="text-sm text-zinc-500">Ask about balances, networks, sending, or contacts.</div>
        ) : (
          <div className="grid gap-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-white" : "text-zinc-300"}>
                <span className="text-xs uppercase text-zinc-500 mr-2">{m.role}</span>
                <span className="whitespace-pre-wrap break-words">{m.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <button onClick={send} disabled={busy || !input.trim()} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">
          {busy ? "Sending..." : "Send"}
        </button>
      </div>

      {pendingSend && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
          <div className="w-[min(92vw,520px)] rounded-xl border border-zinc-800 bg-zinc-950 text-white p-5 grid gap-4 shadow-xl">
            <div className="text-lg font-semibold">Confirm transaction</div>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-zinc-400">Chain</span><span className="font-mono">{pendingSend.chain}</span></div>
              <div className="flex items-center justify-between"><span className="text-zinc-400">Amount</span><span className="font-mono">{pendingSend.amount}</span></div>
              <div className="grid gap-1">
                <span className="text-zinc-400">Recipient</span>
                <span className="font-mono break-all">{pendingSend.to}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                className="px-3 py-2 rounded border border-zinc-700 text-zinc-300"
                disabled={confirming}
                onClick={() => setPendingSend(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 rounded bg-white text-black disabled:opacity-50"
                disabled={confirming}
                onClick={async () => {
                  if (!pendingSend) return;
                  setConfirming(true);
                  try {
                    if (pendingSend.chain === "ethereum" && sendEth) {
                      const hash = await sendEth(pendingSend.to, pendingSend.amount);
                      setMessages((prev) => [...prev, { role: "assistant", content: `Sent. Tx: ${hash}` }]);
                    } else if (pendingSend.chain === "solana" && sendSol) {
                      const sig = await sendSol(pendingSend.to, pendingSend.amount);
                      setMessages((prev) => [...prev, { role: "assistant", content: `Sent. Signature: ${sig}` }]);
                    } else {
                      setMessages((prev) => [...prev, { role: "assistant", content: "Unsupported chain." }]);
                    }
                  } catch (err: any) {
                    setMessages((prev) => [...prev, { role: "assistant", content: `Send failed: ${err?.message || String(err)}` }]);
                  } finally {
                    setConfirming(false);
                    setPendingSend(null);
                  }
                }}
              >
                {confirming ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


