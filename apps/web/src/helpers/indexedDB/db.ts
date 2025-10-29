import Dexie, { type EntityTable } from "dexie";
import { DerivationKey, Account, KeyPair } from "@/types/account";

const db = new Dexie("EasyWallet") as Dexie & {
  derivationKey: EntityTable<DerivationKey>;
  account: EntityTable<Account>;
  keyPair: EntityTable<KeyPair>;
  encryptedMnemonic: EntityTable<{ id: string; value: string }>;
};

db.version(1).stores({
  derivationKey: "&id",
  account: "&id, createdAt",
  keyPair: "&address, chain, derivationPath",
  encryptedMnemonic: "&id",
});

export {db};