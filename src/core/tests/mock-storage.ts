import { StorageContract } from "../infrastructure/storage/StorageInterface";

export class MockStorage implements StorageContract {
  private data: Record<string, string> = {};

  constructor(private namespace: string) {}

  read<T>(key: string, fallback: T): T {
    const raw = this.data[`${this.namespace}:${key}`];

    if (!raw) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    this.data[`${this.namespace}:${key}`] = JSON.stringify(value);
  }
}
