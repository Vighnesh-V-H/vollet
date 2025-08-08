import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const connection = new Connection(
  process.env.NEXT_PUBLIC_ALCHEMY_DEVNET_URL!,
  "confirmed"
);

// Your sender's keypair (from private key bytes)
const senderPrivateKey = Uint8Array.from([
  // Replace with your 64-byte private key array
]);
const senderKeypair = Keypair.fromSecretKey(senderPrivateKey);

// Build, sign and send transfer as a reusable function
export async function sendSolTransaction(
  walletIndex: number,
  senderPublicKey: string,
  receiverPublicKey: string
): Promise<string> {
  // Note: senderPublicKey and walletIndex are accepted for future derivation/validation.
  // Currently signing uses the placeholder senderKeypair above.

  const toPubkey = new PublicKey(receiverPublicKey);

  // Create transfer instruction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: senderKeypair.publicKey,
      toPubkey: toPubkey,
      lamports: 0.01 * 1e9, // 0.01 SOL
    })
  );

  // (Optional) Set a recent blockhash & fee payer
  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderKeypair.publicKey;

  // Sign transaction with sender's private key
  transaction.sign(senderKeypair);

  // Send & confirm
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ]);
  return signature;
}
