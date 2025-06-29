"use client";
import { UUIDTypes, v4 as uuidv4 } from "uuid";

export const isNewUser = () => {
  const lockMeta = localStorage.getItem("lockMeta");
  return !lockMeta;
};

export const createUser = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 6);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = event.oldVersion;

      // Handle different upgrade scenarios
      if (!db.objectStoreNames.contains("userStore")) {
        console.log("Creating userStore object store");
        db.createObjectStore("userStore", { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      // Double-check that our object store exists
      if (!db.objectStoreNames.contains("userStore")) {
        db.close();
        reject(
          new Error(
            "Object store 'userStore' does not exist. Try deleting the database and recreating it."
          )
        );
        return;
      }

      const tx = db.transaction("userStore", "readwrite");
      const store = tx.objectStore("userStore");

      // First, check if userData already exists
      const getRequest = store.get("userData");

      getRequest.onsuccess = () => {
        const existingData = getRequest.result;

        const uuid = uuidv4();
        const newUser = {
          hasMnemonic: true,
          mnemonicCreatedAt: Date.now(),
          username: name,
          uuid: uuid,
        };

        let userData;

        if (existingData) {
          // Add to existing users
          userData = {
            ...existingData,
            activeUser: newUser,
            users: [...existingData.users, newUser],
          };
        } else {
          // Create new userData
          userData = {
            key: "userData",
            activeUser: newUser,
            users: [newUser],
          };
        }

        const putRequest = store.put(userData);

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

export const fetchUsers = (): Promise<{
  activeUser: any;
  users: any[];
} | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 6);

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
    const request = indexedDB.open("WalletDB", 6);

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
