import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

import { decrypt, encrypt } from "./crypto";
import { retrieveSecurePhrase, storeSecurePhrase } from "./store/indexdb";

interface Wallet {
  walletName: string;
  publicKey: string;
}

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
      const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(secretKey);

      publicKey = keypair.publicKey.toBase58();

      return publicKey;
    } else if (id === "60") {
      // Ethereum
      // const privateKey = Buffer.from(derivedSeed).toString("hex");
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
  Array<{ walletName: string; publicKey: string }>
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

        const wallets: Array<{ walletName: string; publicKey: string }> = [];

        result.users.forEach((user: any) => {
          const userWallets = user.publicKeys?.wallets ?? [];

          if (Array.isArray(userWallets)) {
            userWallets.forEach((wallet: Wallet) => {
              wallets.push({
                walletName: wallet.walletName,
                publicKey: wallet.publicKey,
              });
            });
          }
        });

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

const getNextWalletIndex = (): Promise<number> => {
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
        const data = getRequest.result;
        db.close();

        if (!data?.activeUser?.publicKeys?.wallets) {
          resolve(0); // No wallets yet
        } else {
          const wallets = Array.isArray(data.activeUser.publicKeys.wallets)
            ? data.activeUser.publicKeys.wallets
            : [data.activeUser.publicKeys.wallets];

          resolve(wallets.length);
        }
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

export const addWallet = async (
  id: string,
  password: string
): Promise<string> => {
  const cipherText = await retrieveSecurePhrase();
  const mnemonic = await decrypt(cipherText, password);
  const seedBuffer = mnemonicToSeedSync(mnemonic);

  const walletIndex = await getNextWalletIndex();

  const path = `m/44'/${id}'/0'/${walletIndex}'`;
  const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

  if (id !== "501") {
    throw new Error("Currently only Solana (id: 501) is supported.");
  }

  const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
  const keypair = Keypair.fromSecretKey(secretKey);
  const newPublicKey = keypair.publicKey.toBase58();

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserDB");

    request.onsuccess = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("userStore")) {
        db.close();
        reject(new Error("Object store 'userStore' does not exist."));
        return;
      }

      const tx = db.transaction("userStore", "readwrite");
      const store = tx.objectStore("userStore");

      const getRequest = store.get("userData");

      getRequest.onsuccess = () => {
        const data = getRequest.result;

        if (!data?.activeUser) {
          db.close();
          reject(new Error("No active user found."));
          return;
        }

        const user = data.activeUser;

        if (!Array.isArray(user.publicKeys.wallets)) {
          const oldWallet = user.publicKeys.wallets?.publicKey
            ? [
                {
                  walletName: "Wallet 1",
                  publicKey: user.publicKeys.wallets.publicKey,
                },
              ]
            : [];

          user.publicKeys.wallets = oldWallet;
        }

        const walletCount = user.publicKeys.wallets.length;
        const newWallet = {
          walletName: `Wallet ${walletCount + 1}`,
          publicKey: newPublicKey,
        };

        user.publicKeys.wallets.push(newWallet);

        const userIndex = data.users.findIndex(
          (u: any) => u.uuid === user.uuid
        );
        if (userIndex !== -1) {
          data.users[userIndex] = user;
        }

        const putRequest = store.put(data);

        putRequest.onsuccess = () => {
          db.close();
          resolve("Success! created new wallet");
        };

        putRequest.onerror = () => {
          db.close();
          reject(putRequest.error);
        };
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

interface ShowPrivateKeySuccess {
  success: true;
  privateKey: string;
}

interface ShowPrivateKeyFailure {
  success: false;
  error: unknown;
}

type ShowPrivateKeyResult = ShowPrivateKeySuccess | ShowPrivateKeyFailure;

export const showPrivateKey = async (
  walletIndex: number,
  password: string
): Promise<ShowPrivateKeyResult> => {
  try {
    const cipherText = await retrieveSecurePhrase();
    const mnemonic = await decrypt(cipherText, password);

    const path = `m/44'/501'/0'/${walletIndex}'`;
    const seedBuffer = mnemonicToSeedSync(mnemonic);

    const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));
    const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
    const keypair = Keypair.fromSecretKey(secretKey);
    const privateKey = Buffer.from(keypair.secretKey).toString("hex");

    return { success: true, privateKey };
  } catch (error) {
    return { success: false, error };
  }
};

export const getBalance = async (publicKeyString: string) => {
  try {
    const ALCHEMY_DEVNET_URL = process.env.NEXT_PUBLIC_ALCHEMY_DEVNET_URL!;

    const connection = new Connection(ALCHEMY_DEVNET_URL, "confirmed");

    const publicKey = new PublicKey(publicKeyString);
    const lamports = await connection.getBalance(publicKey);
    const balance = lamports / LAMPORTS_PER_SOL;

    return { balance };
  } catch (err) {
    console.log(err);
  }
};

export async function convertSOLtoUSD(solAmount: number) {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const solPrice = data.solana.usd;
    const usdValue = solAmount * solPrice;

    return usdValue;
  } catch (error) {
    console.error("Error fetching SOL price:", error);
    return null;
  }
}