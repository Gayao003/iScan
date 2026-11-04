import { ReconciliationItem, VarianceInterpretation } from "@/shared/types/reconciliation";
import { inventoryService } from "./inventory-service";

// ERP system quantities stub (from workflow document Stage 3 & 4)
const SYSTEM_QUANTITIES: Record<string, number> = {
  "ISCAN-DEMO-001": 120, // T-Shirts
  "0123456789012": 80,   // Jeans (Counted 78 -> variance -2 shortage)
  "789012345678": 60,    // Shoes (Counted 60 -> variance 0 match)
  "567890123456": 40,    // Bags (Counted 42 -> variance +2 overage)
  "234567890123": 25,    // Accessories (Counted 25 -> variance 0 match)
};

export class ReconciliationService {
  async getReconciliationData(): Promise<ReconciliationItem[]> {
    const counts = await inventoryService.getAllCounts();

    // Map each count against system quantities
    return counts.map((count) => {
      const systemQty = SYSTEM_QUANTITIES[count.code] ?? count.countedQuantity;
      const variance = count.countedQuantity - systemQty;

      let interpretation: VarianceInterpretation = "match";
      if (variance < 0) {
        interpretation = "shortage";
      } else if (variance > 0) {
        interpretation = "overage";
      }

      return {
        id: `rec-${count.id}`,
        itemId: count.itemId,
        code: count.code,
        itemName: count.itemName || count.code,
        locationId: count.locationId,
        locationName: count.locationName || count.locationId,
        systemQuantity: systemQty,
        countedQuantity: count.countedQuantity,
        variance,
        interpretation,
        approvalStatus: "pending",
        lastUpdated: count.capturedAt,
      };
    });
  }
}

export const reconciliationService = new ReconciliationService();
