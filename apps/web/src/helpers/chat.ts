const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function chat(messages: ChatMessage[], context?: any): Promise<{ content: string; intent?: string; params?: any; data?: any }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as { content: string; intent?: string; params?: any; data?: any };
  return data;
}


