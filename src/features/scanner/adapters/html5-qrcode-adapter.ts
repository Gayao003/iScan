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
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      if (this.scannerInstance) {
        await this.stop();
      }

      // Explicitly support standard retail barcodes & warehouse codes (high-performance decoding)
      const formatsToSupport = [
        Html5QrcodeSupportedFormats.EAN_13,          // Standard retail (e.g. Coca-Cola, grocery items)
        Html5QrcodeSupportedFormats.EAN_8,           // Small retail packaging
        Html5QrcodeSupportedFormats.UPC_A,           // North American standard retail
        Html5QrcodeSupportedFormats.UPC_E,           // Zero-suppressed UPC
        Html5QrcodeSupportedFormats.CODE_128,        // Logistics, warehouse inventory
        Html5QrcodeSupportedFormats.CODE_39,         // Industrial inventory
        Html5QrcodeSupportedFormats.ITF,             // Interleaved 2 of 5 (cartons/cases)
        Html5QrcodeSupportedFormats.QR_CODE,         // 2D QR Code
        Html5QrcodeSupportedFormats.DATA_MATRIX,     // 2D Data Matrix
      ];

      // Enable native mobile hardware BarcodeDetector API for fast curved-surface & reflection decoding
      this.scannerInstance = new Html5Qrcode(elementId, {
        formatsToSupport,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
        verbose: false,
      });

      const qrCodeSuccessCallback = (decodedText: string, decodedResult: unknown) => {
        const now = Date.now();
        const normalized = normalizeItemCode(decodedText);

        // Debounce duplicate scans within debounceMs window
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

        // Capture snapshot frame from the active camera video element
        let snapshotUrl: string | undefined;
        try {
          const video = document.querySelector<HTMLVideoElement>(`#${elementId} video`);
          if (video && video.videoWidth && video.videoHeight) {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              snapshotUrl = canvas.toDataURL("image/jpeg", 0.85);
              // Save to sessionStorage for result page
              sessionStorage.setItem(`iscan_snapshot_${normalized}`, snapshotUrl);
            }
          }
        } catch (e) {
          console.warn("Could not capture video frame snapshot:", e);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatName = (decodedResult as any)?.result?.format?.formatName || "BARCODE";

        onSuccess({
          code: normalized,
          format: formatName,
          timestamp: now,
          snapshotUrl,
        });
      };

      const qrCodeErrorCallback = (_errorMessage: string) => {
        // Continuous non-detection frames are expected during scanning
      };

      // Configuration optimized for both 1D horizontal product barcodes and 2D QR codes
      await this.scannerInstance.start(
        {
          facingMode: "environment",
        },
        {
          fps: 15, // Optimal 15 fps gives mobile CPU time to decode clean frames
          // Generous rectangular scanning zone matching horizontal 1D barcodes and QR codes
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const width = Math.min(Math.floor(viewfinderWidth * 0.92), 440);
            const height = Math.min(Math.floor(viewfinderHeight * 0.62), 300);
            return { width, height };
          },
          aspectRatio: 1.0,
          videoConstraints: {
            facingMode: "environment",
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          },
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      // Attempt continuous auto-focus on device camera if supported
      try {
        const video = document.querySelector<HTMLVideoElement>(`#${elementId} video`);
        if (video && video.srcObject) {
          const stream = video.srcObject as MediaStream;
          const track = stream.getVideoTracks()[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const capabilities = (track as any)?.getCapabilities?.();
          if (capabilities?.focusMode?.includes("continuous")) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (track as any).applyConstraints({ advanced: [{ focusMode: "continuous" }] });
          }
        }
      } catch (focusErr) {
        console.debug("Continuous camera focus not supported on this browser:", focusErr);
      }

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
