"use client";

export function SolanaNetworkSelector({
  value,
  onChange,
}: {
  value: "devnet" | "testnet" | "mainnet-beta";
  onChange: (v: "devnet" | "testnet" | "mainnet-beta") => void;
}) {
  return (
    <div className="grid gap-1">
      <label className="text-sm">Solana network</label>
      <select
        className="border border-gray-300 rounded p-2 bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
      >
        <option className="bg-black text-white" value="devnet">devnet</option>
        <option className="bg-black text-white" value="testnet">testnet</option>
        <option className="bg-black text-white" value="mainnet-beta">mainnet-beta</option>
      </select>
    </div>
  );
}

export function EthereumNetworkSelector({
  value,
  onChange,
  rpcUrl,
  onRpcUrlChange,
}: {
  value: "sepolia" | "mainnet";
  onChange: (v: "sepolia" | "mainnet") => void;
  rpcUrl?: string;
  onRpcUrlChange?: (s: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <label className="text-sm">Ethereum network</label>
        <select
          className="border border-gray-300 rounded p-2 bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value as any)}
        >
          <option className="bg-black text-white" value="sepolia">sepolia</option>
          <option className="bg-black text-white" value="mainnet">mainnet</option>
        </select>
      </div>
      {onRpcUrlChange && (
        <div className="grid gap-1">
          <label className="text-sm">Custom RPC (optional)</label>
          <input
            type="text"
            className="border border-gray-300 rounded p-2"
            placeholder="https://..."
            value={rpcUrl || ""}
            onChange={(e) => onRpcUrlChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}


