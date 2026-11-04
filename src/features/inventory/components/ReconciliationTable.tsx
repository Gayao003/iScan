"use client";

import React, { useState, useMemo } from "react";
import { ReconciliationItem } from "@/shared/types/reconciliation";
import { Badge } from "@/shared/components/ui/Badge";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  GitCompare,
  Download,
} from "lucide-react";

interface ReconciliationTableProps {
  items: ReconciliationItem[];
  isLoading?: boolean;
}

export function ReconciliationTable({
  items,
  isLoading = false,
}: ReconciliationTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "match" | "shortage" | "overage">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.locationName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (filterType === "all") return true;
      return item.interpretation === filterType;
    });
  }, [items, searchTerm, filterType]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const summary = useMemo(() => {
    const total = items.length;
    const matches = items.filter((i) => i.interpretation === "match").length;
    const shortages = items.filter((i) => i.interpretation === "shortage").length;
    const overages = items.filter((i) => i.interpretation === "overage").length;
    const accuracyRate = total > 0 ? Math.round((matches / total) * 100) : 100;
    return { total, matches, shortages, overages, accuracyRate };
  }, [items]);

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ["Item Name", "Barcode/Code", "Location", "System Qty", "Counted Qty", "Variance", "Interpretation", "Status", "Last Updated"];
    const rows = filtered.map((i) => [
      `"${i.itemName.replace(/"/g, '""')}"`,
      `"${i.code}"`,
      `"${i.locationName}"`,
      i.systemQuantity,
      i.countedQuantity,
      i.variance,
      i.interpretation,
      i.approvalStatus,
      `"${i.lastUpdated}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `iScan_Reconciliation_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-5">
      {/* IRA Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Items
          </p>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {summary.total}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accuracy Rate</span>
          </p>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {summary.accuracyRate}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            <span>Shortages</span>
          </p>
          <p className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {summary.shortages}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Overages</span>
          </p>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {summary.overages}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter item, code..."
            className="pl-9"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-1 sm:flex-initial">
            {(["all", "match", "shortage", "overage"] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilterType(type);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors min-h-[36px] ${
                  filterType === type
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0 bg-white"
            title="Export Reconciliation Report to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Table Desktop View */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-700 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3">Item Details</th>
              <th scope="col" className="px-5 py-3">Location</th>
              <th scope="col" className="px-5 py-3 text-right">System Qty</th>
              <th scope="col" className="px-5 py-3 text-right">Counted Qty</th>
              <th scope="col" className="px-5 py-3 text-right">Variance</th>
              <th scope="col" className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  Loading reconciliation data...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <GitCompare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No matching records found.
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
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {item.locationName}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-600">
                    {item.systemQuantity}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-semibold text-slate-900">
                    {item.countedQuantity}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold">
                    <span
                      className={`inline-flex items-center gap-1 ${
                        item.variance === 0
                          ? "text-slate-600"
                          : item.variance < 0
                          ? "text-rose-600"
                          : "text-amber-600"
                      }`}
                    >
                      {item.variance > 0 ? `+${item.variance}` : item.variance}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {item.interpretation === "match" && (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800">
                        Matches
                      </Badge>
                    )}
                    {item.interpretation === "shortage" && (
                      <Badge variant="danger" className="bg-rose-100 text-rose-800">
                        Shortage
                      </Badge>
                    )}
                    {item.interpretation === "overage" && (
                      <Badge variant="warning" className="bg-amber-100 text-amber-800">
                        Overage
                      </Badge>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            No reconciliation records found.
          </div>
        ) : (
          paginated.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">{item.itemName}</h4>
                  <p className="font-mono text-xs text-slate-500">{item.code}</p>
                </div>
                {item.interpretation === "match" ? (
                  <Badge variant="success" className="text-[10px]">Match</Badge>
                ) : item.interpretation === "shortage" ? (
                  <Badge variant="danger" className="text-[10px]">Shortage</Badge>
                ) : (
                  <Badge variant="warning" className="text-[10px]">Overage</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">System</span>
                  <span className="font-mono font-semibold text-sm text-slate-700">
                    {item.systemQuantity}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Counted</span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {item.countedQuantity}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Variance</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      item.variance === 0
                        ? "text-slate-600"
                        : item.variance < 0
                        ? "text-rose-600"
                        : "text-amber-600"
                    }`}
                  >
                    {item.variance > 0 ? `+${item.variance}` : item.variance}
                  </span>
                </div>
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
