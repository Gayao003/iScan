import { IScannerAdapter } from "./scanner-adapter.interface";
import { ScanResult } from "@/shared/types/scanner";
import { normalizeItemCode } from "@/shared/utils/normalize";

function isValidGs1Checksum(code: string): boolean {
  if (code.length === 13 && /^\d{13}$/.test(code)) {
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code[i], 10);
      sum += i % 2 === 0 ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(code[12], 10);
  }
  if (code.length === 8 && /^\d{8}$/.test(code)) {
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const digit = parseInt(code[i], 10);
      sum += i % 2 === 0 ? digit * 3 : digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(code[7], 10);
  }
  return true;
}

export class Html5QrcodeAdapter implements IScannerAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private scannerInstance: any = null;
  private scanning = false;
  private isPaused = false;
  private lastScannedCode = "";
  private lastScannedTime = 0;
  private readonly debounceMs = 1500;

  // Active stream and session state for multi-lens & zoom controls
  private currentElementId = "";
  private currentOnSuccess: ((result: ScanResult) => void) | null = null;
  private currentOnError: ((error: Error) => void) | null = null;
  private currentCameraId: string | null = null;

  async getCameras(): Promise<Array<{ id: string; label: string }>> {
    if (typeof window === "undefined") return [];
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const devices = await Html5Qrcode.getCameras();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return devices.map((d: any, index: number) => ({
        id: d.id,
        label: d.label || `Camera ${index + 1}`,
      }));
    } catch (e) {
      console.warn("Could not retrieve camera list:", e);
      return [];
    }
  }

  async start(
    elementId: string,
    onSuccess: (result: ScanResult) => void,
    onError: (error: Error) => void,
    cameraId?: string
  ): Promise<void> {
    if (typeof window === "undefined") return;

    this.currentElementId = elementId;
    this.currentOnSuccess = onSuccess;
    this.currentOnError = onError;
    if (cameraId) {
      this.currentCameraId = cameraId;
    }

    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import("html5-qrcode");

      if (this.scannerInstance) {
        await this.stop();
      }

      // Explicitly support standard retail barcodes & warehouse codes (high-performance decoding)
      // Note: UPC_A (12-digit) is excluded to prevent partial 12-digit phantom truncations on 13-digit EAN items
      const formatsToSupport = [
        Html5QrcodeSupportedFormats.EAN_13,          // Standard 13-digit retail barcodes (Coca-Cola, groceries)
        Html5QrcodeSupportedFormats.EAN_8,           // Small retail packaging
        Html5QrcodeSupportedFormats.CODE_128,        // Logistics, warehouse inventory
        Html5QrcodeSupportedFormats.CODE_39,         // Industrial inventory
        Html5QrcodeSupportedFormats.ITF,             // Interleaved 2 of 5 (cartons/cases)
        Html5QrcodeSupportedFormats.QR_CODE,         // 2D QR Code
        Html5QrcodeSupportedFormats.DATA_MATRIX,     // 2D Data Matrix
      ];

      // Cross-device universal ZXing configuration
      this.scannerInstance = new Html5Qrcode(elementId, {
        formatsToSupport,
        verbose: false,
      });

      const qrCodeSuccessCallback = (decodedText: string, decodedResult: unknown) => {
        const now = Date.now();
        const normalized = normalizeItemCode(decodedText);

        if (this.isPaused) return;

        // Discard 12-digit partial reads to prevent phantom truncations
        if (/^\d{12}$/.test(normalized)) {
          return;
        }

        // Validate GS1 checksum for 13-digit EAN retail barcodes
        if (/^\d{13}$/.test(normalized) && !isValidGs1Checksum(normalized)) {
          return;
        }

        // Debounce duplicate scans within debounceMs window
        if (
          normalized === this.lastScannedCode &&
          now - this.lastScannedTime < this.debounceMs
        ) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatName = (decodedResult as any)?.result?.format?.formatName || "BARCODE";

        // Confirmed valid barcode (passed GS1 checksum validation)
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

      const cameraSource = this.currentCameraId
        ? this.currentCameraId
        : { facingMode: "environment" };

      // Configuration: full-frame detection without qrbox cropping
      // Eliminates coordinate mismatch bugs on Android/Huawei display scaling
      await this.scannerInstance.start(
        cameraSource,
        {
          fps: 15,
          disableFlip: true,
          aspectRatio: 1.333333,
          videoConstraints: this.currentCameraId
            ? { deviceId: { exact: this.currentCameraId } }
            : { facingMode: "environment" },
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

  async switchCamera(cameraId: string): Promise<void> {
    this.currentCameraId = cameraId;
    if (this.currentElementId && this.currentOnSuccess && this.currentOnError) {
      await this.stop();
      await this.start(this.currentElementId, this.currentOnSuccess, this.currentOnError, cameraId);
    }
  }

  async setZoom(zoomLevel: number): Promise<boolean> {
    try {
      const video = document.querySelector<HTMLVideoElement>(`#${this.currentElementId} video`);
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities = (track as any)?.getCapabilities?.();
        if (capabilities?.zoom) {
          const min = capabilities.zoom.min || 1;
          const max = capabilities.zoom.max || 3;
          const target = Math.min(Math.max(zoomLevel, min), max);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (track as any).applyConstraints({ advanced: [{ zoom: target }] });
          return true;
        }
      }
    } catch (e) {
      console.debug("Zoom apply error:", e);
    }
    return false;
  }

  async toggleTorch(enable: boolean): Promise<boolean> {
    try {
      const video = document.querySelector<HTMLVideoElement>(`#${this.currentElementId} video`);
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const track = stream.getVideoTracks()[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities = (track as any)?.getCapabilities?.();
        if (capabilities?.torch) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (track as any).applyConstraints({ advanced: [{ torch: enable }] });
          return true;
        }
      }
    } catch (e) {
      console.debug("Torch error:", e);
    }
    return false;
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
