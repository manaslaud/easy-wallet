//creating an HD wallet based on the mneumonic generated
import { mnemonicToSeedSync } from "./bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { KeyPair } from "../types/account";
import { _BASE_SOLANA_WALLET_PATH } from "../constants/wallet";

//password is the user password/ wallet password for the entire service, creating from the base path
const createBaseSolanaKeys = (mneumonic: string, passowrd: string) => {
  const seed = mnemonicToSeedSync(mneumonic, passowrd);
  const hdkey = HDKey.fromMasterSeed(seed);
  const derivedKey = hdkey.derive(_BASE_SOLANA_WALLET_PATH);
  return derivedKey;
};
