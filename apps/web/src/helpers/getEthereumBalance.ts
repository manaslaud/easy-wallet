import { ethers } from "ethers";

export async function getEthereumBalance(
  address: string,
  opts?: { network?: "sepolia" | "mainnet"; rpcUrl?: string }
) {
  const rpc =
    opts?.rpcUrl ||
    (opts?.network === "mainnet"
      ? process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL
      : process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL);

  const provider = rpc ? new ethers.JsonRpcProvider(rpc) : ethers.getDefaultProvider(opts?.network || "sepolia");
  const wei = await provider.getBalance(address);
  return { wei: wei.toString(), ether: ethers.formatEther(wei) };
}


