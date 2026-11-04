export interface Item {
  id: string;
  code: string;
  name: string;
  imageUrl: string;
  description?: string | null;
  attributes?: {
    category?: string;
    [key: string]: unknown;
  } | null;
  isActive?: boolean;
}

export interface ItemLookupResponse {
  item: Item;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
