import { PublicKey } from "@solana/web3.js";
import { createSolanaConnection } from "@/helpers/createSolanaConnection";

export async function getSolanaBalance(
  address: string,
  network: "devnet" | "testnet" | "mainnet-beta" = "devnet"
) {
  const conn = createSolanaConnection(network);
  const lamports = await conn.getBalance(new PublicKey(address));
  return { lamports, sol: lamports / 1_000_000_000 };
}


