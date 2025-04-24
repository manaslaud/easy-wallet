//first, setup random seed, only english for now
import bip39 from "bip39";
bip39.setDefaultWordlist("english");

export const getMneumonic = () => bip39.generateMnemonic(128);
export const validateMnemonic = (mnemonic: string) =>
  bip39.validateMnemonic(mnemonic);
export const mnemonicToSeed = (mnemonic: string) =>
  bip39.mnemonicToSeed(mnemonic);
export const mnemonicToEntropy = (mnemonic: string) =>
  bip39.mnemonicToEntropy(mnemonic);
export const entropyToMnemonic = (entropy: string) =>
  bip39.entropyToMnemonic(entropy);
export const mnemonicToSeedSync = (mnemonic: string, password: string) =>
  bip39.mnemonicToSeedSync(mnemonic, password);
