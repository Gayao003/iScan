"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for any updates to the service worker whenever the app opens
          registration.update().catch(() => {});
        })
        .catch((error) => {
          console.warn("iScan SW registration failed:", error);
        });

      // Reload smoothly if a new service worker took over to ensure newest UI
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  return null;
}
