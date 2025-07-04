import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { decrypt, encrypt } from "./crypto";
import { storeSecurePhrase } from "./store/indexdb";

export const generateWallet = async (
  id: string,
  password: string,
  accountIndex: number
) => {
  try {
    const mnemonic = generateMnemonic(256);

    const seedBuffer = mnemonicToSeedSync(mnemonic);

    const encryptedMnemonic = await encrypt(mnemonic, password);

    storeSecurePhrase(encryptedMnemonic);

    const path = `m/44'/${id}'/0'/${accountIndex}'`;
    const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

    let publicKey: string;

    if (id === "501") {
      // Solana
      const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(secretKey);

      publicKey = keypair.publicKey.toBase58();

      return publicKey;
    } else if (id === "60") {
      // Ethereum
      const privateKey = Buffer.from(derivedSeed).toString("hex");
      // privateKeyEncoded = privateKey;

      // const wallet = new ethers.Wallet(privateKey);
      // publicKeyEncoded = wallet.address;
    } else {
      return null;
    }

    return;
  } catch (error) {
    console.log(error);
    // toast.error("Failed to generate wallet. Please try again.");
    return null;
  }
};


export const getWallets = (): Promise<
  Array<{ blockChainName: string; publicKey: string }>
> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserDB");

    request.onsuccess = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("userStore")) {
        db.close();
        reject(new Error("Object store 'userStore' does not exist."));
        return;
      }

      const tx = db.transaction("userStore", "readonly");
      const store = tx.objectStore("userStore");

      const getRequest = store.get("userData");

      getRequest.onsuccess = () => {
        const result = getRequest.result;

        if (!result || !Array.isArray(result.users)) {
          db.close();
          resolve([]);
          return;
        }

        const wallets = result.users.map((user: any) => ({
          blockChainName: user.publicKeys.wallets.blockChainName,
          publicKey: user.publicKeys.wallets.publicKey,
        }));

        db.close();
        resolve(wallets);
      };

      getRequest.onerror = () => {
        db.close();
        reject(getRequest.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};