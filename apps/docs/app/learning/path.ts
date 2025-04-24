import { Keypair } from "@solana/web3.js";
import { HDKey } from "micro-ed25519-hdkey";
import * as bip39 from "bip39";

// The BIP39 mnemonic (should be securely stored/retrieved in practice)
const mnemonic =
  "neither lonely flavor argue grass remind eye tag avocado spot unusual intact";

// Convert the mnemonic to a seed
const seed = bip39.mnemonicToSeedSync(mnemonic, "");
const hd = HDKey.fromMasterSeed(seed.toString("hex"));

// Define the account index (0 in this case)
const accountIndex = 0; 

// Create multiple wallets within the same account
const numWallets = 5; // Create 5 wallets

for (let i = 0; i < numWallets; i++) {
  // Derive the path for each wallet
  const path = `m/44'/501'/${i}'/${accountIndex}'`; // Vary the final index for multiple wallets
  
  // Derive the keypair from the seed for this path
  const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
  
  // Log the public key of the derived keypair
  console.log(`Wallet ${i} Public Key: ${keypair.publicKey.toBase58()}`);
}
