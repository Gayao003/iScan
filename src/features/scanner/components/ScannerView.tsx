"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeAdapter } from "../adapters/html5-qrcode-adapter";
import { PermissionStatus, ScanResult } from "@/shared/types/scanner";
import { Button } from "@/shared/components/ui/Button";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/Alert";
import {
  Camera,
  CameraOff,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock,
  ZoomIn,
} from "lucide-react";
import { scanHistoryStorage } from "@/features/history/storage/scan-history-storage";

const ZOOM_LEVELS = [1, 2, 3, 4, 5] as const;
type ZoomLevel = (typeof ZOOM_LEVELS)[number];

interface ScannerViewProps {
  onScanSuccess?: (code: string) => void;
}

export function ScannerView({ onScanSuccess }: ScannerViewProps) {
  const router = useRouter();
  const adapterRef = useRef<Html5QrcodeAdapter | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionStatus>("prompt");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCode, setDetectedCode] = useState<string | null>(null);

  const scannerElementId = "iscan-camera-preview";

  const [detectedFormat, setDetectedFormat] = useState<string | null>(null);
  const [snapshotPreview, setSnapshotPreview] = useState<string | null>(null);

  // Clean single-button hardware zoom cycling (1x -> 2x -> 3x -> 4x -> 5x -> 1x)
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(1);

  const handleDetected = useCallback((result: ScanResult) => {
    setDetectedCode(result.code);
    setDetectedFormat(result.format || "BARCODE");
    setSnapshotPreview(result.snapshotUrl || null);
    setIsScanning(false);

    // Haptic and audio beep feedback upon successful detection
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(80);
      } catch {}
    }
    if (typeof window !== "undefined") {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        }
      } catch {}
    }
    
    // Pause adapter immediately upon detection
    if (adapterRef.current) {
      adapterRef.current.pause();
    }

    // Save to history
    scanHistoryStorage.addEntry({
      code: result.code,
      status: "found",
    });

    if (onScanSuccess) {
      onScanSuccess(result.code);
    } else {
      setTimeout(() => {
        router.push(`/item/${encodeURIComponent(result.code)}`);
      }, 500);
    }
  }, [onScanSuccess, router]);

  const startScanner = async (cameraId?: string) => {
    try {
      setErrorMessage(null);
      setDetectedCode(null);

      // Check if getUserMedia is available in current browser/context
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setPermissionState("unavailable");
        setErrorMessage(
          "Camera access is not supported by your browser or requires a secure HTTPS connection."
        );
        return;
      }

      if (!adapterRef.current) {
        adapterRef.current = new Html5QrcodeAdapter();
      }

      setPermissionState("granted");
      setIsScanning(true);

      await adapterRef.current.start(
        scannerElementId,
        handleDetected,
        (error) => {
          const errStr = error.message.toLowerCase();
          if (errStr.includes("permission") || errStr.includes("notallowederror")) {
            setPermissionState("denied");
            setErrorMessage(
              "Camera permission was denied. Please allow camera permissions in your browser address bar."
            );
          } else if (errStr.includes("notfounderror") || errStr.includes("devicesnotfound")) {
            setPermissionState("unavailable");
            setErrorMessage("No active camera found on this device.");
          } else {
            setPermissionState("error");
            setErrorMessage(error.message || "Failed to initialize camera scanner.");
          }
          setIsScanning(false);
        },
        cameraId
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const errStr = error.message.toLowerCase();
      if (errStr.includes("permission") || errStr.includes("notallowederror")) {
        setPermissionState("denied");
        setErrorMessage("Camera access permission was denied.");
      } else {
        setPermissionState("error");
        setErrorMessage(error.message || "Could not access camera.");
      }
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (adapterRef.current) {
      await adapterRef.current.stop();
      setIsScanning(false);
      setZoomLevel(1);
    }
  };

  // Single button zoom cycle: 1x -> 2x -> 3x -> 4x -> 5x -> 1x
  const handleCycleZoom = async () => {
    if (!adapterRef.current) return;
    const currentIdx = ZOOM_LEVELS.indexOf(zoomLevel);
    const nextZoom = ZOOM_LEVELS[(currentIdx + 1) % ZOOM_LEVELS.length];
    await adapterRef.current.setZoom(nextZoom);
    setZoomLevel(nextZoom);
  };

  useEffect(() => {
    return () => {
      if (adapterRef.current) {
        adapterRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Scanner Viewport Container: 4:3 native smartphone aspect ratio */}
      <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex items-center justify-center">
        {/* html5-qrcode mount target */}
        <div id={scannerElementId} className="w-full h-full" />

        {/* Framing Overlay when scanning */}
        {isScanning && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Viewfinder Target Frame - Wide horizontal rectangle for 1D barcodes and 2D QR */}
            <div className="w-[90%] h-[60%] max-w-[350px] max-h-[230px] border-2 border-dashed border-blue-400/90 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
              <div className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1 rounded-br-xl" />
              
              {/* Laser scanning line animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse absolute top-1/2 -translate-y-1/2" />
            </div>
            <p className="absolute bottom-4 text-center text-[11px] text-white/95 bg-black/75 px-3 py-1 rounded-full font-medium tracking-wide border border-white/10 shadow-lg">
              Hold bottle horizontally ~15–20cm away
            </p>
          </div>
        )}

        {/* State: Prompt (not yet started) */}
        {!isScanning && permissionState === "prompt" && (
          <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold mb-1">Camera Scanner</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-6">
              Camera access is used locally to detect item barcodes and QR codes. No video is uploaded or recorded.
            </p>
            <Button
              onClick={() => startScanner()}
              variant="primary"
              className="w-full max-w-xs gap-2 font-semibold shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>Start Camera Scanner</span>
            </Button>
          </div>
        )}

        {/* State: Denied */}
        {permissionState === "denied" && !isScanning && (
          <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Camera Permission Blocked</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-4">
              Please click the camera or lock icon in your browser address bar to allow camera access.
            </p>
            <Button
              onClick={() => startScanner()}
              variant="secondary"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        )}

        {/* State: Unavailable */}
        {permissionState === "unavailable" && !isScanning && (
          <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <CameraOff className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold mb-1">No Camera Available</h3>
            <p className="text-xs text-slate-300 max-w-xs mb-4">
              {errorMessage || "No compatible camera device was detected on this system."}
            </p>
            <p className="text-xs text-blue-300">
              Use manual code entry below to look up items.
            </p>
          </div>
        )}

        {/* Detected Code feedback overlay with snapshot thumbnail */}
        {detectedCode && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-in fade-in zoom-in-95 duration-200">
            {snapshotPreview ? (
              <div className="relative w-28 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-lg mb-3 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={snapshotPreview}
                  alt="Scanned barcode snapshot"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            ) : (
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
            )}
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              {detectedFormat || "Barcode"} Detected
            </p>
            <p className="text-xl font-mono font-bold text-white mt-1 tracking-wider">
              {detectedCode}
            </p>
            <p className="text-xs text-slate-400 mt-2">Loading item details...</p>
          </div>
        )}
      </div>

      {/* Camera Controls Bar - Clean, streamlined controls */}
      <div className="mt-3 flex items-center justify-center gap-2 w-full max-w-md">
        {isScanning ? (
          <>
            {/* Single clean zoom button that cycles 1x -> 2x -> 3x -> 4x -> 5x -> 1x */}
            <button
              onClick={handleCycleZoom}
              type="button"
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg shadow-sm border transition-all ${
                zoomLevel > 1
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-blue-100"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300"
              }`}
              title="Click to cycle zoom: 1x -> 2x -> 3x -> 4x -> 5x -> 1x"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{zoomLevel}x</span>
            </button>

            <Button
              onClick={stopScanner}
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-slate-700 bg-white shadow-sm"
            >
              <CameraOff className="w-4 h-4 text-slate-500" />
              <span>Stop Camera</span>
            </Button>

            <Button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              variant="outline"
              size="sm"
              title="Reload latest version from server"
              className="px-3 text-slate-500 hover:text-slate-800 bg-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </>
        ) : (
          permissionState !== "prompt" && (
            <Button
              onClick={() => startScanner()}
              variant="outline"
              size="sm"
              className="w-full gap-2 text-slate-700 bg-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Restart Camera</span>
            </Button>
          )
        )}
      </div>

      {/* Error alert if any */}
      {errorMessage && permissionState === "error" && (
        <Alert variant="destructive" className="mt-4 max-w-md">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Scanner Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
