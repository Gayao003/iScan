"use client";

import React from "react";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import {
  Camera,
  Smartphone,
  Database,
  ShieldAlert,
  Info,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Settings & Diagnostics"
        description="PWA environment, camera permissions, and architecture status"
        breadcrumbs={[{ label: "Settings" }]}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Camera Permission Diagnostic Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
              <Camera className="w-4 h-4 text-primary" />
              <span>Camera Permissions & Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              iScan processes video frames strictly inside your browser window using client-side barcode libraries. No camera frames or videos are ever uploaded or saved.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <h5 className="font-semibold text-slate-800 mb-1">
                How to reset or change camera permission:
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>Click the lock or tune icon in the browser address bar.</li>
                <li>Ensure Camera is toggled to &quot;Allow&quot;.</li>
                <li>Reload this page.</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* PWA & Offline Status */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Progressive Web App (PWA)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>Installable Manifest</span>
              <Badge variant="success">Active (/manifest.json)</Badge>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span>Service Worker</span>
              <Badge variant="success">Registered (/sw.js)</Badge>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Display Mode</span>
              <Badge variant="outline">standalone (PWA)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Architecture & Backend Configuration */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
              <Database className="w-4 h-4 text-primary" />
              <span>Active Architecture & Integration Boundary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Phase 2 Active Backend
                </span>
                <span className="font-semibold text-slate-800">
                  Supabase PostgreSQL / Mock
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  MSSQL & Odoo Status
                </span>
                <span className="font-semibold text-amber-700">
                  Deferred (Future Phase)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>
                To configure live Supabase credentials, provide <code>DATABASE_URL</code> and <code>DIRECT_DATABASE_URL</code> in your deployment environment variables.
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
