"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ScanLine,
  ClipboardList,
  GitCompare,
  History,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Scan Item", icon: ScanLine },
  { href: "/counts", label: "Counts", icon: ClipboardList },
  { href: "/reconciliation", label: "Reconciliation", icon: GitCompare },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white min-h-screen p-4">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md">
          <ScanLine className="w-6 h-6" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            iScan
          </span>
          <span className="block text-[10px] font-semibold tracking-wider text-primary uppercase">
            Phase 2 POC
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Info badge */}
      <div className="mt-auto pt-4 border-t border-slate-100 px-3 text-xs text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          {process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"
            ? "Mock Adapter Active"
            : "Supabase PostgreSQL Active"}
        </span>
      </div>
    </aside>
  );
}
