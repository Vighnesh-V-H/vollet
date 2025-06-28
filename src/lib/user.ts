"use client";
import { UUIDTypes, v4 as uuidv4 } from "uuid";

export const isNewUser = () => {
  const walletMeta = localStorage.getItem("lockMeta");
  return !walletMeta;
};

export const createUser = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 3); // bump version if needed

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("userStore")) {
        db.createObjectStore("userStore", { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("userStore", "readwrite");
      const store = tx.objectStore("userStore");

      const uuid = uuidv4();
      const user = {
        hasMnemonic: true,
        mnemonicCreatedAt: Date.now(),
        username: name,
        uuid: uuid,
      };

      const userData = {
        key: "userData",
        activeUser: user,
        users: [user],
      };

      store.put(userData);

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
};

export const fetchUsers = (): Promise<{
  activeUser: any;
  users: any[];
} | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 3);

    request.onsuccess = () => {
      const db = request.result;

      const tx = db.transaction("userStore", "readonly");
      const store = tx.objectStore("userStore");

      const getRequest = store.get("userData");

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          resolve({
            activeUser: data.activeUser,
            users: data.users,
          });
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const setActiveUser = (uuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 3);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("userStore", "readwrite");
      const store = tx.objectStore("userStore");

      const getRequest = store.get("userData");

      getRequest.onsuccess = () => {
        const userData = getRequest.result;

        if (!userData || !Array.isArray(userData.users)) {
          reject(new Error("No users found"));
          return;
        }

        const newActive = userData.users.find(
          (u: typeof userData) => u.uuid === uuid
        );
        if (!newActive) {
          reject(new Error("User with given UUID not found"));
          return;
        }

        userData.activeUser = newActive;
        store.put(userData);

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
};
