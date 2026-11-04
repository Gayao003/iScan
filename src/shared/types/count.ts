export type CountStatus =
  | 'draft'
  | 'submitted'
  | 'synced'
  | 'recount_required'
  | 'reconciled';

export interface InventoryCount {
  id: string;
  itemId: string;
  code: string;
  itemName?: string;
  locationId: string;
  locationName?: string;
  countedQuantity: number;
  status: CountStatus;
  capturedAt: string; // ISO date string
  notes?: string | null;
}

export interface CreateCountInput {
  itemId: string;
  code: string;
  locationId: string;
  countedQuantity: number;
  notes?: string;
}
