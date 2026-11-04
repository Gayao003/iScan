"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import {
  scanHistoryStorage,
  HistoryItem,
} from "@/features/history/storage/scan-history-storage";
import { History, Trash2, ArrowRight, Barcode, ScanLine } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(scanHistoryStorage.getHistory());
  }, []);

  const handleClear = () => {
    scanHistoryStorage.clearHistory();
    setHistory([]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Recent Scan History"
        description="Local history of recent scans captured on this device"
        breadcrumbs={[{ label: "History" }]}
        action={
          history.length > 0 && (
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="gap-1.5 text-danger border-rose-200 hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </Button>
          )
        }
      />

      <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
        {history.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-semibold text-slate-700">
              No Recent Scans
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Items scanned using the camera or looked up manually will appear here for fast recall.
            </p>
            <Button asChild variant="primary" size="sm" className="gap-2 mt-2">
              <Link href="/">
                <ScanLine className="w-4 h-4" />
                <span>Start Scanning</span>
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, idx) => (
              <Link
                key={`${item.code}-${idx}`}
                href={`/item/${encodeURIComponent(item.code)}`}
                className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-primary/50 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                    <Barcode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {item.name || item.code}
                    </h4>
                    <p className="font-mono text-xs text-slate-500">
                      {item.code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={item.status === "found" ? "success" : "warning"}
                    className="text-[10px] capitalize"
                  >
                    {item.status === "found" ? "Found" : "Unknown"}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
