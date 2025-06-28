export function storeUnlockState(isUnlocked: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 3);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains("lockState")) {
        db.createObjectStore("lockState", { keyPath: "key" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("lockState", "readwrite"); // ✅ correct mode
      const store = tx.objectStore("lockState");

      store.put({ key: "isUnlocked", value: isUnlocked });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

export function getUnlockState(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("WalletDB", 3);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("lockState", "readonly");
      const store = tx.objectStore("lockState");

      const getRequest = store.get("isUnlocked");
      getRequest.onsuccess = () => {
        resolve(getRequest.result?.value ?? false);
      };
      getRequest.onerror = () => reject(getRequest.error);
    };

    request.onerror = () => reject(request.error);
  });
}
