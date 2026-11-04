import { InventoryCount, CreateCountInput } from "@/shared/types/count";

export interface CountRepository {
  save(count: CreateCountInput & { itemName?: string; locationName?: string }): Promise<InventoryCount>;
  findAll(): Promise<InventoryCount[]>;
  findById(id: string): Promise<InventoryCount | null>;
  findByItemAndLocation(itemId: string, locationId: string): Promise<InventoryCount[]>;
}
