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

  async create(input: {
    id?: string;
    code: string;
    name: string;
    imageUrl?: string;
    description?: string;
    category?: string;
  }): Promise<Item> {
    const normalized = normalizeItemCode(input.code);
    const record = await prisma.item.upsert({
      where: { code: normalized },
      update: {
        name: input.name,
        imageUrl: input.imageUrl || "",
        description: input.description || null,
        category: input.category || null,
        isActive: true,
      },
      create: {
        id: input.id || `item-${Date.now()}`,
        code: normalized,
        name: input.name,
        imageUrl: input.imageUrl || "",
        description: input.description || null,
        category: input.category || null,
        isActive: true,
      },
    });

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
}

export const prismaItemRepository = new PrismaItemRepository();
