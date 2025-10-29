"use client";
import { useEffect, useState } from "react";
import type { Contact, Chain } from "@/types/contact";
import { listContacts as apiListContacts, createContact as apiCreateContact } from "@/helpers/contacts";

export default function Contacts({
  title,
  userAccountId,
  chain,
  network,
}: {
  title: string;
  userAccountId: string;
  chain: Chain;
  network: string;
}) {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const key = `${userAccountId}|${chain}|${network}`;

  const reload = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const list = await apiListContacts({ userAccountId, chain, network });
      setItems(list);
    } catch (e: any) {
      setError(e?.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const onSave = async () => {
    if (!label || !address) return;
    setSaving(true);
    try {
      await apiCreateContact({ userAccountId, chain, network, address, label });
      setLabel("");
      setAddress("");
      await reload();
    } catch (e: any) {
      setError(e?.message || "Failed to create contact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-medium">{title}</div>
        <button
          onClick={reload}
          className="px-2 py-1 text-xs rounded bg-zinc-900 text-white"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-2">
        <input
          type="text"
          className="border border-gray-300 rounded p-2"
          placeholder="Label (e.g. Alice Treasury)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          type="text"
          className="border border-gray-300 rounded p-2 md:col-span-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div>
          <button
            onClick={onSave}
            disabled={!label || !address || saving}
            className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Add contact"}
          </button>
        </div>
      </div>

      {error && <div className="text-xs text-red-500 break-all">{error}</div>}

      <div className="grid gap-2">
        {items.length === 0 ? (
          <div className="text-sm text-zinc-500">No contacts yet.</div>
        ) : (
          <div className="grid gap-2">
            {items.map((c) => (
              <div key={c.id} className="rounded border border-zinc-800 p-3 flex items-center justify-between gap-3">
                <div className="grid gap-1">
                  <div className="text-sm font-medium">{c.label}</div>
                  <div className="text-xs text-zinc-500 break-all">{c.address}</div>
                </div>
                <div className="text-xs text-zinc-500">{c.network}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


