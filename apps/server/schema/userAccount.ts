import { z } from "zod";
import { KeyPairSchema } from './keyPair'; 

export const AccountSchema = z.object({
  id: z.string().uuid(), // UUID string
  keyPairs: z.array(KeyPairSchema), // Array of KeyPair
  createdAt: z.date(), // Date object
  solanaKeyPairs: z.number().int().nonnegative(), // Non-negative integer
  ethereumKeyPairs: z.number().int().nonnegative(), // Non-negative integer
});

export type Account = z.infer<typeof AccountSchema>;
