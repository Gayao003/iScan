"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { BarcodeVisualizer } from "@/shared/components/ui/BarcodeVisualizer";
import {
  ScanLine,
  Camera,
  AlertCircle,
  FileQuestion,
} from "lucide-react";

interface ItemNotFoundCardProps {
  scannedCode: string;
}

export function ItemNotFoundCard({ scannedCode }: ItemNotFoundCardProps) {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSnapshot = sessionStorage.getItem(`iscan_snapshot_${scannedCode}`);
      if (savedSnapshot) {
        setSnapshotUrl(savedSnapshot);
      }
    }
  }, [scannedCode]);

  return (
    <Card className="overflow-hidden border-slate-200 shadow-xl">
      {/* Captured Camera Snapshot Banner if available */}
      {snapshotUrl ? (
        <div className="relative w-full h-64 sm:h-72 bg-slate-950 flex items-center justify-center border-b border-slate-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={snapshotUrl}
            alt="Scanned item camera snapshot"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs sm:text-sm px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Captured Photo</span>
          </div>
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Not In Database</span>
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-10 bg-slate-900 text-white text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-2">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Item Not Found</h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-sm mx-auto">
            This barcode is not registered in the database catalog.
          </p>
        </div>
      )}

      <CardContent className="p-5 sm:p-7 space-y-5">
        {/* Detected Barcode Visualization */}
        <BarcodeVisualizer code={scannedCode} />

        {/* Clear Not Found Notice with larger, readable typography */}
        <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 text-center space-y-2 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-rose-100 text-rose-800">
            <AlertCircle className="w-4 h-4" />
            <span>Database Lookup Result</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Barcode Does Not Exist in Database
          </h3>
          <p className="text-base sm:text-lg font-mono font-bold text-rose-900 tracking-wider">
            {scannedCode}
          </p>
          <p className="text-xs sm:text-sm text-slate-600">
            Check the barcode number or verify that this product has been registered in the database catalog.
          </p>
        </div>

        {/* Single Primary Action: Scan Next Item */}
        <div className="pt-2">
          <Button
            asChild
            variant="primary"
            className="w-full gap-2.5 shadow-md font-bold text-base sm:text-lg bg-blue-600 hover:bg-blue-700 py-3.5 sm:py-4 rounded-xl"
          >
            <Link href="/">
              <ScanLine className="w-5 h-5 text-white" />
              <span>Scan Next Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
