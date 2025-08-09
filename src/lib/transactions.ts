import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { decryptStoredPassword } from "./password";
import { showPrivateKey } from "./wallet";

import { hexToUint8Array } from "./crypto";

export async function sendSOL(
  walletIndex: number,
  receiverPublicKey: string,
  amount: number
): Promise<string> {
  try {
    const connection = new Connection(
      process.env.NEXT_PUBLIC_ALCHEMY_DEVNET_URL!,
      "confirmed"
    );

    const password = await decryptStoredPassword(process.env.SECRET!);
    if (!password) {
      return "something went wrong try after some time";
    }
    const result = await showPrivateKey(walletIndex, password);
    if (!result.success || !result.privateKey) {
      return "something went wrong try after some time";
    }

    const privKey = hexToUint8Array(result.privateKey);
    console.log(privKey);

    const senderKeypair = Keypair.fromSecretKey(privKey);
    console.log(senderKeypair);
    const lamports = amount * LAMPORTS_PER_SOL;

    const toPubkey = new PublicKey(receiverPublicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey,
        lamports,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      senderKeypair,
    ]);

    return signature;
  } catch (error) {
    console.error("Error sending SOL:", error);
    return "failed to send transaction";
  }
}
