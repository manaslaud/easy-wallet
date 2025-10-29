export type Chain = "solana" | "ethereum";

export interface Contact {
  id: string;
  userAccountId: string;
  chain: Chain;
  network: string;
  address: string;
  label: string;
  createdAt: string;
}


