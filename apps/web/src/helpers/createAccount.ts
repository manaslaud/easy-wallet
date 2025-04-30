/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from "@/types/account";
import { createBaseSolanaKeys } from "./createSolanaKeys";
import { createBaseEthereumKeys } from "./ethereum/createEthereumKeys";
import { getMneumonic } from "./bip39";

/*
working: 
1. using the password provided, create a derviation key object
2. create a mneumonic and encrypt it with the password
3. store the encrypted mneumonic in the indexDB
4. create a base solana keypair and encrypt it with the password
5. create a base ethereum keypair and encrypt it with the password
6. create a base account object with the keypairs and mneumonic
7. store the account object in the indexDB 
*/

export const createBaseAccount = async (password: string, label: string) => {
  const mneumonic = getMneumonic();
  const solanaKeyPair = await createBaseSolanaKeys(mneumonic, password);
  const ethereumKeyPair = await createBaseEthereumKeys(mneumonic, password);
  const account: Account = {
    id: crypto.randomUUID(),
    label: label,
    keyPairs: [solanaKeyPair, ethereumKeyPair],
    createdAt: new Date(),
    solanaKeyPairs: 1,
    ethereumKeyPairs: 1,
  };
  return account;
};
