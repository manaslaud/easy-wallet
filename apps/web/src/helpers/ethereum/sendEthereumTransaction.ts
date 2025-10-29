import { ethers } from "ethers";
import { decryptPacked } from "@/helpers/encryption";

export async function sendEthereumTransaction(params: {
  password: string;
  packedEncryptedPrivateKey: string; // packed string from packEncryptedPayload
  toAddress: string;
  amountEther: string; // e.g. "0.01"
  network?: "mainnet" | "sepolia";
  rpcUrl?: string; // optional explicit RPC URL to bypass default provider
}) {
  const { password, packedEncryptedPrivateKey, toAddress, amountEther, network = "sepolia", rpcUrl } = params;

  const privateKey = await decryptPacked(password, packedEncryptedPrivateKey);
  const normalizedPrivateKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;

  const resolvedRpcUrl = rpcUrl ||
    (network === "sepolia"
      ? process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL
      : process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL);

  const provider = resolvedRpcUrl
    ? new ethers.JsonRpcProvider(resolvedRpcUrl)
    : ethers.getDefaultProvider(network);
  const wallet = new ethers.Wallet(normalizedPrivateKey, provider);
  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amountEther),
  });
  const receipt = await tx.wait();
  return { hash: tx.hash, receipt };
}


