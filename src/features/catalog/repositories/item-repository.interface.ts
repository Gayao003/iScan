import { Item } from "@/shared/types/item";

export interface CreateItemInput {
  id?: string;
  code: string;
  name: string;
  imageUrl?: string;
  description?: string;
  category?: string;
}

export interface ItemRepository {
  findByCode(code: string): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  create(input: CreateItemInput): Promise<Item>;
}
