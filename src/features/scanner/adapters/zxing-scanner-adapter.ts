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

export class ZxingScannerAdapter implements IScannerAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private reader: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private controls: any = null;
  private scanning = false;
  private isPaused = false;
  private lastScannedCode = "";
  private lastScannedTime = 0;
  private readonly debounceMs = 1500;
  private activeVideoElement: HTMLVideoElement | null = null;
  private activeStream: MediaStream | null = null;

  async start(
    elementId: string,
    onSuccess: (result: ScanResult) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      if (this.controls) {
        await this.stop();
      }

      const { BrowserMultiFormatReader, BarcodeFormat } = await import("@zxing/browser");
      const { DecodeHintType } = await import("@zxing/library");

      // Configure formats and TRY_HARDER for curved / challenging barcodes
      const hints = new Map();
      const formats = [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.ITF,
        BarcodeFormat.QR_CODE,
        BarcodeFormat.DATA_MATRIX,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      hints.set(DecodeHintType.TRY_HARDER, true);

      this.reader = new BrowserMultiFormatReader(hints);

      // Mount or find the video preview element
      const container = document.getElementById(elementId);
      if (!container) {
        throw new Error(`Target container #${elementId} not found.`);
      }

      container.innerHTML = "";
      const video = document.createElement("video");
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      container.appendChild(video);
      this.activeVideoElement = video;

      // Start stream directly with ZXing Browser
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      this.controls = await this.reader.decodeFromConstraints(
        constraints,
        video,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: any, err: any) => {
          if (this.isPaused || !result) {
            return;
          }

          const rawText = result.getText ? result.getText() : String(result);
          if (!rawText) return;

          const normalized = normalizeItemCode(rawText);
          const now = Date.now();

          // Reject 12-digit partial truncations
          if (/^\d{12}$/.test(normalized)) {
            return;
          }

          // Validate GS1 checksum for 13-digit EAN retail barcodes
          if (/^\d{13}$/.test(normalized) && !isValidGs1Checksum(normalized)) {
            return;
          }

          // Debounce duplicate scans
          if (
            normalized === this.lastScannedCode &&
            now - this.lastScannedTime < this.debounceMs
          ) {
            return;
          }

          this.lastScannedCode = normalized;
          this.lastScannedTime = now;

          // Capture snapshot frame from video element
          let snapshotUrl: string | undefined;
          try {
            if (video.videoWidth && video.videoHeight) {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                snapshotUrl = canvas.toDataURL("image/jpeg", 0.85);
                sessionStorage.setItem(`iscan_snapshot_${normalized}`, snapshotUrl);
              }
            }
          } catch (e) {
            console.debug("Could not capture snapshot:", e);
          }

          const formatName = result.getBarcodeFormat
            ? String(BarcodeFormat[result.getBarcodeFormat()] || "BARCODE")
            : "BARCODE";

          onSuccess({
            code: normalized,
            format: formatName,
            timestamp: now,
            snapshotUrl,
          });
        }
      );

      // Capture active stream for zoom and focus
      if (video.srcObject) {
        this.activeStream = video.srcObject as MediaStream;
        const track = this.activeStream.getVideoTracks()[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities = (track as any)?.getCapabilities?.();
        if (capabilities?.focusMode?.includes("continuous")) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (track as any).applyConstraints({ advanced: [{ focusMode: "continuous" }] }).catch(() => {});
        }
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

  async setZoom(zoomLevel: number): Promise<boolean> {
    try {
      if (this.activeStream) {
        const track = this.activeStream.getVideoTracks()[0];
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

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  async stop(): Promise<void> {
    try {
      if (this.controls) {
        this.controls.stop();
        this.controls = null;
      }
      if (this.activeStream) {
        this.activeStream.getTracks().forEach((track) => {
          track.stop();
        });
        this.activeStream = null;
      }
      if (this.activeVideoElement) {
        this.activeVideoElement.srcObject = null;
        this.activeVideoElement = null;
      }
    } catch (e) {
      console.debug("Stop error:", e);
    } finally {
      this.scanning = false;
      this.isPaused = false;
      this.reader = null;
    }
  }

  isScanning(): boolean {
    return this.scanning && !this.isPaused;
  }
}
