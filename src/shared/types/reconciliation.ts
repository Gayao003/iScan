export type VarianceInterpretation = 'shortage' | 'overage' | 'match';

export type ApprovalStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface ReconciliationItem {
  id: string;
  itemId: string;
  code: string;
  itemName: string;
  locationId: string;
  locationName: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number; // countedQuantity - systemQuantity
  interpretation: VarianceInterpretation;
  approvalStatus: ApprovalStatus;
  lastUpdated: string;
}
