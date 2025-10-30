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
          lines.push("Sending transaction...");
          try {
            if (chain === "ethereum" && sendEth) {
              const hash = await sendEth(to, amount);
              lines.push(`Sent. Tx: ${hash}`);
            } else if (chain === "solana" && sendSol) {
              const sig = await sendSol(to, amount);
              lines.push(`Sent. Signature: ${sig}`);
            } else {
              lines.push("Unsupported chain.");
            }
          } catch (err: any) {
            lines.push(`Send failed: ${err?.message || String(err)}`);
          }
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
    </div>
  );
}


