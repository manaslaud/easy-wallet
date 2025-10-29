
export default function TransferForm({
    title,
    onSubmit,
    pending,
    resultLabel,
    result,
    error,
  }: {
    title: string;
    onSubmit: (to: string, amount: string) => void;
    pending: boolean;
    resultLabel: string;
    result?: string;
    error?: string;
  }) {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");
    return (
      <div className="grid gap-2">
        <div className="font-medium">{title}</div>
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
  
  