"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { ManualEntryForm } from "@/features/scanner/components/ManualEntryForm";
import {
  FileQuestion,
  ScanLine,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

interface ItemNotFoundCardProps {
  scannedCode: string;
}

export function ItemNotFoundCard({ scannedCode }: ItemNotFoundCardProps) {
  return (
    <Card className="border-amber-200 bg-amber-50/20 shadow-md">
      <CardContent className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-1">
          Item Not Found in Catalog
        </h2>
        <p className="text-xs text-slate-600 max-w-sm mx-auto mb-4">
          The code was read successfully, but no matching item was found in the catalog database.
        </p>

        {/* Scanned code highlight */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-amber-200 shadow-sm mb-6">
          <span className="text-xs text-slate-500">Scanned code:</span>
          <span className="font-mono text-sm font-bold text-slate-900">
            {scannedCode}
          </span>
        </div>

        {/* Manual correction entry */}
        <div className="max-w-md mx-auto mb-6 text-left bg-white p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span>Search or Correct Code Manually</span>
          </h4>
          <ManualEntryForm />
        </div>

        {/* Secondary options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <Button
            asChild
            variant="outline"
            className="flex-1 gap-2 bg-white"
          >
            <Link href="/">
              <ScanLine className="w-4 h-4" />
              <span>Scan Again</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="flex-1 gap-2 border-slate-300"
          >
            <Link href={`/counts?code=${encodeURIComponent(scannedCode)}`}>
              <PlusCircle className="w-4 h-4 text-slate-600" />
              <span>Record Count for this Code</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
