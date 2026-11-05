"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePwaInstall } from "@/shared/hooks/usePwaInstall";
import { Button } from "@/shared/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share,
  MoreVertical,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface InstallAppCardProps {
  compact?: boolean;
}

export function InstallAppCard({ compact = false }: InstallAppCardProps) {
  const { canInstall, isStandalone, isIOS, isHuawei, installState, triggerInstall } = usePwaInstall();
  const [showManualGuide, setShowManualGuide] = useState(!compact);
  const [installClicked, setInstallClicked] = useState(false);

  const handleInstall = async () => {
    setInstallClicked(true);
    await triggerInstall();
  };

  if (isStandalone) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-950">iScan App Installed</h4>
                <Badge variant="success" className="text-[10px]">Standalone</Badge>
              </div>
              <p className="text-xs text-emerald-800">
                You are running the full-screen standalone PWA on this device.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-white shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-blue-700 shadow-md flex items-center justify-center">
              <Image
                src="/icons/icon-192.png"
                alt="iScan Icon"
                width={44}
                height={44}
                className="rounded-xl"
              />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <span>Download / Install iScan App</span>
              </CardTitle>
              <p className="text-xs text-blue-200 leading-snug mt-0.5">
                Add to your phone home screen for full-screen camera scanning without address bars.
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3.5">
        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row gap-2">
          {canInstall ? (
            <Button
              onClick={handleInstall}
              variant="primary"
              className="flex-1 gap-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{installClicked ? "Installing..." : "Add to Home Screen (1-Tap Install)"}</span>
            </Button>
          ) : isIOS ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
              <Share className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">iOS Safari Install:</span> Tap Safari&apos;s{" "}
                <span className="font-semibold">Share</span> icon (⎋), then scroll down and tap{" "}
                <span className="font-semibold">&quot;Add to Home Screen&quot;</span>.
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setShowManualGuide(true)}
              variant="primary"
              className="flex-1 gap-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Add to Home Screen</span>
            </Button>
          )}

          <Button
            onClick={() => setShowManualGuide(!showManualGuide)}
            variant="outline"
            className="text-xs text-slate-700 border-slate-300 gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Install Guide</span>
            {showManualGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
        </div>

        {/* Downloads folder notice */}
        <div className="flex items-start gap-2 p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-snug">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Notice for Downloads folder:</span> PWAs install directly to your device&apos;s Home Screen. They do <strong>NOT</strong> download an <code>.apk</code> installer file into your Downloads folder.
          </div>
        </div>

        {/* Detailed manual install instructions */}
        {showManualGuide && (
          <div className="space-y-3 pt-1 border-t border-slate-100 text-xs">
            {/* Huawei / Non-GMS Guide */}
            <div className={`p-3 rounded-xl border ${isHuawei ? "bg-blue-50/80 border-blue-300 ring-1 ring-blue-400" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Huawei &amp; Non-GMS Phones (If &quot;Installing...&quot; hangs)</span>
                </span>
                {isHuawei && <Badge variant="primary" className="text-[10px]">Your Device</Badge>}
              </div>
              <p className="text-slate-600 mb-2 leading-relaxed">
                Huawei phones without Google Play Services may freeze on &quot;Installing...&quot; because Google&apos;s WebAPK server is unreachable. Use browser shortcut instead:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 font-medium">
                <li>
                  Look at the top-right corner of your browser and tap the <span className="font-bold text-slate-900">three dots menu (⋮)</span>.
                </li>
                <li>
                  Select <span className="font-bold text-blue-700">&quot;Add to Home screen&quot;</span> (or &quot;Add to desktop&quot;).
                </li>
                <li>
                  Tap <span className="font-bold text-slate-900">&quot;Add&quot;</span>. The iScan icon will appear immediately on your home screen!
                </li>
              </ol>
            </div>

            {/* Standard Android Guide */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Smartphone className="w-4 h-4 text-slate-600" />
                <span>Xiaomi / Samsung / Standard Android</span>
              </span>
              <p className="text-slate-600 mb-2">
                Tap the blue <strong>&quot;Add to Home Screen&quot;</strong> button above, or tap your browser&apos;s menu (<strong>⋮</strong>) → <strong>&quot;Install app&quot;</strong>.
              </p>
            </div>

            {/* iOS Guide */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Share className="w-4 h-4 text-slate-600" />
                <span>Apple iOS (iPhone / iPad)</span>
              </span>
              <p className="text-slate-600">
                In Safari, tap the <strong>Share</strong> icon (square with arrow) at the bottom, scroll down, and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
