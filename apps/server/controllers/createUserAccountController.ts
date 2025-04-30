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
    const { userAcc }: { userAcc: Account } = req.body;
    AccountSchema.parse(userAcc);
    await prisma.userAccount.create({
      data: {
        id: userAcc.id,
        KeyPairs: userAcc.keyPairs,
        createdAt: userAcc.createdAt,
        solanaKeyPairs: userAcc.solanaKeyPairs,
        ethrereKeyPairs: userAcc.ethereumKeyPairs,
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
