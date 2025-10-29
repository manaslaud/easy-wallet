import { type Request, type Response } from "express";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const getSolanaBalance = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const address = String(req.query.address || "");
    const network = (String(req.query.network || "devnet") as "devnet" | "testnet" | "mainnet-beta");
    const rpcUrl = req.query.rpcUrl ? String(req.query.rpcUrl) : undefined;
    if (!address) {
      res.status(400).json({ error: "Missing address" });
      return;
    }
    const endpoint = rpcUrl || clusterApiUrl(network);
    const conn = new Connection(endpoint, "confirmed");
    const lamports = await conn.getBalance(new PublicKey(address));
    res.status(200).json({ lamports, sol: lamports / 1_000_000_000 });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch Solana balance" });
  }
};


