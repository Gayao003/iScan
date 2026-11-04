import { IScannerAdapter } from "./scanner-adapter.interface";
import { ScanResult } from "@/shared/types/scanner";
import { normalizeItemCode } from "@/shared/utils/normalize";

export class Html5QrcodeAdapter implements IScannerAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private scannerInstance: any = null;
  private scanning = false;
  private isPaused = false;
  private lastScannedCode = "";
  private lastScannedTime = 0;
  private readonly debounceMs = 1500;

  async start(
    elementId: string,
    onSuccess: (result: ScanResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (this.scannerInstance) {
        await this.stop();
      }

      this.scannerInstance = new Html5Qrcode(elementId);

      const qrCodeSuccessCallback = (decodedText: string, decodedResult: unknown) => {
        const now = Date.now();
        const normalized = normalizeItemCode(decodedText);

        // Debounce duplicate scans
        if (
          normalized === this.lastScannedCode &&
          now - this.lastScannedTime < this.debounceMs
        ) {
          return;
        }

        if (this.isPaused) {
          return;
        }

        this.lastScannedCode = normalized;
        this.lastScannedTime = now;

        onSuccess({
          code: normalized,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          format: (decodedResult as any)?.result?.format?.formatName || "QR_OR_BARCODE",
          timestamp: now,
        });
      };

      const qrCodeErrorCallback = (_errorMessage: string) => {
        // Continuous frame analysis error is normal when no barcode is in view
      };

      await this.scannerInstance.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      this.scanning = true;
      this.isPaused = false;
    } catch (err: unknown) {
      this.scanning = false;
      const errorObj = err instanceof Error ? err : new Error(String(err));
      onError(errorObj);
      throw errorObj;
    }
  }

  pause(): void {
    if (this.scannerInstance && this.scanning) {
      try {
        this.scannerInstance.pause(true);
        this.isPaused = true;
      } catch (e) {
        console.warn("Pause warning:", e);
      }
    }
  }

  resume(): void {
    if (this.scannerInstance && this.scanning) {
      try {
        this.scannerInstance.resume();
        this.isPaused = false;
      } catch (e) {
        console.warn("Resume warning:", e);
      }
    }
  }

  async stop(): Promise<void> {
    if (this.scannerInstance) {
      try {
        if (this.scanning) {
          await this.scannerInstance.stop();
        }
        this.scannerInstance.clear();
      } catch (e) {
        console.warn("Stop warning:", e);
      } finally {
        this.scannerInstance = null;
        this.scanning = false;
        this.isPaused = false;
      }
    }
  }

  isScanning(): boolean {
    return this.scanning && !this.isPaused;
  }
}
