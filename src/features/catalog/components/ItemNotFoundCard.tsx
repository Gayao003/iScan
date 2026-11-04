"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/Alert";
import { BarcodeVisualizer } from "@/shared/components/ui/BarcodeVisualizer";
import {
  ScanLine,
  PlusCircle,
  Camera,
  PackagePlus,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
} from "lucide-react";

interface ItemNotFoundCardProps {
  scannedCode: string;
}

export function ItemNotFoundCard({ scannedCode }: ItemNotFoundCardProps) {
  const router = useRouter();
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Beverages");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSnapshot = sessionStorage.getItem(`iscan_snapshot_${scannedCode}`);
      if (savedSnapshot) {
        setSnapshotUrl(savedSnapshot);
      }
    }
  }, [scannedCode]);

  const handleRegisterItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name for this product.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: scannedCode,
          name: name.trim(),
          category: category.trim(),
          imageUrl: snapshotUrl || "",
          description: `Registered from mobile scan (${category})`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to register item.");
      }

      // Reload the page so the item detail card loads the newly registered item
      window.location.reload();
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-xl">
      {/* Captured Camera Snapshot Banner */}
      {snapshotUrl ? (
        <div className="relative w-full h-64 sm:h-72 bg-slate-950 flex items-center justify-center border-b border-slate-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={snapshotUrl}
            alt="Scanned camera snapshot"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Captured Camera Photo</span>
          </div>
          <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            Unregistered Barcode
          </div>
        </div>
      ) : (
        <div className="p-6 bg-slate-900 text-white text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-semibold mb-2">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Barcode Decoded Successfully</span>
          </div>
          <h2 className="text-xl font-bold">Unregistered Product Scanned</h2>
          <p className="text-xs text-slate-300 mt-1">
            This barcode is valid but has not been added to your catalog yet.
          </p>
        </div>
      )}

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Detected Barcode Visualization */}
        <BarcodeVisualizer code={scannedCode} />

        {/* Quick Add / Register Item Form */}
        {showRegisterForm ? (
          <form onSubmit={handleRegisterItem} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-primary" />
                <span>Register Product to Catalog</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>

            {error && (
              <Alert variant="destructive" className="py-2 text-xs">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Product Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Coca-Cola 500ml"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="Beverages">Beverages</option>
                <option value="Food & Snacks">Food & Snacks</option>
                <option value="Apparel">Apparel</option>
                <option value="Footwear">Footwear</option>
                <option value="Bags & Luggage">Bags & Luggage</option>
                <option value="Hardware">Hardware</option>
                <option value="General Inventory">General Inventory</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full gap-2 font-semibold shadow-md mt-2"
            >
              <PackagePlus className="w-4 h-4" />
              <span>{isSubmitting ? "Saving to Catalog..." : "Save Product to Catalog"}</span>
            </Button>
          </form>
        ) : (
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-center space-y-2">
            <h4 className="text-sm font-bold text-blue-900">
              Want to add this product to your catalog?
            </h4>
            <p className="text-xs text-blue-700">
              Give it a name and category to recognize it automatically on future scans.
            </p>
            <Button
              onClick={() => setShowRegisterForm(true)}
              variant="primary"
              size="sm"
              className="gap-2 shadow"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add to Product Catalog</span>
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            asChild
            variant="secondary"
            className="flex-1 gap-2 border-slate-300"
          >
            <Link href={`/counts?code=${encodeURIComponent(scannedCode)}`}>
              <PlusCircle className="w-4 h-4 text-slate-700" />
              <span>Record Count for this Barcode</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 gap-2 border-slate-300"
          >
            <Link href="/">
              <ScanLine className="w-4 h-4 text-slate-700" />
              <span>Scan Next Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
