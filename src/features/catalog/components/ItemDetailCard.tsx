"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/shared/types/item";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { BarcodeVisualizer } from "@/shared/components/ui/BarcodeVisualizer";
import {
  Tag,
  ScanLine,
  ImageOff,
  CheckCircle,
  Camera,
  Layers,
} from "lucide-react";

interface ItemDetailCardProps {
  item: Item;
}

export function ItemDetailCard({ item }: ItemDetailCardProps) {
  const [imageError, setImageError] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [activePhotoTab, setActivePhotoTab] = useState<"catalog" | "snapshot">("catalog");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSnapshot = sessionStorage.getItem(`iscan_snapshot_${item.code}`);
      if (savedSnapshot) {
        setSnapshotUrl(savedSnapshot);
        if (!item.imageUrl) {
          setActivePhotoTab("snapshot");
        }
      }
    }
  }, [item.code, item.imageUrl]);

  const hasValidCatalogImage = Boolean(item.imageUrl) && !imageError;

  return (
    <Card className="overflow-hidden border-slate-200 shadow-lg">
      {/* Photo Preview Section */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-950 flex items-center justify-center border-b border-slate-100 overflow-hidden">
        {/* If user selected camera snapshot */}
        {activePhotoTab === "snapshot" && snapshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snapshotUrl}
            alt="Scanned bottle snapshot"
            className="w-full h-full object-contain"
          />
        ) : hasValidCatalogImage ? (
          /* High-res official catalog product image */
          <div className="relative w-full h-full p-4 flex items-center justify-center">
            <Image
              src={item.imageUrl!}
              alt={item.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, 640px"
              priority
              onError={() => setImageError(true)}
            />
          </div>
        ) : snapshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snapshotUrl}
            alt="Scanned item camera snapshot"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <ImageOff className="w-16 h-16 text-slate-600 mb-2 stroke-[1.5]" />
            <span className="text-sm font-semibold text-slate-300">No Image In Database</span>
            <span className="text-xs text-slate-400 mt-0.5">Database item without photo asset</span>
          </div>
        )}

        {/* Status Badge in Corner */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Found in Database</span>
        </div>

        {/* Photo switcher tabs if both catalog image and camera snapshot exist */}
        {snapshotUrl && hasValidCatalogImage && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 border border-white/20 shadow-xl z-10">
            <button
              onClick={() => setActivePhotoTab("catalog")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activePhotoTab === "catalog"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Catalog Photo</span>
            </button>
            <button
              onClick={() => setActivePhotoTab("snapshot")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activePhotoTab === "snapshot"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Your Scan Photo</span>
            </button>
          </div>
        )}
      </div>

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Real Product Header */}
        <div>
          {item.attributes?.category && (
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
              {String(item.attributes.category)}
            </span>
          )}
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {item.name}
          </h2>
          {item.description && (
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Barcode Graphic & Clean Number */}
        <BarcodeVisualizer code={item.code} />

        {/* Database Attributes / Specifications Grid */}
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Database Specifications</span>
            </h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {Object.entries(item.attributes).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <dt className="text-slate-500 capitalize">{key}:</dt>
                  <dd className="font-semibold text-slate-800">{String(val)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Clean Single Action: Scan Next Item */}
        <div className="pt-2">
          <Button
            asChild
            variant="primary"
            className="w-full gap-2 shadow font-semibold bg-blue-600 hover:bg-blue-700 py-2.5"
          >
            <Link href="/">
              <ScanLine className="w-4 h-4 text-white" />
              <span>Scan Next Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
