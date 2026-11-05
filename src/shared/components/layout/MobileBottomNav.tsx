"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanLine, ClipboardList, GitCompare, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Scan", icon: ScanLine },
  { href: "/counts", label: "Counts", icon: ClipboardList },
  { href: "/reconciliation", label: "Reconcile", icon: GitCompare },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
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
