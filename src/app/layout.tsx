import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DesktopSidebar } from "@/shared/components/layout/DesktopSidebar";
import { MobileBottomNav } from "@/shared/components/layout/MobileBottomNav";
import { ServiceWorkerRegister } from "@/shared/components/layout/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "iScan - Mobile Inventory Scanning",
  description:
    "Mobile-first PWA for barcode/QR inventory scanning, count recording, and reconciliation.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "iScan",
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
      <body className="antialiased min-h-screen flex flex-col md:flex-row bg-slate-50">
        <ServiceWorkerRegister />
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
