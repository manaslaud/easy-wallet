import { type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { type Account, AccountSchema } from "../schema/userAccount";
import type { GenericErrorResponse, GenericSuccessResponse } from "../types/generic";
import { ZodError } from "zod";

export const createUserAccount = async function (
  req: Request,
  res: Response<GenericErrorResponse | GenericSuccessResponse>
): Promise<void> {
  try {
    const prisma = new PrismaClient();
    const { userAcc }: { userAcc: unknown } = req.body;
    const safe = AccountSchema.parse(userAcc);
    await prisma.userAccount.create({
      data: {
        id: safe.id,
        KeyPairs: safe.keyPairs, // contains ONLY public fields per schema
        createdAt: safe.createdAt,
        solanaKeyPairs: safe.solanaKeyPairs,
        ethrereKeyPairs: safe.ethereumKeyPairs,
      },
    });
    res.status(201).json({ message: "Account added successfully" });
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
