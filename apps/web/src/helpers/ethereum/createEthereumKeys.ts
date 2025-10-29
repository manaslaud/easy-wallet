/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from "ethers";
import { KeyPair } from "@/types/account";
import { encrypt, packEncryptedPayload } from "../encryption";
import { _BASE_ETHEREUM_WALLET_PATH } from "@/constants/wallet";

//creating the base keys
export async function createBaseEthereumKeys(
  mneuonic: string,
  passowrd: string
) {
  //   const seed = mnemonicToSeedSync(mneumonic, passowrd);
  const ethersCompatibleMnemonic = ethers.Mnemonic.fromPhrase(mneuonic);
  const wallet = ethers.HDNodeWallet.fromMnemonic(
    ethersCompatibleMnemonic,
    _BASE_ETHEREUM_WALLET_PATH
  );
  const enc = await encrypt(passowrd, wallet.privateKey);
  const encryptedPvtKey = packEncryptedPayload({
    cipherHex: enc.res,
    salt: enc.DK.salt,
    iv: enc.DK.iv,
  });
  const keypair: KeyPair = {
    publicKey: wallet.publicKey,
    privateKey: encryptedPvtKey, // encrypted
    derivationPath: _BASE_ETHEREUM_WALLET_PATH,
    chain: "ethereum",
    address: wallet.address,
  };
  return keypair;
}
