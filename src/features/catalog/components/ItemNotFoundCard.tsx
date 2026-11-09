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
            alt="Scanned camera snapshot"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Captured Photo</span>
          </div>
          <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Not In Database</span>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-900 text-white text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-2">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Item Not Found</h2>
          <p className="text-xs text-slate-300 max-w-xs mx-auto">
            This barcode is not registered in the database catalog.
          </p>
        </div>
      )}

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Detected Barcode Visualization */}
        <BarcodeVisualizer code={scannedCode} />

        {/* Clear Not Found Notice */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Not Found</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Barcode Does Not Exist in Database
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto font-mono">
            {scannedCode}
          </p>
        </div>

        {/* Single Primary Action: Scan Next Item */}
        <div className="pt-2">
          <Button
            asChild
            variant="primary"
            className="w-full gap-2 shadow font-semibold bg-blue-600 hover:bg-blue-700 py-2.5"
          >
            <Link href="/">
              <ScanLine className="w-4 h-4 text-white" />
              <span>Scan Next Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
