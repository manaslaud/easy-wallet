"use client";

import { useState, useEffect } from "react";
import { motion } from "@/components/ui/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type TransactionStatus = {
  hash: string;
  status: "pending" | "confirmed";
  confirmations: number;
  timestamp: Date;
};

export default function ChatInterface() {
  const [mounted, setMounted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: "Send 0.5 SOL to John",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      type: "assistant",
      content: "I'll send 0.5 SOL to John (wallet: john.sol). Is this correct?",
      timestamp: new Date(Date.now() - 50000),
    },
    {
      id: "3",
      type: "user",
      content: "Yes, please proceed",
      timestamp: new Date(Date.now() - 40000),
    },
    {
      id: "4",
      type: "assistant",
      content: "Great! I'm initiating a transaction to send 0.5 SOL (≈$23.65) to John's wallet. This will be processed on the Solana network.",
      timestamp: new Date(Date.now() - 30000),
    }
  ]);
  
  const [transaction, setTransaction] = useState<TransactionStatus>({
    hash: "3gUJYkJUDZZTLnJJ1MJv4qhpvnCZEK7P2zJ9FUJwTJ3n",
    status: "confirmed",
    confirmations: 32,
    timestamp: new Date(Date.now() - 25000),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: inputValue,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");
      
      // Simulate assistant response after a delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "I'll process that request for you. Can you confirm you'd like to proceed?",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }
  };

  if (!mounted) return null;

  return (
    <section id="chat" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Natural Language Wallet Control
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interact with your wallets using simple commands in natural language, powered by LLMs.
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-auto mb-4 pr-2 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`flex items-start gap-3 max-w-[80%] ${
                          message.type === "user" 
                            ? "flex-row-reverse" 
                            : "flex-row"
                        }`}
                      >
                        <Avatar className={message.type === "assistant" ? "mt-0.5" : "hidden"}>
                          <AvatarImage src="/avatar-bot.png" alt="Walletron" />
                          <AvatarFallback className="bg-primary text-primary-foreground">WR</AvatarFallback>
                        </Avatar>
                        
                        <div 
                          className={`rounded-2xl px-4 py-2.5 text-sm ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted border"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Transaction status card */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] w-full">
                      <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Transaction
                            </Badge>
                            {transaction.status === "confirmed" ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                <Clock className="mr-1 h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Transaction</div>
                            <div className="flex items-center">
                              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                {transaction.hash.substring(0, 16)}...{transaction.hash.substring(transaction.hash.length - 4)}
                              </code>
                              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Amount</div>
                              <div className="font-medium">0.5 SOL</div>
                              <div className="text-xs text-muted-foreground">≈ $23.65 USD</div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground mb-1">Recipient</div>
                              <div className="font-medium">John</div>
                              <div className="text-xs text-muted-foreground">john.sol</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative flex items-center">
                  <Input
                    placeholder="Type a command (e.g., Send 0.1 SOL to alice.sol)"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-24"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 top-1 bottom-1"
                    onClick={handleSendMessage}
                  >
                    <SendHorizonal className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Walletron uses AI to parse natural language commands.{" "}
                  <span className="text-primary hover:underline cursor-pointer">
                    Learn more about supported commands
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}