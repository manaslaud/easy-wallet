import { type Request, type Response } from "express";
import OpenAI from "openai";

const baseURL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const apiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const client = new OpenAI({ apiKey, baseURL });

export const chat = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!apiKey) {
      res.status(500).json({ error: "Missing OPENROUTER_API_KEY" });
      return;
    }
    const { messages, context }: { messages: Array<{ role: "user" | "assistant" | "system"; content: string }>; context?: any } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing messages[]" });
      return;
    }

    const system = {
      role: "system" as const,
      content:
        "You are Easy Wallet Assistant. Be concise. Never require MetaMask or Phantom. Use provided context about accounts, networks, and contacts to answer. If a user asks to send or perform an action, describe the exact steps they should click in the UI (labels) and needed inputs. When asked for balances, summarize based on provided context or ask for the address/network if missing.",
    };

    const contextMsg = context
      ? [{ role: "system" as const, content: `Context: ${JSON.stringify(context).slice(0, 8000)}` }]
      : [];

    // Ask model to pick an intent and params with STRICT JSON only
    const schemaHint = `Return ONLY JSON with: {"intent":"get_balance|send|create_contact|list_contacts|help","params":object,"say":string}. No prose.`;
    const completion = await client.chat.completions.create({
      model,
      messages: [
        system,
        ...contextMsg,
        ...messages,
        { role: "system", content: schemaHint },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices?.[0]?.message?.content || "";
    let intent = "help" as string;
    let params: any = {};
    let say = raw;
    try {
      const parsed = JSON.parse(raw);
      intent = parsed.intent || intent;
      params = parsed.params || {};
      say = parsed.say || say;
    } catch {
      // fallback: return as normal chat content
      res.status(200).json({ content: raw });
      return;
    }

    // Execute safe read-only intents on server
    const data: any = {};
    if (intent === "get_balance") {
      // Normalize potentially swapped fields from the model
      let reqChain = String(params.chain || "");
      let reqNetwork = String(params.network || "");
      const address = String(params.address || (context?.addresses ? (reqChain ? context.addresses?.[reqChain] : undefined) : undefined) || "");

      if (!reqChain && (reqNetwork === "solana" || reqNetwork === "ethereum")) {
        reqChain = reqNetwork;
        reqNetwork = "";
      }

      // Infer chain from address if still missing
      if (!reqChain && address) {
        if (/^0x[0-9a-fA-F]{40}$/.test(address)) reqChain = "ethereum";
        else reqChain = "solana";
      }

      const resolvedChain = reqChain || (context?.addresses?.solana ? "solana" : context?.addresses?.ethereum ? "ethereum" : "");
      const network = String(
        reqNetwork || (context?.networks ? context.networks[resolvedChain] : undefined) || (resolvedChain === "solana" ? "devnet" : "sepolia")
      );
      if (!address || !resolvedChain) {
        res.status(200).json({ content: say, intent, params });
        return;
      }
      if (resolvedChain === "ethereum") {
        const { ethers } = await import("ethers");
        const envMainnet = process.env.ETHEREUM_MAINNET_RPC_URL || process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL;
        const envSepolia = process.env.ETHEREUM_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL;
        const rpc = network === "mainnet" ? envMainnet : envSepolia;
        const provider = rpc ? new ethers.JsonRpcProvider(rpc) : ethers.getDefaultProvider(network as any);
        const wei = await provider.getBalance(address);
        data.balance = { chain: resolvedChain, network, address, wei: wei.toString(), ether: ethers.formatEther(wei) };
      } else if (resolvedChain === "solana") {
        const { Connection, PublicKey, clusterApiUrl } = await import("@solana/web3.js");
        const endpoint = clusterApiUrl(network as any);
        const conn = new Connection(endpoint, "confirmed");
        const lamports = await conn.getBalance(new PublicKey(address));
        data.balance = { chain: resolvedChain, network, address, lamports, sol: lamports / 1_000_000_000 };
      }
    }

    res.status(200).json({ content: say, intent, params, data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Chat failed" });
  }
};


