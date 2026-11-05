"use client";

import React from "react";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { ScannerView } from "@/features/scanner/components/ScannerView";
import { ManualEntryForm } from "@/features/scanner/components/ManualEntryForm";
import { InstallAppCard } from "@/shared/components/layout/InstallAppCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Keyboard, Sparkles, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Scan Inventory Item"
        description="Point your device camera at a 1D barcode or 2D QR code"
      />

      <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Camera Scanner View */}
        <section aria-label="Camera scanner">
          <ScannerView />
        </section>

        {/* Manual Input Fallback */}
        <section aria-label="Manual barcode input">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                <Keyboard className="w-4 h-4 text-primary" />
                <span>Manual Code Entry Fallback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ManualEntryForm />
            </CardContent>
          </Card>
        </section>

        {/* In-Page PWA Install Section */}
        <section aria-label="Download and install app">
          <InstallAppCard compact={true} />
        </section>

        {/* POC Demo Fixture Helper */}
        <section aria-label="Demo fixtures">
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/60 text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Phase 2 POC Verification Fixtures</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Verify scanning with pre-configured catalog items:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
              <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-blue-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ISCAN-DEMO-001 (T-Shirt QR)</span>
              </li>
              <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-blue-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>0123456789012 (Jeans 1D)</span>
              </li>
              <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-blue-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>789012345678 (Shoes)</span>
              </li>
              <li className="flex items-center gap-1.5 bg-white p-2 rounded border border-blue-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ITEM-NO-IMAGE-999 (No Image)</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
