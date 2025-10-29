import { useState } from "react";

type ContactLite = { id: string; label: string; address: string };

export default function TransferForm({
  title,
  onSubmit,
  pending,
  resultLabel,
  result,
  error,
  contacts,
  onSaveContact,
}: {
  title: string;
  onSubmit: (to: string, amount: string) => void;
  pending: boolean;
  resultLabel: string;
  result?: string;
  error?: string;
  contacts?: ContactLite[];
  onSaveContact?: (label: string, address: string) => void | Promise<void>;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const onPickContact = (id: string) => {
    const c = contacts?.find((x) => x.id === id);
    if (c) setTo(c.address);
  };

  const saveContact = async () => {
    if (!onSaveContact || !to || !label) return;
    setSaving(true);
    try {
      await onSaveContact(label, to);
      setLabel("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="font-medium">{title}</div>
      {contacts && contacts.length > 0 && (
        <select
          className="border border-gray-300 rounded p-2"
          onChange={(e) => onPickContact(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select contact (optional)
          </option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label} · {c.address.slice(0, 6)}...{c.address.slice(-4)}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        className="border border-gray-300 rounded p-2"
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-300 rounded p-2"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {onSaveContact && (
        <div className="grid gap-2 border border-gray-200 rounded p-2">
          <div className="text-xs text-gray-500">Save recipient as contact</div>
          <input
            type="text"
            className="border border-gray-300 rounded p-2"
            placeholder="Contact label (e.g. Alice Treasury)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button
            disabled={!to || !label || saving}
            onClick={saveContact}
            className="px-3 py-2 rounded bg-gray-800 text-white disabled:opacity-50 w-fit"
          >
            {saving ? "Saving..." : "Save contact"}
          </button>
        </div>
      )}
      <button
        disabled={!to || !amount || pending}
        onClick={() => onSubmit(to, amount)}
        className="px-3 py-2 rounded bg-black text-white disabled:opacity-50 w-fit"
      >
        {pending ? "Sending..." : "Send"}
      </button>
      {result && (
        <div className="text-xs text-green-500 break-all">
          {resultLabel}: {result}
        </div>
      )}
      {error && <div className="text-xs text-red-500 break-all">{error}</div>}
    </div>
  );
}
