import { ScanResult } from "@/shared/types/scanner";

export interface IScannerAdapter {
  start(
    elementId: string,
    onSuccess: (result: ScanResult) => void,
    onError: (error: Error) => void,
    cameraId?: string
  ): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): Promise<void>;
  isScanning(): boolean;
  getCameras?(): Promise<Array<{ id: string; label: string }>>;
  switchCamera?(cameraId: string): Promise<void>;
  setZoom?(zoomLevel: number): Promise<boolean>;
  toggleTorch?(enable: boolean): Promise<boolean>;
}
