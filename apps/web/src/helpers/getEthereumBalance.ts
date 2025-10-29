import { ethers } from "ethers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getEthereumBalance(
  address: string,
  opts?: { network?: "sepolia" | "mainnet"; rpcUrl?: string }
) {
  // Next, use an explicit RPC URL if provided
  if (opts?.rpcUrl) {
    const provider = new ethers.JsonRpcProvider(opts.rpcUrl);
    const balance = await provider.getBalance(address);
    return { wei: balance.toString(), ether: ethers.formatEther(balance) };
  }

  // Then, use env-configured public RPC per selected network
  if (opts?.network) {
    const resolvedRpcUrl =
      opts?.network === "sepolia"
        ? process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL
        : process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL;
    const provider = resolvedRpcUrl
      ? new ethers.JsonRpcProvider(resolvedRpcUrl)
      : ethers.getDefaultProvider(opts.network);
    const balance = await provider.getBalance(address);
    return { wei: balance.toString(), ether: ethers.formatEther(balance) };
  }

  // Final fallback: try the server API (may be blocked by CORS)
  const url = new URL(`${API_BASE}/balances/ethereum`);
  url.searchParams.set("address", address);
  url.searchParams.set("network", opts?.network || "sepolia");
  if (opts?.rpcUrl) url.searchParams.set("rpcUrl", opts.rpcUrl);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch Ethereum balance");
  return (await res.json()) as { wei: string; ether: string };
}


