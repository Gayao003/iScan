"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/Button";
import { Download, X, Share, PlusSquare, Smartphone, HelpCircle } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isHuawei, setIsHuawei] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Check device types
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsHuawei(/huawei|honor|harmonyos|hms/.test(userAgent));

    // Check session dismissal
    const dismissed = sessionStorage.getItem("iscan_install_dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }

    // Capture Chrome/Android install event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  // Do not show if already installed as standalone app or dismissed
  if (isStandalone || isDismissed) {
    return null;
  }

  // Handle Android / Chrome install click
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowGuide(true);
      return;
    }

    try {
      setIsInstalling(true);
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } catch (e) {
      console.warn("Install prompt error:", e);
      setShowGuide(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("iscan_install_dismissed", "true");
  };

  // Only render if we have a prompt available or if on iOS
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Banner for Mobile & Desktop */}
      <div className="fixed bottom-16 md:bottom-5 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-blue-700 shadow-inner flex items-center justify-center">
                <Image
                  src="/icons/icon-192.png"
                  alt="iScan Icon"
                  width={44}
                  height={44}
                  className="rounded-xl"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Install iScan App</span>
                </h4>
                <p className="text-xs text-slate-300 leading-snug">
                  Add to Home Screen for fullscreen camera scanning without address bar.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              aria-label="Dismiss install prompt"
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 pt-1">
            {deferredPrompt ? (
              <Button
                onClick={handleInstallClick}
                variant="primary"
                size="sm"
                className="flex-1 gap-1.5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isInstalling ? "Installing..." : "Add to Home Screen"}</span>
              </Button>
            ) : isIOS ? (
              <Button
                onClick={() => setShowGuide(true)}
                variant="primary"
                size="sm"
                className="flex-1 gap-1.5 bg-blue-600 hover:bg-blue-500 font-semibold text-xs shadow-md"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>How to Install on iPhone</span>
              </Button>
            ) : null}

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-xs text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Later
            </Button>
          </div>

          {/* Helper hint for Huawei & manual install */}
          <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
            <span>Stuck on installing or using Huawei?</span>
            <button
              onClick={() => setShowGuide(true)}
              className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Manual Steps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Install Instruction Modal (Huawei, Android & iOS) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white text-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <span>Add iScan to Home Screen</span>
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Downloads folder reminder */}
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-snug">
              <strong>Downloads Notice:</strong> PWAs install directly as an icon on your phone&apos;s Home Screen. They do <strong>not</strong> save an <code>.apk</code> file in your Downloads folder.
            </p>

            {isIOS ? (
              /* iOS Safari instructions */
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Safari on iOS does not support one-click install, but you can add it in two quick taps:
                </p>
                <ol className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                      1
                    </div>
                    <div>
                      Tap the <span className="font-semibold text-slate-900">Share</span> icon in Safari&apos;s bottom bar.
                      <div className="mt-1 flex items-center gap-1 text-primary font-medium">
                        <Share className="w-3.5 h-3.5" />
                        <span>Share button</span>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                      2
                    </div>
                    <div>
                      Scroll down and tap <span className="font-semibold text-slate-900">&quot;Add to Home Screen&quot;</span>.
                      <div className="mt-1 flex items-center gap-1 text-primary font-medium">
                        <PlusSquare className="w-3.5 h-3.5" />
                        <span>Add to Home Screen</span>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            ) : (
              /* Huawei and Android instructions */
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  {isHuawei || true ? (
                    <>
                      If Chrome or Huawei Browser gets stuck on &quot;Installing...&quot;, use this direct 2-step method:
                    </>
                  ) : (
                    <>
                      Add directly via your browser menu:
                    </>
                  )}
                </p>
                <ol className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                      1
                    </div>
                    <div>
                      Look at the top-right corner of Chrome or Huawei Browser and tap the{" "}
                      <span className="font-bold text-slate-900">three dots menu (⋮)</span>.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                      2
                    </div>
                    <div>
                      Tap <span className="font-bold text-blue-700">&quot;Add to Home screen&quot;</span> (or &quot;Add to desktop&quot;), then tap <span className="font-bold text-slate-900">&quot;Add&quot;</span>.
                    </div>
                  </li>
                </ol>
                <p className="text-[11px] text-slate-500">
                  The iScan app icon will appear immediately on your home screen ready to use!
                </p>
              </div>
            )}

            <Button
              onClick={() => setShowGuide(false)}
              variant="primary"
              className="w-full text-xs font-semibold"
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
