import {
  Connection,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const wallet = Keypair.generate();

async function main() {
  console.log(`New Wallet: ${wallet.publicKey.toBase58()}`);

  // airdrop some SOL to the wallet
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    1 * LAMPORTS_PER_SOL
  );
  const latestBlockHash = await connection.getLatestBlockhash();
  const res = await connection.confirmTransaction({
    signature: airdropSignature,
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
  });
  console.log(res.value.err?.toString())
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

main();
