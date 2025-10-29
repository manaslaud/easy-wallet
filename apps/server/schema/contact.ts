import { z } from "zod";

export const ContactSchema = z.object({
  id: z.string().uuid().optional(),
  userAccountId: z.string().uuid(),
  chain: z.enum(["solana", "ethereum"]),
  network: z.string().min(1),
  address: z.string().min(1),
  label: z.string().min(1),
  createdAt: z.coerce.date().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;


