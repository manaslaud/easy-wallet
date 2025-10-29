import type { Account } from "@/types/account";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type PublicKeyPair = {
  publicKey: string;
  derivationPath: string;
  chain: "solana" | "ethereum";
  address: string;
};

export type PublicAccount = {
  id: string;
  keyPairs: PublicKeyPair[];
  createdAt: string; // send as ISO string; server coerces to Date
  solanaKeyPairs: number;
  ethereumKeyPairs: number;
};

export async function saveAccountPublic(account: Account): Promise<void> {
  const payload: PublicAccount = {
    id: account.id,
    keyPairs: account.keyPairs.map(({ publicKey, derivationPath, chain, address }) => ({
      publicKey,
      derivationPath,
      chain,
      address,
    })),
    createdAt: new Date(account.createdAt).toISOString(),
    solanaKeyPairs: account.solanaKeyPairs,
    ethereumKeyPairs: account.ethereumKeyPairs,
  };

  const res = await fetch(`${API_BASE}/createUserAccount`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userAcc: payload }),
  });
  if (!res.ok) {
    // Do not block UX; log error
    console.error("Failed to persist account metadata to server", await res.text());
  }
}


