import { ItemRepository } from "../repositories/item-repository.interface";
import { mockItemRepository } from "../repositories/mock-item-repository";
import { Item } from "@/shared/types/item";
import { normalizeItemCode, validateItemCode } from "@/shared/utils/normalize";

function getRepository(): ItemRepository {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  if (useMock) {
    return mockItemRepository;
  }
  // Dynamic import to avoid bundling Prisma into client-side code
  // This runs only on the server (API routes / server components)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { prismaItemRepository } = require("../repositories/prisma-item-repository");
  return prismaItemRepository;
}

export class CatalogService {
  private get repo(): ItemRepository {
    return getRepository();
  }

  async getItemByCode(rawCode: string): Promise<{
    item: Item | null;
    error?: string;
    statusCode: number;
  }> {
    const validation = validateItemCode(rawCode);
    if (!validation.valid) {
      return { item: null, error: validation.error, statusCode: 400 };
    }

    const normalizedCode = normalizeItemCode(rawCode);
    try {
      const item = await this.repo.findByCode(normalizedCode);
      if (!item) {
        return {
          item: null,
          error: `Item with code "${normalizedCode}" was not found in the catalog.`,
          statusCode: 404,
        };
      }
      return { item, statusCode: 200 };
    } catch (err: unknown) {
      console.error("[CatalogService] findByCode error:", err);
      return {
        item: null,
        error: "Internal catalog service error. Please try again.",
        statusCode: 500,
      };
    }
  }

  async getAllItems(): Promise<Item[]> {
    return this.repo.findAll();
  }

  async createItem(input: {
    code: string;
    name: string;
    imageUrl?: string;
    description?: string;
    category?: string;
  }): Promise<{ item: Item | null; error?: string }> {
    const validation = validateItemCode(input.code);
    if (!validation.valid) {
      return { item: null, error: validation.error };
    }
    if (!input.name || input.name.trim() === "") {
      return { item: null, error: "Item name is required." };
    }

    try {
      const item = await this.repo.create({
        ...input,
        code: normalizeItemCode(input.code),
        name: input.name.trim(),
      });
      return { item };
    } catch (err: unknown) {
      console.error("[CatalogService] createItem error:", err);
      return { item: null, error: "Failed to create catalog item." };
    }
  }
}

export const catalogService = new CatalogService();
