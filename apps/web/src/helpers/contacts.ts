import type { Contact, Chain } from "@/types/contact";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function listContacts(params: {
  userAccountId: string;
  chain: Chain;
  network: string;
}): Promise<Contact[]> {
  const url = new URL(`${API_BASE}/contacts`);
  url.searchParams.set("userAccountId", params.userAccountId);
  url.searchParams.set("chain", params.chain);
  url.searchParams.set("network", params.network);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to list contacts");
  return (await res.json()) as Contact[];
}

export async function createContact(params: {
  userAccountId: string;
  chain: Chain;
  network: string;
  address: string;
  label: string;
}): Promise<Contact> {
  const res = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact: params }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to create contact");
  }
  return (await res.json()) as Contact;
}


