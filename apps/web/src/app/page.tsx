"use client";
import { createBaseAccount } from "@/helpers/createAccount";
import { useEffect } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Dashboard from "@/components/sections/Dashboard";
import ChatInterface from "@/components/sections/ChatInterface";
import SdkSection from "@/components/sections/SdkSection";
import McpSection from "@/components/sections/McpSection";
import Pricing from "@/components/sections/Pricing";
import Footer from "@/components/layout/Footer";

export default function Home() {
  useEffect(() => {
    const f = async () => {
      const password = "12345678";
      const label = "manas account";
      console.log(await createBaseAccount(password, label));
    };
    f();
  }, []);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Dashboard />
          <ChatInterface />
          <SdkSection />
          <McpSection />
          <Pricing />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
