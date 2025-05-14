"use client";

import { useState, useEffect } from "react";
import { motion } from "@/components/ui/motion";
import { Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Pricing() {
  const [mounted, setMounted] = useState(false);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 dark:to-primary/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start building for free and scale as you grow.
          </p>
          
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className={!annual ? "font-medium" : "text-muted-foreground"}>Monthly</span>
            <Switch
              checked={annual}
              onCheckedChange={setAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={annual ? "font-medium" : "text-muted-foreground"}>
              Annual
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 px-2 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                Save 20%
              </span>
            </span>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Free Tier */}
          <Card className="border shadow-md relative hover:shadow-lg transition-shadow">
            <CardHeader className="pb-8">
              <h3 className="text-lg font-bold">Developer</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                $0
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Perfect for individual developers and side projects.
              </p>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-3">
                <PricingItem feature="3 wallets" included />
                <PricingItem feature="100 transactions per month" included />
                <PricingItem feature="Basic analytics" included />
                <PricingItem feature="Community support" included />
                <PricingItem feature="Public testnet access" included />
                <PricingItem feature="1,000 AI interactions/mo" included />
                <PricingItem feature="Sandbox environment" included={false} />
                <PricingItem feature="Custom integrations" included={false} />
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Sign up for free
              </Button>
            </CardFooter>
          </Card>
          
          {/* Pro Tier */}
          <Card className="border-2 border-primary shadow-xl relative hover:shadow-2xl transition-shadow">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
              Most Popular
            </div>
            <CardHeader className="pb-8">
              <h3 className="text-lg font-bold">Pro</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                ${annual ? "49" : "59"}
                <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                For startups and small teams building in production.
              </p>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-3">
                <PricingItem feature="25 wallets" included />
                <PricingItem feature="2,500 transactions per month" included />
                <PricingItem feature="Advanced analytics" included />
                <PricingItem feature="Priority support" included />
                <PricingItem feature="Mainnet access" included />
                <PricingItem feature="10,000 AI interactions/mo" included />
                <PricingItem feature="Sandbox environment" included />
                <PricingItem feature="Custom integrations" included={false} />
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Start Pro Trial
              </Button>
            </CardFooter>
          </Card>
          
          {/* Enterprise Tier */}
          <Card className="border shadow-md relative hover:shadow-lg transition-shadow">
            <CardHeader className="pb-8">
              <h3 className="text-lg font-bold">Enterprise</h3>
              <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                Custom
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                For companies requiring high volumes and custom support.
              </p>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-3">
                <PricingItem feature="Unlimited wallets" included />
                <PricingItem feature="Custom transaction volume" included />
                <PricingItem feature="Custom analytics" included />
                <PricingItem feature="Dedicated support" included />
                <PricingItem feature="Custom chain support" included />
                <PricingItem feature="Unlimited AI interactions" included />
                <PricingItem feature="Enterprise SLAs" included />
                <PricingItem feature="Custom integrations" included />
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            All plans include access to our core API, SDKs, and developer support.
          </p>
          <p className="mt-2">
            <Button variant="link" className="text-muted-foreground hover:text-foreground">
              View full pricing details
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}

function PricingItem({ feature, included, tooltip }: { feature: string; included: boolean; tooltip?: string }) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        {included ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <Check className="h-5 w-5 text-muted-foreground opacity-30" />
        )}
      </div>
      <div className="ml-3 flex items-center">
        <span className={included ? "" : "text-muted-foreground"}>
          {feature}
        </span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="ml-1.5 h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </li>
  );
}