"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/Card";
import { Alert, AlertTitle, AlertDescription } from "@/shared/components/ui/Alert";
import { CheckCircle2, AlertCircle, Save, MapPin, Hash, StickyNote } from "lucide-react";
import { InventoryCount } from "@/shared/types/count";

interface CountFormProps {
  initialCode?: string;
  initialItemId?: string;
  onCountSaved?: (count: InventoryCount) => void;
  className?: string;
}

const COMMON_LOCATIONS = [
  { id: "aisle-1", name: "Aisle 1 - Apparel Front" },
  { id: "aisle-2", name: "Aisle 2 - Denim Section" },
  { id: "aisle-3", name: "Aisle 3 - Footwear Rack" },
  { id: "aisle-4", name: "Aisle 4 - Accessories & Bags" },
  { id: "aisle-5", name: "Aisle 5 - Hardware Storage" },
];

export function CountForm({
  initialCode = "",
  initialItemId = "",
  onCountSaved,
  className = "",
}: CountFormProps) {
  const [code, setCode] = useState(initialCode);
  const [locationId, setLocationId] = useState("aisle-1");
  const [quantity, setQuantity] = useState<string>("1");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty < 0) {
      setFeedback({
        type: "error",
        message: "Please enter a valid non-negative quantity number.",
      });
      return;
    }

    if (!code.trim()) {
      setFeedback({
        type: "error",
        message: "Item code is required.",
      });
      return;
    }

    if (!locationId.trim()) {
      setFeedback({
        type: "error",
        message: "Location is required.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/counts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: initialItemId || `item-${code.trim()}`,
          code: code.trim(),
          locationId: locationId.trim(),
          countedQuantity: numQty,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to record count.");
      }

      setFeedback({
        type: "success",
        message: `Count for ${code} (${numQty} units at ${locationId}) recorded successfully.`,
      });

      if (onCountSaved && data.count) {
        onCountSaved(data.count);
      }

      // Reset form quantity if successful
      setQuantity("1");
      setNotes("");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setFeedback({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`border-slate-200 shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          <span>Record Physical Inventory Count</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feedback && (
          <Alert
            variant={feedback.type === "success" ? "success" : "destructive"}
            className="mb-4"
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-danger" />
            )}
            <AlertTitle>
              {feedback.type === "success" ? "Count Saved" : "Error"}
            </AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Item Code / Barcode
            </label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. 0123456789012"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Location</span>
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {COMMON_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span>Physical Count Quantity</span>
            </label>
            <Input
              type="number"
              step="any"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter observed quantity (e.g. 120)"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-slate-500" />
              <span>Notes (Optional)</span>
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Rack A shelf 2 checked"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving Count..." : "Save Physical Count"}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
