import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
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
): Promise<void> => {
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

        // Normalize to array if not already
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

        // Also update the same user in `users[]`
        const userIndex = data.users.findIndex(
          (u: any) => u.uuid === user.uuid
        );
        if (userIndex !== -1) {
          data.users[userIndex] = user;
        }

        const putRequest = store.put(data);

        putRequest.onsuccess = () => {
          db.close();
          resolve();
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

    request.onerror = () => reject(request.error);
  });
};
