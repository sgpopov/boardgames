export interface StorageContract {
  read<T>(key: string, fallback: T): T;

  write<T>(key: string, value: T): void;
}
