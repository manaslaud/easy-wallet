import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma";

export const listContacts = async function (
  req: Request,
  res: Response
): Promise<void> {
  try {
    const prisma = new PrismaClient();
    const userAccountId = String(req.query.userAccountId || "");
    const chain = String(req.query.chain || "");
    const network = String(req.query.network || "");
    if (!userAccountId || !chain || !network) {
      res.status(400).json({ error: "Missing userAccountId, chain, or network" });
      return;
    }
    const contacts = await prisma.contact.findMany({
      where: { userAccountId, chain, network },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(contacts);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};


