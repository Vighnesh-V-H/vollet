function getUserDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserDB");

    request.onupgradeneeded = (event) => {
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
      if (!data || !data.activeUser) {
        db.close();
        reject(new Error("No active user found"));
        return;
      }

      data.activeUser.isUnlocked = isUnlocked;

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
      const state = data?.activeUser?.isUnlocked ?? false;
      db.close();
      resolve(state);
    };

    getRequest.onerror = () => {
      db.close();
      reject(getRequest.error);
    };
  });
}
