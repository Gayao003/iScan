"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { CountsTable } from "@/features/inventory/components/CountsTable";
import { CountForm } from "@/features/inventory/components/CountForm";
import { Button } from "@/shared/components/ui/Button";
import { InventoryCount } from "@/shared/types/count";
import { Plus } from "lucide-react";

function CountsContent() {
  const searchParams = useSearchParams();
  const prefillCode = searchParams.get("code") || "";

  const [counts, setCounts] = useState<InventoryCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(Boolean(prefillCode));

  const loadCounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/counts");
      const data = await res.json();
      if (res.ok && data.counts) {
        setCounts(data.counts);
      }
    } catch (e) {
      console.error("Failed to load counts:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const handleCountSaved = (newCount: InventoryCount) => {
    setCounts((prev) => [newCount, ...prev]);
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Physical Inventory Counts"
        description="Recorded physical quantities by item and location"
        breadcrumbs={[
          { label: "Inventory", href: "/counts" },
          { label: "Counts" },
        ]}
        action={
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "outline" : "primary"}
            size="sm"
            className="gap-1.5"
          >
            {showAddForm ? (
              <span>Close Form</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Record New Count</span>
                <span className="sm:hidden">New Count</span>
              </>
            )}
          </Button>
        }
      />

      <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Toggleable Count Entry Form */}
        {showAddForm && (
          <div className="max-w-xl mx-auto">
            <CountForm
              initialCode={prefillCode}
              onCountSaved={handleCountSaved}
            />
          </div>
        )}

        {/* Operational Table */}
        <section aria-label="Counts Table">
          <CountsTable counts={counts} isLoading={isLoading} />
        </section>
      </main>
    </div>
  );
}

export default function CountsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading counts...</div>}>
      <CountsContent />
    </Suspense>
  );
}
