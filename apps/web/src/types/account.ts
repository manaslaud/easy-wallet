//keypair is called a wallet
export interface KeyPair {
  publicKey: string; // base58 encoded
  privateKey: string; // encrypted
  derivationPath: string;
  chain: "solana" | "ethereum";
  address: string;
}

//account is a group of keypairs/wallets
export interface Account {
  id: string; // uuid
  label?: string; // optional user label
  keyPairs: KeyPair[]; // multiple keypairs for different chains
  createdAt: Date;
  solanaKeyPairs: number;
  ethereumKeyPairs: number;
}
