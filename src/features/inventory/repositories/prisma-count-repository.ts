import { prisma } from "@/lib/prisma";
import { InventoryCount, CreateCountInput } from "@/shared/types/count";
import { CountRepository } from "./count-repository.interface";

export class PrismaCountRepository implements CountRepository {
  async save(
    input: CreateCountInput & { itemName?: string; locationName?: string }
  ): Promise<InventoryCount> {
    // Resolve locationId — find or create location by code
    let location = await prisma.location.findFirst({
      where: { code: input.locationId },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          id: `loc-${input.locationId}-${Date.now()}`,
          code: input.locationId,
          name: input.locationName || input.locationId,
        },
      });
    }

    const record = await prisma.inventoryCount.create({
      data: {
        itemId: input.itemId,
        code: input.code,
        locationId: location.id,
        countedQuantity: input.countedQuantity,
        status: "submitted",
        notes: input.notes || null,
      },
      include: {
        item: true,
        location: true,
      },
    });

    return this.toCountType(record);
  }

  async findAll(): Promise<InventoryCount[]> {
    const records = await prisma.inventoryCount.findMany({
      orderBy: { capturedAt: "desc" },
      include: {
        item: true,
        location: true,
      },
    });

    return records.map(this.toCountType);
  }

  async findById(id: string): Promise<InventoryCount | null> {
    const record = await prisma.inventoryCount.findUnique({
      where: { id },
      include: { item: true, location: true },
    });

    if (!record) return null;
    return this.toCountType(record);
  }

  async findByItemAndLocation(
    itemId: string,
    locationId: string
  ): Promise<InventoryCount[]> {
    const records = await prisma.inventoryCount.findMany({
      where: { itemId, locationId },
      include: { item: true, location: true },
      orderBy: { capturedAt: "desc" },
    });

    return records.map(this.toCountType);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toCountType(record: any): InventoryCount {
    return {
      id: record.id,
      itemId: record.itemId,
      code: record.code,
      itemName: record.item?.name || record.code,
      locationId: record.location?.code || record.locationId,
      locationName: record.location?.name || record.locationId,
      countedQuantity: record.countedQuantity,
      status: record.status as InventoryCount["status"],
      capturedAt: record.capturedAt.toISOString(),
      notes: record.notes ?? null,
    };
  }
}

export const prismaCountRepository = new PrismaCountRepository();
