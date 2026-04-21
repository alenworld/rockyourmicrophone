export {};

declare global {
  interface Window {
    scanner: {
      start(): Promise<void>;
      onFile(cb: (file: string) => void): void;
    };
  }
}
