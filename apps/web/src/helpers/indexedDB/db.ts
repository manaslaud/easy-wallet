import Dexie, { type EntityTable } from "dexie";
import { DerivationKey, Account, KeyPair } from "@/types/account";

const db = new Dexie("EasyWallet") as Dexie & {
  derivationKey: EntityTable<DerivationKey>;
  account: EntityTable<Account>;
  keyPair: EntityTable<KeyPair>;
  encryptedMnemonic: EntityTable<string>; 
};

db.version(1).stores({
  derivationKey: "&id", // primary key has a default value = "default"
  account: "&id, createdAt", // Primary key is `id`, and we can index `createdAt` if needed
  keyPair: "&address, chain, derivationPath", // Primary key is `address`, indexed by `chain` and `derivationPath`
  encryptedMnemonic: "&id", // primary key has a default value = "default"
});

export {db};