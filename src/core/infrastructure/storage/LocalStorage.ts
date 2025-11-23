import { StorageContract } from "./StorageInterface";

// SSR-safe local storage helper
export class LocalStorageWrapper implements StorageContract {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  private get storage(): Storage | undefined {
    if (typeof window === "undefined") {
      return undefined;
    }

    return window.localStorage;
  }

  read<T>(key: string, fallback: T): T {
    const store = this.storage;

    if (!store) {
      return fallback;
    }

    const raw = store.getItem(`${this.namespace}:${key}`);

    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    const store = this.storage;

    if (!store) {
      return;
    }

    store.setItem(`${this.namespace}:${key}`, JSON.stringify(value));
  }
}
