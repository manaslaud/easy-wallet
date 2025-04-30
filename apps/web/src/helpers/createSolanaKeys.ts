/* eslint-disable @typescript-eslint/no-unused-vars */
//creating an HD wallet based on the mneumonic generated
import { mnemonicToSeedSync } from "./bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { KeyPair } from "../types/account";
import { _BASE_SOLANA_WALLET_PATH } from "../constants/wallet";
import { encrypt } from "./encryption";
import bs58 from 'bs58'

//password is the user password/ wallet password for the entire service, creating from the base path
export const createBaseSolanaKeys = async (mneumonic: string, passowrd: string) => {
  const seed = mnemonicToSeedSync(mneumonic, passowrd);
  const hdkey = HDKey.fromMasterSeed(seed);
  const derivedKey = hdkey.derive(_BASE_SOLANA_WALLET_PATH);
  const pvtKeyHex=derivedKey.privateKey.toHex();
  const encryptedPvtKey= (await encrypt(passowrd,pvtKeyHex)).res
  const keypair: KeyPair = {
    publicKey:derivedKey.publicKey.toHex(),
    privateKey:encryptedPvtKey,
    derivationPath:_BASE_SOLANA_WALLET_PATH,
    chain:"solana",
    address:bs58.encode(derivedKey.publicKey)
  };
  return keypair;
};
