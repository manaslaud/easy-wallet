"use client";

import { useState, useEffect } from "react";
import { motion } from "@/components/ui/motion";
import Image from "next/image";
import { AlertCircle, BrainCircuit, Cpu, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function McpSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="mcp" className="py-20 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Model Context Protocol Integration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Securely integrate LLMs with your wallet infrastructure for natural language control.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="order-2 lg:order-1">
            <Card className="border-2 overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold mb-2">Natural Language Flow</h3>
                <p className="text-sm text-muted-foreground">
                  How the Model Context Protocol enables secure AI-driven wallet operations
                </p>
              </div>
              <div className="p-6 overflow-hidden">
                <pre className="text-xs overflow-auto p-4 bg-muted rounded-md">
{`sequenceDiagram
    participant User
    participant App
    participant LLM as LLM Service
    participant MCP as MCP Server
    participant WR as Walletron API
    
    User->>App: "Send 0.5 SOL to John"
    App->>LLM: Request with context
    LLM->>MCP: Parse intent via MCP
    MCP->>WR: Resolve "John" to wallet
    WR-->>MCP: Return john.sol
    MCP->>LLM: Provide wallet context
    LLM-->>App: Structured transaction intent
    App->>User: "Confirm send 0.5 SOL to john.sol?"
    User->>App: Confirms
    App->>WR: Execute transaction
    WR-->>App: Transaction confirmation
    App->>User: Display transaction status`}
                </pre>
              </div>
            </Card>
          </div>
          
          <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-2xl font-semibold">
              How Model Context Protocol Works
            </h3>
            
            <p className="text-muted-foreground">
              The Model Context Protocol (MCP) creates a secure bridge between large language models 
              and your wallet infrastructure, enabling natural language interactions while maintaining 
              strict security controls.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Structured Intent Parsing</h4>
                  <p className="text-sm text-muted-foreground">
                    Translates natural language commands into structured transaction intents with validation guardrails.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Security Boundaries</h4>
                  <p className="text-sm text-muted-foreground">
                    Creates well-defined permission boundaries that limit what AI can do without explicit user confirmation.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Context Resolution</h4>
                  <p className="text-sm text-muted-foreground">
                    Safely resolves contextual entities like contact names to wallet addresses and token symbols.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Safety Guardrails</h4>
                  <p className="text-sm text-muted-foreground">
                    Built-in anomaly detection flags unusual transaction patterns for additional verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}