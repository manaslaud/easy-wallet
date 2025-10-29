import { type Request, type Response } from "express";
import { ethers } from "ethers";

export const getEthereumBalance = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const address = String(req.query.address || "");
    const network = (req.query.network as "sepolia" | "mainnet" | undefined) || "sepolia";
    const rpcUrl = req.query.rpcUrl ? String(req.query.rpcUrl) : undefined;
    if (!address) {
      res.status(400).json({ error: "Missing address" });
      return;
    }
    // Prefer explicit RPC URL, then server-specific envs, then fall back to NEXT_PUBLIC_* if provided
    const envMainnet = process.env.ETHEREUM_MAINNET_RPC_URL || process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL;
    const envSepolia = process.env.ETHEREUM_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL;
    const resolvedRpcUrl = rpcUrl || (network === "mainnet" ? envMainnet : envSepolia);
    const provider = resolvedRpcUrl ? new ethers.JsonRpcProvider(resolvedRpcUrl) : ethers.getDefaultProvider(network);
    const wei = await provider.getBalance(address);
    res.status(200).json({ wei: wei.toString(), ether: ethers.formatEther(wei) });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch Ethereum balance" });
  }
};


