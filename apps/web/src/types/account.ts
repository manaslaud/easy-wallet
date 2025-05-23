//keypair is called a wallet
export interface KeyPair {
  publicKey: string; // hex encoded for solana and compressed ethereum public key 
  privateKey: string; // encrypted
  derivationPath: string;
  chain: "solana" | "ethereum";
  address: string;
}

export interface DerivationKey {
  salt: Uint8Array<ArrayBuffer>;
  iv:Uint8Array<ArrayBuffer>;
  iterations: number;
  keylen: number;
  derivationKey:CryptoKey
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
