import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma";

export const listUserAccounts = async function (
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const prisma = new PrismaClient();
    const items = await prisma.userAccount.findMany({ orderBy: { createdAt: "desc" } });
    res.status(200).json({ accounts: items });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
};


