"use client";

import React, { useState, useMemo } from "react";
import { InventoryCount } from "@/shared/types/count";
import { Badge } from "@/shared/components/ui/Badge";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

interface CountsTableProps {
  counts: InventoryCount[];
  isLoading?: boolean;
}

export function CountsTable({ counts, isLoading = false }: CountsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"capturedAt" | "countedQuantity" | "code">("capturedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleSort = (field: "capturedAt" | "countedQuantity" | "code") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filtered = useMemo(() => {
    return counts.filter((c) => {
      const q = searchTerm.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        (c.itemName && c.itemName.toLowerCase().includes(q)) ||
        c.locationId.toLowerCase().includes(q)
      );
    });
  }, [counts, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === "capturedAt") {
        comparison = new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime();
      } else if (sortField === "countedQuantity") {
        comparison = a.countedQuantity - b.countedQuantity;
      } else if (sortField === "code") {
        comparison = a.code.localeCompare(b.code);
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  return (
    <div className="w-full space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search code, item, location..."
            className="pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
        </div>
        <div className="text-xs text-slate-500 w-full sm:w-auto text-right">
          Showing <span className="font-semibold text-slate-800">{paginated.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{filtered.length}</span> records
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-700 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3">
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <span>Item & Barcode</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th scope="col" className="px-5 py-3">Location</th>
              <th scope="col" className="px-5 py-3 text-right">
                <button
                  onClick={() => handleSort("countedQuantity")}
                  className="flex items-center gap-1.5 hover:text-slate-900 ml-auto transition-colors"
                >
                  <span>Counted Qty</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
              <th scope="col" className="px-5 py-3">Status</th>
              <th scope="col" className="px-5 py-3 text-right">
                <button
                  onClick={() => handleSort("capturedAt")}
                  className="flex items-center gap-1.5 hover:text-slate-900 ml-auto transition-colors"
                >
                  <span>Captured At</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  Loading counts...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No inventory count records found.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/75 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-slate-900">{item.itemName}</div>
                    <div className="font-mono text-xs text-slate-500">{item.code}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700">
                      {item.locationName || item.locationId}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900 text-base">
                    {item.countedQuantity}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant="primary" className="capitalize bg-blue-100 text-blue-800">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-slate-500">
                    {new Date(item.capturedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No count records found.
          </div>
        ) : (
          paginated.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
            >
              <div>
                <h4 className="font-semibold text-sm text-slate-900">{item.itemName}</h4>
                <div className="font-mono text-xs text-slate-500 mt-0.5">{item.code}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {item.locationName || item.locationId}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(item.capturedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-slate-900 block">
                  {item.countedQuantity}
                </span>
                <Badge variant="primary" className="text-[10px] mt-1 capitalize">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
