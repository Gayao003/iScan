"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { ItemDetailCard } from "@/features/catalog/components/ItemDetailCard";
import { ItemNotFoundCard } from "@/features/catalog/components/ItemNotFoundCard";
import { CountForm } from "@/features/inventory/components/CountForm";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Item } from "@/shared/types/item";
import { AlertCircle, RefreshCw, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { scanHistoryStorage } from "@/features/history/storage/scan-history-storage";

export default function ItemResultPage() {
  const params = useParams();
  const rawCode = Array.isArray(params.code) ? params.code[0] : params.code || "";
  const decodedCode = decodeURIComponent(rawCode);

  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCountForm, setShowCountForm] = useState(false);

  const fetchItem = async (codeToFetch: string) => {
    try {
      setIsLoading(true);
      setIsNotFound(false);
      setErrorMessage(null);

      const res = await fetch(`/api/items/by-code/${encodeURIComponent(codeToFetch)}`);
      const data = await res.json();

      if (res.status === 404) {
        setIsNotFound(true);
        scanHistoryStorage.addEntry({
          code: codeToFetch,
          status: "not_found",
        });
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || `Lookup failed with code ${res.status}`);
      }

      setItem(data.item);
      scanHistoryStorage.addEntry({
        code: codeToFetch,
        name: data.item?.name,
        status: "found",
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (decodedCode) {
      fetchItem(decodedCode);
    }
  }, [decodedCode]);

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader
        title={item ? item.name : "Item Lookup Result"}
        description={item ? `Code: ${item.code}` : `Lookup result for code: ${decodedCode}`}
        showBack={true}
        backHref="/"
        breadcrumbs={[
          { label: "Items", href: "/" },
          { label: decodedCode },
        ]}
      />

      <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-6">
        {/* Loading state skeleton */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">
              Querying Catalog Database...
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Resolving code: {decodedCode}
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && errorMessage && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Lookup Service Unavailable</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button
                onClick={() => fetchItem(decodedCode)}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Lookup</span>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Scanner</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Not Found state */}
        {!isLoading && isNotFound && (
          <ItemNotFoundCard scannedCode={decodedCode} />
        )}

        {/* Found state */}
        {!isLoading && item && (
          <div className="space-y-6">
            <ItemDetailCard
              item={item}
              onRecordCountClick={() => setShowCountForm(!showCountForm)}
            />

            {/* Inlined Count Recording Form */}
            {showCountForm && (
              <CountForm
                initialCode={item.code}
                initialItemId={item.id}
                onCountSaved={() => {
                  setTimeout(() => setShowCountForm(false), 2000);
                }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
