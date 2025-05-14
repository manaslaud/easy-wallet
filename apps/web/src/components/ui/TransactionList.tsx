import { useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Clock3, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "tx1",
    type: "send",
    amount: "2.5",
    token: "SOL",
    value: "118.25",
    to: "john.sol",
    from: "My Wallet",
    timestamp: "2023-06-15T14:30:00Z",
    status: "confirmed",
    chain: "solana",
  },
  {
    id: "tx2",
    type: "receive",
    amount: "500",
    token: "USDC",
    value: "500.00",
    from: "alice.sol",
    to: "My Wallet",
    timestamp: "2023-06-14T10:15:00Z",
    status: "confirmed",
    chain: "solana",
  },
  {
    id: "tx3",
    type: "send",
    amount: "0.75",
    token: "ETH",
    value: "1,665.75",
    to: "0x1234...5678",
    from: "My Wallet",
    timestamp: "2023-06-12T09:45:00Z",
    status: "confirmed",
    chain: "ethereum",
  },
  {
    id: "tx4",
    type: "receive",
    amount: "150",
    token: "RAY",
    value: "76.50",
    from: "0xabcd...efgh",
    to: "My Wallet",
    timestamp: "2023-06-10T16:20:00Z",
    status: "pending",
    chain: "solana",
  },
  {
    id: "tx5",
    type: "send",
    amount: "100",
    token: "USDT",
    value: "100.00",
    to: "bob.sol",
    from: "My Wallet",
    timestamp: "2023-06-08T11:05:00Z",
    status: "confirmed",
    chain: "solana",
  },
];

export default function TransactionList() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">From/To</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Chain</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr 
                key={tx.id} 
                className="border-t hover:bg-muted/20 transition-colors"
                onMouseEnter={() => setHoveredRow(tx.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {tx.type === "send" ? (
                      <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded-full mr-2">
                        <ArrowUp className="h-4 w-4 text-red-500" />
                      </div>
                    ) : (
                      <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <ArrowDown className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    <span className="font-medium capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium">
                      {tx.type === "send" ? "-" : "+"}{tx.amount} {tx.token}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      ${tx.value} USD
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    {tx.type === "send" ? (
                      <>
                        <div className="text-xs text-muted-foreground">To</div>
                        <div>{tx.to}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div>{tx.from}</div>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div>{formatDate(tx.timestamp)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(tx.timestamp)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {tx.status === "confirmed" ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Confirmed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      <Clock3 className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className="capitalize">
                    {tx.chain}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      hoveredRow === tx.id ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-muted/30 px-4 py-3 flex justify-between border-t">
        <Button variant="outline" size="sm">Previous</Button>
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">1-5</span> of <span className="font-medium">28</span> transactions
        </div>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  );
}