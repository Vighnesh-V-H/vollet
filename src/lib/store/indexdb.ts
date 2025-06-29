function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB");

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("lockState")) {
        db.createObjectStore("lockState", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeUnlockState(isUnlocked: boolean): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("lockState", "readwrite");
  const store = tx.objectStore("lockState");

  store.put({ key: "isUnlocked", value: isUnlocked });

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getUnlockState(): Promise<boolean> {
  const db = await getDB();
  const tx = db.transaction("lockState", "readonly");
  const store = tx.objectStore("lockState");

  return new Promise((resolve, reject) => {
    const getRequest = store.get("isUnlocked");
    getRequest.onsuccess = () => {
      resolve(getRequest.result?.value ?? false);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}
