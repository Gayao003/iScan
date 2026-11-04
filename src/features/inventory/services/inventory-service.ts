import { CountRepository } from "../repositories/count-repository.interface";
import { mockCountRepository } from "../repositories/mock-count-repository";
import { catalogService } from "@/features/catalog/services/catalog-service";
import { InventoryCount, CreateCountInput } from "@/shared/types/count";

function getRepository(): CountRepository {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
  if (useMock) {
    return mockCountRepository;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { prismaCountRepository } = require("../repositories/prisma-count-repository");
  return prismaCountRepository;
}

export class InventoryService {
  private get repo(): CountRepository {
    return getRepository();
  }

  async recordCount(input: CreateCountInput): Promise<{
    count: InventoryCount | null;
    error?: string;
  }> {
    if (input.countedQuantity < 0) {
      return { count: null, error: "Counted quantity cannot be negative." };
    }
    if (!input.locationId || input.locationId.trim() === "") {
      return { count: null, error: "Location must be specified." };
    }

    // Enrich with item name from catalog
    let itemName = "Item " + input.code;
    try {
      const lookup = await catalogService.getItemByCode(input.code);
      if (lookup.item) {
        itemName = lookup.item.name;
      }
    } catch {
      // Non-fatal — proceed with code as name
    }

    try {
      const saved = await this.repo.save({
        ...input,
        itemName,
        locationName: input.locationId.trim(),
      });
      return { count: saved };
    } catch (err: unknown) {
      console.error("[InventoryService] recordCount error:", err);
      return {
        count: null,
        error: "Failed to save count record. Please try again.",
      };
    }
  }

  async getAllCounts(): Promise<InventoryCount[]> {
    return this.repo.findAll();
  }
}

export const inventoryService = new InventoryService();
