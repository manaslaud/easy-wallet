import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { ContactSchema } from "../schema/contact";
import { ZodError } from "zod";

export const createContact = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const prisma = new PrismaClient();
    const { contact }: { contact: unknown } = req.body;
    const safe = ContactSchema.omit({ id: true, createdAt: true }).parse(contact);
    // Ensure the referenced user account exists to avoid FK errors
    const exists = await prisma.userAccount.findUnique({ where: { id: safe.userAccountId } });
    if (!exists) {
      res.status(404).json({ error: "User account not found" });
      return;
    }
    const created = await prisma.contact.create({
      data: {
        userAccountId: safe.userAccountId,
        chain: safe.chain,
        network: safe.network,
        address: safe.address,
        label: safe.label,
      },
    });
    res.status(201).json(created);
  } catch (e: any) {
    if (e instanceof ZodError) {
      res.status(400).json({ error: e.message });
      return;
    }
    // Unique constraint violation handling
    if (e?.code === "P2002") {
      res.status(409).json({ error: "Contact already exists for this address/network" });
      return;
    }
    // Foreign key constraint (user not found)
    if (e?.code === "P2003") {
      res.status(404).json({ error: "User account not found" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
};


