"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Item } from "@/shared/types/item";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Badge } from "@/shared/components/ui/Badge";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { BarcodeVisualizer } from "@/shared/components/ui/BarcodeVisualizer";
import {
  Tag,
  PlusCircle,
  ScanLine,
  ImageOff,
  CheckCircle,
  Camera,
  Layers,
  Pencil,
  Save,
  X,
} from "lucide-react";

interface ItemDetailCardProps {
  item: Item;
  onRecordCountClick?: () => void;
}

export function ItemDetailCard({ item: initialItem, onRecordCountClick }: ItemDetailCardProps) {
  const [item, setItem] = useState<Item>(initialItem);
  const [imageError, setImageError] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [activePhotoTab, setActivePhotoTab] = useState<"catalog" | "snapshot">("catalog");

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(initialItem.name);
  const [editCategory, setEditCategory] = useState(initialItem.attributes?.category ? String(initialItem.attributes.category) : "Beverages");
  const [editDesc, setEditDesc] = useState(initialItem.description || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItem(initialItem);
    setEditName(initialItem.name);
    setEditCategory(initialItem.attributes?.category ? String(initialItem.attributes.category) : "Beverages");
    setEditDesc(initialItem.description || "");
  }, [initialItem]);

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

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      setIsSaving(true);
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: item.code,
          name: editName.trim(),
          category: editCategory.trim(),
          description: editDesc.trim(),
          imageUrl: item.imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.item) {
        setItem(data.item);
        setIsEditing(false);
      }
    } catch (e) {
      console.error("Failed to update item:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const hasValidCatalogImage = Boolean(item.imageUrl) && !imageError;

  return (
    <Card className="overflow-hidden border-slate-200 shadow-lg">
      {/* Photo Preview Section with Tab Switcher if camera snapshot exists */}
      <div className="relative w-full h-64 sm:h-80 bg-slate-950 flex items-center justify-center border-b border-slate-100 overflow-hidden">
        {/* If user selected camera snapshot */}
        {activePhotoTab === "snapshot" && snapshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snapshotUrl}
            alt={`Camera snapshot of ${item.name}`}
            className="w-full h-full object-contain"
          />
        ) : hasValidCatalogImage ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-contain sm:object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : snapshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snapshotUrl}
            alt={`Camera snapshot of ${item.name}`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
            <ImageOff className="w-12 h-12 mb-2 stroke-1" />
            <p className="text-xs font-medium">No Item Image Available</p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <Badge variant="success" className="shadow-md gap-1 bg-emerald-500 text-white">
            <CheckCircle className="w-3 h-3" />
            <span>Catalog Match</span>
          </Badge>
        </div>

        {/* Bottom Tab Pill Toggle if both catalog image & camera snapshot exist */}
        {snapshotUrl && hasValidCatalogImage && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center p-1 bg-black/75 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-xs">
            <button
              onClick={() => setActivePhotoTab("catalog")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
                activePhotoTab === "catalog"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog Image</span>
            </button>
            <button
              onClick={() => setActivePhotoTab("snapshot")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
                activePhotoTab === "snapshot"
                  ? "bg-emerald-500 text-white shadow"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scanned Photo</span>
            </button>
          </div>
        )}

        {/* If only snapshot exists */}
        {snapshotUrl && !hasValidCatalogImage && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Camera Scan Photo</span>
          </div>
        )}
      </div>

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Title and Category (or Inline Edit Form) */}
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase">Edit Product Details</span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Product Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Category</label>
              <Input
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="e.g. Beverages"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Description / Size</label>
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="e.g. 190ml small PET bottle"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button type="submit" variant="primary" size="sm" disabled={isSaving} className="gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : "Save Details"}</span>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between gap-4">
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
            <button
              onClick={() => setIsEditing(true)}
              title="Edit product details"
              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Authentic Barcode Graphic & Number */}
        <BarcodeVisualizer code={item.code} />

        {/* Attributes Grid */}
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Specifications</span>
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

        {/* Workflow Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {onRecordCountClick ? (
            <Button
              onClick={onRecordCountClick}
              variant="primary"
              className="flex-1 gap-2 shadow font-semibold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Physical Count</span>
            </Button>
          ) : (
            <Button
              asChild
              variant="primary"
              className="flex-1 gap-2 shadow font-semibold"
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
              <span>Scan Next Item</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
