import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DesktopSidebar } from "@/shared/components/layout/DesktopSidebar";
import { MobileBottomNav } from "@/shared/components/layout/MobileBottomNav";
import { ServiceWorkerRegister } from "@/shared/components/layout/ServiceWorkerRegister";
import { InstallPrompt } from "@/shared/components/layout/InstallPrompt";

export const metadata: Metadata = {
  title: "iScan - Mobile Inventory Scanning",
  description:
    "Mobile-first PWA for barcode/QR inventory scanning, physical count recording, and reconciliation.",
  manifest: "/manifest.json",
  applicationName: "iScan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iScan",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1e40af",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="iScan" />
      </head>
      <body className="antialiased min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 select-none">
        <ServiceWorkerRegister />
        <InstallPrompt />

        {/* Desktop Sidebar (visible on md+) */}
        <DesktopSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 overflow-x-hidden">
          {children}
        </div>

        {/* Mobile Bottom Navigation (visible on mobile only) */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
