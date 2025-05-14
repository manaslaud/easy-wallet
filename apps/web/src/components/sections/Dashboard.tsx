"use client";

import { useEffect, useState } from "react";
import { motion } from "@/components/ui/motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wallet, Copy, Clipboard, RefreshCcw, Plus, ChevronDown, 
  Eye, EyeOff, Search, Key, MoreHorizontal
} from "lucide-react";
import WalletCard from "@/components/ui/WalletCard";
import TransactionList from "@/components/ui/TransactionList";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="dashboard" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern bg-muted/20 opacity-25 dark:opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All Your Crypto Infrastructure in One Place
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Manage wallet assets, transactions, and API keys with a developer-friendly dashboard.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border rounded-xl bg-card shadow-lg overflow-hidden"
        >
          <div className="border-b p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">Developer Dashboard</h3>
              <p className="text-sm text-muted-foreground">Manage all your wallet operations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="pl-9 w-full sm:w-[250px]" 
                />
              </div>
              <Button>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="wallets" className="p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="wallets">Wallets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="api">API Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallets" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-medium">Connected Wallets</h4>
                <Button className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Connect New Wallet
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <WalletCard 
                  chain="solana"
                  address="5zxs7M2R5BP4i9zeJu5S9bTZFkz5uUHYbXrfUNgFT3rM"
                  balance="123.45"
                  usdValue="5,829.32"
                  tokens={[
                    { symbol: "SOL", balance: "123.45", value: "5,829.32" },
                    { symbol: "USDC", balance: "500.00", value: "500.00" },
                    { symbol: "RAY", balance: "1,250.00", value: "637.50" }
                  ]}
                />
                
                <WalletCard 
                  chain="ethereum"
                  address="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                  balance="3.72"
                  usdValue="8,267.40"
                  tokens={[
                    { symbol: "ETH", balance: "3.72", value: "8,267.40" },
                    { symbol: "USDT", balance: "1,050.00", value: "1,050.00" },
                    { symbol: "LINK", balance: "75.00", value: "937.50" }
                  ]}
                />
                
                <div className="flex h-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-full border-dashed flex flex-col items-center justify-center p-8 hover:bg-muted/50"
                  >
                    <Plus className="h-10 w-10 mb-3 text-muted-foreground" />
                    <span className="text-lg font-medium">Add Wallet</span>
                    <span className="text-sm text-muted-foreground mt-1">Connect to any chain</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-medium">Recent Transactions</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Filter
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
              
              <TransactionList />
            </TabsContent>
            
            <TabsContent value="api" className="mt-0">
              <Card className="border-none shadow-none bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">API Keys</h4>
                    <Button>
                      <Key className="h-4 w-4 mr-2" />
                      Generate New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-card rounded-lg border p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">Production Key</p>
                          <p className="text-sm text-muted-foreground">Created 30 days ago</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type={apiKeyVisible ? "text" : "password"} 
                          value="wlt_prod_a1b2c3d4e5f6g7h8i9j0" 
                          readOnly
                          className="font-mono"
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setApiKeyVisible(!apiKeyVisible)}
                        >
                          {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-card rounded-lg border p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-medium">Test Key</p>
                          <p className="text-sm text-muted-foreground">Created 30 days ago</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="text" 
                          value="wlt_test_z9y8x7w6v5u4t3s2r1q0" 
                          readOnly
                          className="font-mono"
                        />
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-medium mb-2">SDK Integration</h5>
                    <div className="bg-card border rounded-md p-3 font-mono text-sm overflow-x-auto">
                      <pre>
                        {`import { Walletron } from '@walletron/sdk';

const walletron = new Walletron({ 
  apiKey: 'wlt_prod_a1b2c3d4e5f6g7h8i9j0' 
});`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}