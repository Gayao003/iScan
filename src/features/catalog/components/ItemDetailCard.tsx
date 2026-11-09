"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/shared/types/item";
import { Button } from "@/shared/components/ui/Button";
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
            alt="Scanned item snapshot"
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
            <span className="text-base font-semibold text-slate-300">No Image in Database</span>
            <span className="text-xs text-slate-400 mt-0.5">Database item without photo asset</span>
          </div>
        )}

        {/* Status Badge in Corner */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-600/95 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>Found in Database</span>
        </div>

        {/* Photo switcher tabs if both catalog image and camera snapshot exist */}
        {snapshotUrl && hasValidCatalogImage && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 border border-white/20 shadow-xl z-10">
            <button
              onClick={() => setActivePhotoTab("catalog")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activePhotoTab === "catalog"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog Photo</span>
            </button>
            <button
              onClick={() => setActivePhotoTab("snapshot")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activePhotoTab === "snapshot"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Your Scan Photo</span>
            </button>
          </div>
        )}
      </div>

      <CardContent className="p-5 sm:p-7 space-y-5">
        {/* Real Product Header - Larger, bolder typography for high visibility */}
        <div className="space-y-1.5">
          {item.attributes?.category && (
            <span className="text-xs sm:text-sm font-extrabold text-blue-600 uppercase tracking-widest block">
              {String(item.attributes.category)}
            </span>
          )}
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {item.name}
          </h2>
          {item.description && (
            <p className="text-base sm:text-lg text-slate-700 mt-2 leading-relaxed font-normal">
              {item.description}
            </p>
          )}
        </div>

        {/* Barcode Graphic & Clean Number */}
        <BarcodeVisualizer code={item.code} />

        {/* Database Attributes / Specifications Grid with larger, comfortable text */}
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4 sm:p-5 shadow-sm">
            <h4 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Database Specifications</span>
            </h4>
            <dl className="divide-y divide-slate-200/80">
              {Object.entries(item.attributes).map(([key, val]) => {
                const isCostOrPrice = /price|cost|amount|rate/i.test(key);
                return (
                  <div key={key} className="flex items-center justify-between py-2.5 sm:py-3 text-sm sm:text-base">
                    <dt className="text-slate-600 font-medium capitalize">
                      {key}:
                    </dt>
                    <dd
                      className={`font-bold text-base sm:text-xl ${
                        isCostOrPrice ? "text-emerald-700 font-extrabold" : "text-slate-900"
                      }`}
                    >
                      {String(val)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="pt-2">
          <Button
            asChild
            variant="primary"
            className="w-full gap-2.5 shadow-md font-bold text-base sm:text-lg bg-blue-600 hover:bg-blue-700 py-3.5 sm:py-4 rounded-xl"
          >
            <Link href="/">
              <ScanLine className="w-5 h-5 text-white" />
              <span>Scan Next Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
