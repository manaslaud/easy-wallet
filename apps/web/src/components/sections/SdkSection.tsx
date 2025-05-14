"use client";

import { useState, useEffect } from "react";
import { motion } from "@/components/ui/motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, ChevronRight, Code, Package, Terminal } from "lucide-react";
import CodeSnippet from "@/components/ui/CodeSnippet";

export default function SdkSection() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <section id="sdk" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-25 dark:opacity-10">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plug & Play Wallet SDKs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate with just a few lines of code in your favorite programming language.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <Button
              variant="outline"
              className="bg-card/50 backdrop-blur-sm mr-4"
            >
              <Package className="mr-2 h-4 w-4" />
              Install SDK
            </Button>
            <Button
              variant="outline"
              className="bg-card/50 backdrop-blur-sm"
            >
              <Terminal className="mr-2 h-4 w-4" />
              API Reference
            </Button>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl shadow-lg p-6 pt-3">
            <Tabs defaultValue="javascript">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="rust">Rust</TabsTrigger>
                </TabsList>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
              
              <TabsContent value="javascript" className="mt-0">
                <CodeSnippet language="javascript">
{`// Install: npm install @walletron/sdk

import { Walletron } from '@walletron/sdk';

// Initialize the Walletron client
const walletron = new Walletron({
  apiKey: 'YOUR_API_KEY',
  environment: 'production' // or 'sandbox'
});

// Create a new wallet
const createWallet = async () => {
  const wallet = await walletron.wallets.create({
    name: 'My Solana Wallet',
    chain: 'solana',
  });
  
  console.log('New wallet created:', wallet.address);
  return wallet;
};

// Send tokens using the wallet
const sendTokens = async (fromWalletId, toAddress, amount) => {
  const transaction = await walletron.transactions.create({
    walletId: fromWalletId,
    to: toAddress,
    amount: amount,
    token: 'SOL',
    // Optional: Add a memo
    memo: 'Payment for services'
  });
  
  console.log('Transaction submitted:', transaction.id);
  
  // Poll for confirmation
  const result = await walletron.transactions.waitForConfirmation(transaction.id);
  console.log('Transaction confirmed:', result.hash);
};

// Natural language processing
const processNaturalLanguage = async (command) => {
  // e.g., "Send 0.5 SOL to john.sol"
  const intent = await walletron.ai.parseCommand(command);
  
  if (intent.confidence > 0.8) {
    // Execute the transaction with user confirmation
    return walletron.ai.executeIntent(intent);
  }
};`}
                </CodeSnippet>
              </TabsContent>
              
              <TabsContent value="python" className="mt-0">
                <CodeSnippet language="python">
{`# Install: pip install walletron-sdk

from walletron import Walletron

# Initialize the Walletron client
walletron = Walletron(
    api_key="YOUR_API_KEY",
    environment="production"  # or "sandbox"
)

# Create a new wallet
async def create_wallet():
    wallet = await walletron.wallets.create(
        name="My Solana Wallet",
        chain="solana"
    )
    
    print(f"New wallet created: {wallet.address}")
    return wallet

# Send tokens using the wallet
async def send_tokens(from_wallet_id, to_address, amount):
    transaction = await walletron.transactions.create(
        wallet_id=from_wallet_id,
        to=to_address,
        amount=amount,
        token="SOL",
        # Optional: Add a memo
        memo="Payment for services"
    )
    
    print(f"Transaction submitted: {transaction.id}")
    
    # Poll for confirmation
    result = await walletron.transactions.wait_for_confirmation(transaction.id)
    print(f"Transaction confirmed: {result.hash}")

# Natural language processing
async def process_natural_language(command):
    # e.g., "Send 0.5 SOL to john.sol"
    intent = await walletron.ai.parse_command(command)
    
    if intent.confidence > 0.8:
        # Execute the transaction with user confirmation
        return await walletron.ai.execute_intent(intent)
`}
                </CodeSnippet>
              </TabsContent>
              
              <TabsContent value="rust" className="mt-0">
                <CodeSnippet language="rust">
{`// Install: cargo add walletron-sdk

use walletron_sdk::{Walletron, WalletronConfig, WalletConfig, TransactionConfig};

async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize the Walletron client
    let walletron = Walletron::new(WalletronConfig {
        api_key: "YOUR_API_KEY".to_string(),
        environment: "production".to_string(), // or "sandbox"
    });
    
    // Create a new wallet
    async fn create_wallet(client: &Walletron) -> Result<(), Box<dyn std::error::Error>> {
        let wallet = client.wallets().create(WalletConfig {
            name: Some("My Solana Wallet".to_string()),
            chain: "solana".to_string(),
        }).await?;
        
        println!("New wallet created: {}", wallet.address);
        Ok(())
    }
    
    // Send tokens using the wallet
    async fn send_tokens(
        client: &Walletron,
        from_wallet_id: &str,
        to_address: &str,
        amount: f64
    ) -> Result<(), Box<dyn std::error::Error>> {
        let transaction = client.transactions().create(TransactionConfig {
            wallet_id: from_wallet_id.to_string(),
            to: to_address.to_string(),
            amount,
            token: "SOL".to_string(),
            // Optional: Add a memo
            memo: Some("Payment for services".to_string()),
        }).await?;
        
        println!("Transaction submitted: {}", transaction.id);
        
        // Poll for confirmation
        let result = client.transactions().wait_for_confirmation(&transaction.id).await?;
        println!("Transaction confirmed: {}", result.hash);
        Ok(())
    }
    
    // Natural language processing
    async fn process_natural_language(
        client: &Walletron,
        command: &str
    ) -> Result<(), Box<dyn std::error::Error>> {
        // e.g., "Send 0.5 SOL to john.sol"
        let intent = client.ai().parse_command(command).await?;
        
        if intent.confidence > 0.8 {
            // Execute the transaction with user confirmation
            client.ai().execute_intent(&intent).await?;
        }
        Ok(())
    }
    
    Ok(())
}`}
                </CodeSnippet>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div>
                <p className="text-sm font-medium mb-1">Get started with our SDK</p>
                <p className="text-sm text-muted-foreground">
                  Visit our GitHub repository for more examples and detailed documentation.
                </p>
              </div>
              <Button>
                Full Documentation
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}