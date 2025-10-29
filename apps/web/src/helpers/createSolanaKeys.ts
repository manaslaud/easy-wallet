/* eslint-disable @typescript-eslint/no-unused-vars */
//creating an HD wallet based on the mneumonic generated
import { mnemonicToSeedSync } from "./bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { KeyPair } from "../types/account";
import { _BASE_SOLANA_WALLET_PATH } from "../constants/wallet";
import { encrypt, packEncryptedPayload } from "./encryption";
import bs58 from "bs58";
import { Keypair as SolanaKeypair } from "@solana/web3.js";

//password is the user password/ wallet password for the entire service, creating from the base path
export const createBaseSolanaKeys = async (mneumonic: string, passowrd: string) => {
  const seed = mnemonicToSeedSync(mneumonic, passowrd);
  const hdkey = HDKey.fromMasterSeed(seed);
  const derivedKey = hdkey.derive(_BASE_SOLANA_WALLET_PATH);
  const pvtKeyHex=derivedKey.privateKey.toHex();
  const enc = await encrypt(passowrd, pvtKeyHex);
  const encryptedPvtKey = packEncryptedPayload({
    cipherHex: enc.res,
    salt: enc.DK.salt,
    iv: enc.DK.iv,
  });
  // Derive the canonical Solana public key from the 32-byte seed
  const seedBytes = hexToUint8Array(pvtKeyHex);
  const solanaKeypair = SolanaKeypair.fromSeed(seedBytes);
  const publicKeyBytes = solanaKeypair.publicKey.toBytes();
  const publicKeyHex = uint8ArrayToHex(publicKeyBytes);
  const addressBase58 = solanaKeypair.publicKey.toBase58();

  const keypair: KeyPair = {
    publicKey: publicKeyHex,
    privateKey: encryptedPvtKey,
    derivationPath: _BASE_SOLANA_WALLET_PATH,
    chain: "solana",
    address: addressBase58,
  };
  return keypair;
};

function hexToUint8Array(hex: string): Uint8Array {
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    array[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return array;
}

function uint8ArrayToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}
