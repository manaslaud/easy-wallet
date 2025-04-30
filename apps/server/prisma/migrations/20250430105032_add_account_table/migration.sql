-- CreateTable
CREATE TABLE "UserAccount" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "solanaKeyPairs" INTEGER NOT NULL,
    "ethrereKeyPairs" INTEGER NOT NULL,
    "KeyPairs" JSONB NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);
