export class StorageWriteError extends Error {
  readonly key: string;

  constructor(key: string, cause?: unknown) {
    super(`Failed to write data to storage key '${key}'`);
    this.name = "StorageWriteError";
    this.key = key;

    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}
