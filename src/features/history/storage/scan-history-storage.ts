export interface HistoryItem {
  code: string;
  name?: string;
  timestamp: string;
  status: "found" | "not_found";
}

const STORAGE_KEY = "iscan_scan_history_v1";

export const scanHistoryStorage = {
  getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addEntry(entry: Omit<HistoryItem, "timestamp">): void {
    if (typeof window === "undefined") return;
    try {
      const history = this.getHistory();
      const updated = [
        {
          ...entry,
          timestamp: new Date().toISOString(),
        },
        ...history.filter((h) => h.code !== entry.code),
      ].slice(0, 30); // Keep last 30 scans

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  },

  clearHistory(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};
