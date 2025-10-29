import { db } from "./db";
import type { Account } from "@/types/account";

export async function upsertAccount(account: Account) {
  await db.account.put(account);
}

export async function listAccounts(): Promise<Account[]> {
  const items = await db.account.toArray();
  // Newest first
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}


