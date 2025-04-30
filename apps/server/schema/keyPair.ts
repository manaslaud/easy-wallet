import { z } from "zod";

export const KeyPairSchema = z.object({
  publicKey: z.string().min(1, "Public key cannot be empty"), // Public key as a string (e.g., hex encoded)
  derivationPath: z.string().min(1, "Derivation path cannot be empty"), // Derivation path (e.g., m/44'/60'/0'/0/0)
  chain: z.enum(["solana", "ethereum"]), // Chain (either 'solana' or 'ethereum')
  address: z.string().min(1, "Address cannot be empty"), // Address (e.g., wallet address on the respective blockchain)
});

export type KeyPair = z.infer<typeof KeyPairSchema>;
