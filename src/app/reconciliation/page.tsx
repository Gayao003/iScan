"use client";

import React, { useEffect, useState } from "react";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { ReconciliationTable } from "@/features/inventory/components/ReconciliationTable";
import { ReconciliationItem } from "@/shared/types/reconciliation";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/Alert";
import { Info, Lock } from "lucide-react";

export default function ReconciliationPage() {
  const [items, setItems] = useState<ReconciliationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/reconciliation");
        const data = await res.json();
        if (res.ok && data.reconciliation) {
          setItems(data.reconciliation);
        }
      } catch (err) {
        console.error("Failed to load reconciliation:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title="Analyze & Reconcile"
        description="Compare physical counts with system inventory and review discrepancies"
        breadcrumbs={[
          { label: "Inventory", href: "/counts" },
          { label: "Reconciliation" },
        ]}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Governance / Scope Alert */}
        <Alert variant="info" className="border-blue-200 bg-blue-50/80">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertTitle className="text-blue-900 font-semibold">
            Stage 3 Reconciliation Review (Phase 2 POC)
          </AlertTitle>
          <AlertDescription className="text-blue-800 text-xs leading-relaxed">
            Variance is calculated strictly as <code>counted quantity − system quantity</code>. Discrepancies are audit findings requiring supervisor review. Automatic ERP adjustments are intentionally deferred until Phase 5.
          </AlertDescription>
        </Alert>

        {/* Operational Reconciliation Table */}
        <ReconciliationTable items={items} isLoading={isLoading} />
      </main>
    </div>
  );
}
