-- CreateTable Contact
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAccountId" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Contact_userAccountId_fkey" FOREIGN KEY ("userAccountId") REFERENCES "UserAccount" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX "Contact_userAccountId_idx" ON "Contact" ("userAccountId");

-- Unique constraint to avoid duplicate contacts per user-chain-network-address
CREATE UNIQUE INDEX "Contact_user_chain_network_address_unique" ON "Contact" ("userAccountId", "chain", "network", "address");


