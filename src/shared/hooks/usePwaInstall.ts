"use client";

import { useState, useEffect, useCallback } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((fn) => fn());
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    promptListeners.forEach((fn) => fn());
  });
}

export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isHuawei, setIsHuawei] = useState(false);
  const [installState, setInstallState] = useState<"idle" | "prompted" | "accepted" | "dismissed">("idle");

  const syncState = useCallback(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsHuawei(/huawei|honor|harmonyos|hms/.test(ua));
    setCanInstall(!!globalDeferredPrompt);
  }, []);

  useEffect(() => {
    syncState();
    promptListeners.add(syncState);
    return () => {
      promptListeners.delete(syncState);
    };
  }, [syncState]);

  const triggerInstall = async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!globalDeferredPrompt) {
      return "unavailable";
    }

    try {
      setInstallState("prompted");
      await globalDeferredPrompt.prompt();
      const { outcome } = await globalDeferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallState("accepted");
        globalDeferredPrompt = null;
        setCanInstall(false);
        setIsStandalone(true);
      } else {
        setInstallState("dismissed");
      }
      return outcome;
    } catch (err) {
      console.warn("PWA install error:", err);
      setInstallState("idle");
      return "unavailable";
    }
  };

  return {
    canInstall,
    isStandalone,
    isIOS,
    isHuawei,
    installState,
    triggerInstall,
  };
}
