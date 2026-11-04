import { Item } from "@/shared/types/item";

export interface ItemRepository {
  findByCode(code: string): Promise<Item | null>;
  findAll(): Promise<Item[]>;
}
