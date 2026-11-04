"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Search, CornerDownLeft } from "lucide-react";
import { validateItemCode, normalizeItemCode } from "@/shared/utils/normalize";

interface ManualEntryFormProps {
  onCodeSubmit?: (code: string) => void;
  className?: string;
}

export function ManualEntryForm({ onCodeSubmit, className = "" }: ManualEntryFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateItemCode(code);
    if (!validation.valid) {
      setError(validation.error || "Invalid code");
      return;
    }

    setError(null);
    const normalized = normalizeItemCode(code);

    if (onCodeSubmit) {
      onCodeSubmit(normalized);
    } else {
      router.push(`/item/${encodeURIComponent(normalized)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex gap-2 items-start">
        <div className="relative flex-1">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter barcode or QR code manually..."
            error={error || undefined}
            className="pr-10"
            aria-label="Barcode or QR code manual input"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
        <Button type="submit" variant="primary" className="shrink-0 gap-1.5 px-4">
          <span>Lookup</span>
          <CornerDownLeft className="w-4 h-4" />
        </Button>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Try demo codes: <span className="font-mono text-slate-700 font-semibold cursor-pointer hover:underline" onClick={() => setCode("ISCAN-DEMO-001")}>ISCAN-DEMO-001</span>, <span className="font-mono text-slate-700 font-semibold cursor-pointer hover:underline" onClick={() => setCode("0123456789012")}>0123456789012</span>
      </p>
    </form>
  );
}
