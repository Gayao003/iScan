"use client";

import React from "react";
import { QrCode, Barcode as BarcodeIcon } from "lucide-react";

interface BarcodeVisualizerProps {
  code: string;
  format?: string;
  className?: string;
}

export function BarcodeVisualizer({
  code,
  format = "EAN_13",
  className = "",
}: BarcodeVisualizerProps) {
  const isQR = format?.toUpperCase().includes("QR") || code.startsWith("ISCAN-DEMO");

  // Format code for display: e.g. EAN-13 as "4 801981 127177"
  const formattedCode =
    code.length === 13 && /^\d+$/.test(code)
      ? `${code.slice(0, 1)} ${code.slice(1, 7)} ${code.slice(7, 13)}`
      : code;

  if (isQR) {
    return (
      <div className={`flex flex-col items-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <QrCode className="w-4 h-4 text-primary" />
          <span>2D QR Code</span>
        </div>
        <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white">
          <QrCode className="w-20 h-20" />
        </div>
        <span className="mt-2 font-mono text-xs font-bold text-slate-800 tracking-wider">
          {code}
        </span>
      </div>
    );
  }

  // Generate deterministic barcode bar widths based on code characters
  const bars: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const val = code.charCodeAt(i);
    bars.push((val % 3) + 1, (Math.floor(val / 3) % 2) + 1, (val % 2) + 1, 1);
  }

  return (
    <div className={`flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between w-full mb-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <BarcodeIcon className="w-4 h-4 text-primary" />
          <span>{format || "EAN-13 / 1D Barcode"}</span>
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Decoded
        </span>
      </div>

      {/* Barcode Stripes Graphic */}
      <div className="flex items-end justify-center h-14 w-full px-2 gap-0.5 overflow-hidden">
        {/* Guard bars left */}
        <div className="w-1 h-14 bg-slate-900 shrink-0" />
        <div className="w-0.5 h-14 bg-white shrink-0" />
        <div className="w-1 h-14 bg-slate-900 shrink-0" />

        {/* Data bars */}
        {bars.slice(0, 32).map((width, idx) => (
          <React.Fragment key={idx}>
            <div
              className={`bg-slate-900 shrink-0 ${idx % 2 === 0 ? "h-12" : "h-14"}`}
              style={{ width: `${Math.max(1, width * 1.6)}px` }}
            />
            <div
              className="bg-white shrink-0"
              style={{ width: `${Math.max(1, (3 - width) * 1.3)}px` }}
            />
          </React.Fragment>
        ))}

        {/* Guard bars right */}
        <div className="w-1 h-14 bg-slate-900 shrink-0" />
        <div className="w-0.5 h-14 bg-white shrink-0" />
        <div className="w-1 h-14 bg-slate-900 shrink-0" />
      </div>

      {/* Human-readable number below barcode */}
      <div className="mt-2 text-center">
        <span className="font-mono text-base font-extrabold tracking-[0.25em] text-slate-900">
          {formattedCode}
        </span>
      </div>
    </div>
  );
}
