export type CipherPayload = {
  ciphertext: string;
  nonce: string;
  salt: string;
  kdf: string;
  iterations: number;
  digest: string;
};

function getUserDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserDB");

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("userStore")) {
        db.createObjectStore("userStore", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeUnlockState(isUnlocked: boolean): Promise<void> {
  const db = await getUserDB();
  const tx = db.transaction("userStore", "readwrite");
  const store = tx.objectStore("userStore");

  const getRequest = store.get("userData");

  return new Promise((resolve, reject) => {
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (!data) {
        db.close();
        reject(new Error("No userData found"));
        return;
      }

      data.isUnlocked = isUnlocked; // ✅ Store at the root level

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
  });
}

export async function getUnlockState(): Promise<boolean> {
  const db = await getUserDB();
  const tx = db.transaction("userStore", "readonly");
  const store = tx.objectStore("userStore");

  return new Promise((resolve, reject) => {
    const getRequest = store.get("userData");

    getRequest.onsuccess = () => {
      const data = getRequest.result;
      const state = data?.isUnlocked ?? false; // ✅ Read from root
      db.close();
      resolve(state);
    };

    getRequest.onerror = () => {
      db.close();
      reject(getRequest.error);
    };
  });
}

export async function lockUser(): Promise<void> {
  const db = await getUserDB();
  const tx = db.transaction("userStore", "readwrite");
  const store = tx.objectStore("userStore");

  const getRequest = store.get("userData");

  return new Promise((resolve, reject) => {
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (!data) {
        db.close();
        reject(new Error("No userData found"));
        return;
      }

      data.isUnlocked = false;

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
  });
}

export function storeSecurePhrase(encryptedMnemonic: object): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB");

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("secureSeed")) {
        db.createObjectStore("secureSeed");
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("secureSeed", "readwrite");
      const store = tx.objectStore("secureSeed");

      store.put(encryptedMnemonic, "secure-seed");

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

export function retrieveSecurePhrase(): Promise<CipherPayload> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB");

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("secureSeed", "readonly");
      const store = tx.objectStore("secureSeed");

      const getRequest = store.get("secure-seed");

      getRequest.onsuccess = () => {
        db.close();
        resolve(getRequest.result || null);
      };

      getRequest.onerror = () => {
        db.close();
        reject(getRequest.error);
      };
    };

    request.onerror = () => reject(request.error);
  });
}
