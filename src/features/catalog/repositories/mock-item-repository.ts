import { Item } from "@/shared/types/item";
import { ItemRepository } from "./item-repository.interface";
import { normalizeItemCode } from "@/shared/utils/normalize";

const SEED_ITEMS: Item[] = [
  {
    id: "item-001",
    code: "0123456789012",
    name: "Classic Denim Jeans",
    imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
    description: "Standard fit straight-leg durable denim jeans.",
    attributes: {
      category: "Apparel",
      unit: "pcs",
      size: "32",
    },
    isActive: true,
  },
  {
    id: "item-002",
    code: "ISCAN-DEMO-001",
    name: "Premium Cotton T-Shirt",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description: "100% breathable organic combed cotton casual tee.",
    attributes: {
      category: "Apparel",
      unit: "pcs",
      color: "Navy",
    },
    isActive: true,
  },
  {
    id: "item-003",
    code: "789012345678",
    name: "Running Sport Shoes",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description: "Cushioned lightweight road running athletic shoes.",
    attributes: {
      category: "Footwear",
      unit: "pairs",
      size: "US 10",
    },
    isActive: true,
  },
  {
    id: "item-004",
    code: "567890123456",
    name: "Water-Resistant Backpack",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    description: "Ergonomic multi-compartment commuting backpack.",
    attributes: {
      category: "Bags",
      unit: "pcs",
      capacity: "25L",
    },
    isActive: true,
  },
  {
    id: "item-005",
    code: "234567890123",
    name: "Stainless Steel Watch",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    description: "Water-resistant analog wrist watch with link strap.",
    attributes: {
      category: "Accessories",
      unit: "pcs",
    },
    isActive: true,
  },
  {
    id: "item-006",
    code: "ITEM-NO-IMAGE-999",
    name: "Industrial Fasteners Box",
    imageUrl: "", // Missing image test fixture per acceptance criteria
    description: "M8 heavy-duty galvanized bolt set (pack of 50).",
    attributes: {
      category: "Hardware",
      unit: "box",
    },
    isActive: true,
  },
  {
    id: "item-007",
    code: "4801981127177",
    name: "Coca-Cola Original Taste 190ml (Mismo)",
    imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80",
    description: "Coca-Cola 190ml small PET bottle.",
    attributes: {
      category: "Beverages",
      unit: "bottle",
    },
    isActive: true,
  },
];

export class MockItemRepository implements ItemRepository {
  private items: Map<string, Item>;

  constructor(initialItems: Item[] = SEED_ITEMS) {
    this.items = new Map();
    for (const item of initialItems) {
      this.items.set(normalizeItemCode(item.code), item);
    }
  }

  async findByCode(code: string): Promise<Item | null> {
    const normalized = normalizeItemCode(code);
    return this.items.get(normalized) || null;
  }

  async findAll(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async create(input: {
    id?: string;
    code: string;
    name: string;
    imageUrl?: string;
    description?: string;
    category?: string;
  }): Promise<Item> {
    const normalized = normalizeItemCode(input.code);
    const item: Item = {
      id: input.id || `item-${Date.now()}`,
      code: normalized,
      name: input.name,
      imageUrl: input.imageUrl || "",
      description: input.description,
      attributes: input.category ? { category: input.category } : undefined,
      isActive: true,
    };
    this.items.set(normalized, item);
    return item;
  }
}

export const mockItemRepository = new MockItemRepository();
