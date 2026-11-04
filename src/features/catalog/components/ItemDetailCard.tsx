"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/shared/types/item";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardContent } from "@/shared/components/ui/Card";
import {
  Barcode,
  Tag,
  Package,
  PlusCircle,
  ScanLine,
  ImageOff,
  CheckCircle,
} from "lucide-react";

interface ItemDetailCardProps {
  item: Item;
  onRecordCountClick?: () => void;
}

export function ItemDetailCard({ item, onRecordCountClick }: ItemDetailCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasValidImage = Boolean(item.imageUrl) && !imageError;

  return (
    <Card className="overflow-hidden border-slate-200 shadow-md">
      {/* Top Image Preview Banner */}
      <div className="relative w-full h-56 sm:h-72 bg-slate-100 flex items-center justify-center border-b border-slate-100">
        {hasValidImage ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <ImageOff className="w-12 h-12 mb-2 stroke-1" />
            <p className="text-xs font-medium">No Item Image Available</p>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge variant="success" className="shadow-sm gap-1 bg-emerald-500 text-white">
            <CheckCircle className="w-3 h-3" />
            <span>Active Catalog Item</span>
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title and Category */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            {item.attributes?.category && (
              <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                {String(item.attributes.category)}
              </span>
            )}
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Code Barcode Pill */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 my-4">
          <Barcode className="w-6 h-6 text-slate-700" />
          <div className="flex-1 font-mono text-sm font-bold text-slate-800 tracking-wider">
            {item.code}
          </div>
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            Normalized Code
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Attributes Grid */}
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Attributes</span>
            </h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {Object.entries(item.attributes).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-slate-100 pb-1">
                  <dt className="text-slate-500 capitalize">{key}:</dt>
                  <dd className="font-semibold text-slate-800">{String(val)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Workflow Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onRecordCountClick ? (
            <Button
              onClick={onRecordCountClick}
              variant="primary"
              className="flex-1 gap-2 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Physical Count</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="primary"
              className="flex-1 gap-2 shadow"
            >
              <Link href={`/counts?code=${encodeURIComponent(item.code)}`}>
                <PlusCircle className="w-4 h-4" />
                <span>Record Physical Count</span>
              </Link>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            className="gap-2 border-slate-300"
          >
            <Link href="/">
              <ScanLine className="w-4 h-4 text-slate-600" />
              <span>Scan Another Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
