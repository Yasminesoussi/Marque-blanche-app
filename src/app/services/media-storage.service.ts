import { Injectable } from '@angular/core';

const DB_NAME = 'wl_shop_media';
const DB_VERSION = 1;
const STORE_NAME = 'media';

@Injectable({
  providedIn: 'root',
})
export class MediaStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  mediaKey(productId: string, mediaId: string): string {
    return `${productId}/${mediaId}`;
  }

  async save(key: string, dataUrl: string): Promise<void> {
    const db = await this.openDb();
    await this.runTransaction('readwrite', db, (store) => {
      store.put(dataUrl, key);
    });
  }

  async get(key: string): Promise<string | null> {
    const db = await this.openDb();
    return this.runRequest(db, 'readonly', (store) => store.get(key)).then(
      (result) => (result as string | undefined) ?? null,
    );
  }

  async deleteKeys(keys: string[]): Promise<void> {
    if (!keys.length) {
      return;
    }

    const db = await this.openDb();
    await this.runTransaction('readwrite', db, (store) => {
      keys.forEach((key) => store.delete(key));
    });
  }

  private openDb(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
          reject(new Error('IndexedDB unavailable'));
          return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(STORE_NAME)) {
            request.result.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
      });
    }

    return this.dbPromise;
  }

  private runTransaction(
    mode: IDBTransactionMode,
    db: IDBDatabase,
    work: (store: IDBObjectStore) => void,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      work(transaction.objectStore(STORE_NAME));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
      transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
    });
  }

  private runRequest<T>(
    db: IDBDatabase,
    mode: IDBTransactionMode,
    work: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const request = work(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
      transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    });
  }
}
