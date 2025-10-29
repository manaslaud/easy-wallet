import { Connection, clusterApiUrl } from "@solana/web3.js";

export function createSolanaConnection(network: "devnet" | "mainnet-beta" | "testnet" = "devnet") {
  const endpoint = clusterApiUrl(network);
  return new Connection(endpoint, {
    commitment: "confirmed",
  });
}


