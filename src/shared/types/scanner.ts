export type PermissionStatus =
  | 'prompt'
  | 'granted'
  | 'denied'
  | 'unavailable'
  | 'error';

export interface ScanResult {
  code: string;
  format?: string;
  timestamp: number;
  snapshotUrl?: string;
}

export interface ScannerAdapter {
  start(
    elementId: string,
    onSuccess: (result: ScanResult) => void,
    onError: (error: Error) => void
  ): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): Promise<void>;
  toggleTorch?(enable: boolean): Promise<boolean>;
}
