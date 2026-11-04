import { ScanResult } from "@/shared/types/scanner";

export interface IScannerAdapter {
  start(
    elementId: string,
    onSuccess: (result: ScanResult) => void,
    onError: (error: Error) => void
  ): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): Promise<void>;
  isScanning(): boolean;
  toggleTorch?(enable: boolean): Promise<boolean>;
}
