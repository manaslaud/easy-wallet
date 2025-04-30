import Dexie, { type EntityTable } from "dexie";
import { DerivationKey, Account, KeyPair } from "@/types/account";

const db = new Dexie("EasyWallet") as Dexie & {
  derivationKey: EntityTable<DerivationKey>;
  account: EntityTable<Account>;
  keyPair: EntityTable<KeyPair>;
};

db.version(1).stores({
  derivationKey: "", // No indexable key 
  account: "&id, createdAt", // Primary key is `id`, and we can index `createdAt` if needed
  keyPair: "&address, chain, derivationPath", // Primary key is `address`, indexed by `chain` and `derivationPath`
});
