"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Barcode } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppHeaderProps {
  title: string;
  description?: string;
  showBack?: boolean;
  backHref?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

export function AppHeader({
  title,
  description,
  showBack = false,
  backHref,
  breadcrumbs = [],
  action,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3 sm:px-6">
      {/* Desktop Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="hidden md:flex items-center space-x-1.5 text-xs text-slate-500 mb-1"
        >
          <Link
            href="/"
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <Barcode className="w-3.5 h-3.5 text-primary" />
            iScan
          </Link>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-800">{crumb.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Go back"
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary -ml-2 transition-colors min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {title}
            </h1>
            {description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </header>
  );
}
