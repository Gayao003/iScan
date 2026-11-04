import { prisma } from "@/lib/prisma";
import { Item } from "@/shared/types/item";
import { ItemRepository } from "./item-repository.interface";
import { normalizeItemCode } from "@/shared/utils/normalize";

export class PrismaItemRepository implements ItemRepository {
  async findByCode(code: string): Promise<Item | null> {
    const normalized = normalizeItemCode(code);

    const record = await prisma.item.findFirst({
      where: {
        code: normalized,
        isActive: true,
      },
    });

    if (!record) return null;

    return {
      id: record.id,
      code: record.code,
      name: record.name,
      imageUrl: record.imageUrl,
      description: record.description ?? undefined,
      attributes: record.category ? { category: record.category } : undefined,
      isActive: record.isActive,
    };
  }

  async findAll(): Promise<Item[]> {
    const records = await prisma.item.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return records.map((record) => ({
      id: record.id,
      code: record.code,
      name: record.name,
      imageUrl: record.imageUrl,
      description: record.description ?? undefined,
      attributes: record.category ? { category: record.category } : undefined,
      isActive: record.isActive,
    }));
  }
}

export const prismaItemRepository = new PrismaItemRepository();
