"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Terminal, Code, Shield } from "lucide-react";
import { motion } from "@/components/ui/motion";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 dark:to-primary/10" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-purple-500/10 dark:from-purple-400/20 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-blue-500/10 dark:from-blue-400/20 to-transparent blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full border bg-muted/50 text-sm font-medium mb-6">
            Now in Public Beta
            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            The AI-Powered Wallet Engine for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text"> Developers</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Simplify crypto wallet management and transactions with natural language processing and 
            developer-friendly APIs for Solana and EVM chains.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="group">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              Read the Docs
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 hover:shadow-md transition-shadow">
            <Terminal className="h-10 w-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Developer-First</h3>
            <p className="text-sm text-muted-foreground">
              Built for developers with clean APIs, comprehensive docs, and flexible SDKs.
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 hover:shadow-md transition-shadow">
            <Code className="h-10 w-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Multi-Chain</h3>
            <p className="text-sm text-muted-foreground">
              Support for Solana, Ethereum and other EVM chains from a single integration.
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 hover:shadow-md transition-shadow">
            <Shield className="h-10 w-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Enterprise-Grade</h3>
            <p className="text-sm text-muted-foreground">
              Bank-level security with multi-sig approval flows and guardrails.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}