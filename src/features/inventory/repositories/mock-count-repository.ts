import { InventoryCount, CreateCountInput } from "@/shared/types/count";
import { CountRepository } from "./count-repository.interface";

const SEED_COUNTS: InventoryCount[] = [
  {
    id: "count-001",
    itemId: "item-002",
    code: "ISCAN-DEMO-001",
    itemName: "Premium Cotton T-Shirt",
    locationId: "aisle-1",
    locationName: "Aisle 1",
    countedQuantity: 120,
    status: "submitted",
    capturedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: "Full carton counted on shelf A1",
  },
  {
    id: "count-002",
    itemId: "item-001",
    code: "0123456789012",
    itemName: "Classic Denim Jeans",
    locationId: "aisle-2",
    locationName: "Aisle 2",
    countedQuantity: 78,
    status: "submitted",
    capturedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    notes: "2 items missing from hanger rack",
  },
  {
    id: "count-003",
    itemId: "item-003",
    code: "789012345678",
    itemName: "Running Sport Shoes",
    locationId: "aisle-3",
    locationName: "Aisle 3",
    countedQuantity: 60,
    status: "submitted",
    capturedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: "Exact box count matches",
  },
  {
    id: "count-004",
    itemId: "item-004",
    code: "567890123456",
    itemName: "Water-Resistant Backpack",
    locationId: "aisle-4",
    locationName: "Aisle 4",
    countedQuantity: 42,
    status: "submitted",
    capturedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    notes: "2 additional units found in back bin",
  },
  {
    id: "count-005",
    itemId: "item-005",
    code: "234567890123",
    itemName: "Stainless Steel Watch",
    locationId: "aisle-5",
    locationName: "Aisle 5",
    countedQuantity: 25,
    status: "submitted",
    capturedAt: new Date(Date.now() - 1800000).toISOString(),
    notes: "Display showcase inventory verified",
  },
];

export class MockCountRepository implements CountRepository {
  private counts: InventoryCount[];

  constructor(initialCounts: InventoryCount[] = SEED_COUNTS) {
    this.counts = [...initialCounts];
  }

  async save(
    input: CreateCountInput & { itemName?: string; locationName?: string }
  ): Promise<InventoryCount> {
    const newRecord: InventoryCount = {
      id: `count-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      itemId: input.itemId,
      code: input.code,
      itemName: input.itemName || "Unknown Item",
      locationId: input.locationId,
      locationName: input.locationName || input.locationId,
      countedQuantity: input.countedQuantity,
      status: "submitted",
      capturedAt: new Date().toISOString(),
      notes: input.notes || null,
    };
    // Prepend newest count
    this.counts.unshift(newRecord);
    return newRecord;
  }

  async findAll(): Promise<InventoryCount[]> {
    return [...this.counts];
  }

  async findById(id: string): Promise<InventoryCount | null> {
    return this.counts.find((c) => c.id === id) || null;
  }

  async findByItemAndLocation(itemId: string, locationId: string): Promise<InventoryCount[]> {
    return this.counts.filter(
      (c) => c.itemId === itemId && c.locationId === locationId
    );
  }
}

export const mockCountRepository = new MockCountRepository();
