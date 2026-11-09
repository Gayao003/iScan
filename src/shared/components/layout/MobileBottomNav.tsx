"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanLine, ClipboardList, GitCompare, History, Settings, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Scan", icon: ScanLine, isLocked: false },
  { href: "/counts", label: "Counts", icon: ClipboardList, isLocked: true },
  { href: "/reconciliation", label: "Reconcile", icon: GitCompare, isLocked: true },
  { href: "/history", label: "History", icon: History, isLocked: true },
  { href: "/settings", label: "Settings", icon: Settings, isLocked: true },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur px-1 py-1 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isLocked) {
            return (
              <div
                key={item.href}
                aria-disabled="true"
                title={`${item.label} (Temporarily locked)`}
                className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-medium text-slate-400 opacity-40 cursor-not-allowed select-none min-h-[48px] min-w-[50px] relative pointer-events-none"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 mb-0.5 text-slate-400" />
                  <Lock className="w-2.5 h-2.5 text-slate-500 absolute -top-1 -right-1" />
                </div>
                <span>{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors min-h-[48px] min-w-[50px]",
                isActive
                  ? "text-primary font-semibold"
                  : "text-slate-500 hover:text-slate-900 active:bg-slate-100"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive ? "text-primary stroke-[2.5]" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
