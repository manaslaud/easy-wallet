import { Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createSolanaConnection } from "./createSolanaConnection";
import { decryptPacked } from "./encryption";

export async function sendSolanaTransaction(params: {
  password: string;
  packedEncryptedPrivateKey: string; // packed string from packEncryptedPayload
  toAddressBase58: string;
  lamports: number; // 1 SOL = 1_000_000_000 lamports
  network?: "devnet" | "mainnet-beta" | "testnet";
}) {
  const { password, packedEncryptedPrivateKey, toAddressBase58, lamports, network = "devnet" } = params;

  const privateKeyHex = await decryptPacked(password, packedEncryptedPrivateKey);
  const privateKeyBytes = hexToUint8Array(privateKeyHex);
  if (privateKeyBytes.length !== 32) {
    throw new Error("Expected 32-byte ed25519 seed for Solana");
  }

  const fromKeypair = Keypair.fromSeed(privateKeyBytes);
  const connection = createSolanaConnection(network);

  const toPublicKey = await import("@solana/web3.js").then(m => new m.PublicKey(toAddressBase58));
  const instruction = SystemProgram.transfer({
    fromPubkey: fromKeypair.publicKey,
    toPubkey: toPublicKey,
    lamports,
  });
  const transaction = new Transaction().add(instruction);
  // console.log(transaction.lo);

  const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
  return { signature };
}

function hexToUint8Array(hex: string): Uint8Array {
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    array[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return array;
}


