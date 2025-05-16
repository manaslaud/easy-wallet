import { useState } from "react";
import Image from "next/image";
import { 
  Copy, MoreHorizontal, ExternalLink, 
  ChevronDown, ChevronUp, RefreshCcw 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Token {
  symbol: string;
  balance: string;
  value: string;
}

interface WalletCardProps {
  chain: "solana" | "ethereum" | "polygon" | "avalanche" | "binance";
  address: string;
  balance: string;
  usdValue: string;
  tokens: Token[];
}

const chainIcons = {
  solana: "/solana-logo.svg",
  ethereum: "/ethereum-logo.svg",
  polygon: "/polygon-logo.svg",
  avalanche: "/avalanche-logo.svg",
  binance: "/binance-logo.svg",
};

const chainColors = {
  solana: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  ethereum: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  polygon: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  avalanche: "bg-red-500/10 text-red-500 border-red-500/20",
  binance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

export default function WalletCard({
  chain,
  address,
  balance,
  usdValue,
  tokens,
}: WalletCardProps) {
  const [expanded, setExpanded] = useState(false);

  const truncateAddress = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getChainLabel = (chain: string) => {
    return chain.charAt(0).toUpperCase() + chain.slice(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className={cn("capitalize", chainColors[chain])}>
            {getChainLabel(chain)}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
              {truncateAddress(address)}
            </code>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Balance</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">{balance}</span>
            {chain === "solana" && <span className="ml-1 text-lg">SOL</span>}
            {chain === "ethereum" && <span className="ml-1 text-lg">ETH</span>}
          </div>
          <p className="text-sm text-muted-foreground">≈ ${usdValue} USD</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Hide Tokens" : "Show Tokens"}
              {expanded ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : (
                <ChevronDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs flex items-center gap-1"
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="bg-muted/30 px-5 py-3 border-t">
          <p className="text-xs font-medium mb-2">Tokens</p>
          <div className="space-y-2">
            {tokens.map((token, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2">
                    <span className="text-xs font-medium">{token.symbol.charAt(0)}</span>
                  </div>
                  <span className="text-sm">{token.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{token.balance}</p>
                  <p className="text-xs text-muted-foreground">${token.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}