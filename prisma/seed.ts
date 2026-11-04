import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding iScan database...");

  // Locations
  const locations = [
    { id: "loc-aisle-1", code: "aisle-1", name: "Aisle 1 - Apparel Front" },
    { id: "loc-aisle-2", code: "aisle-2", name: "Aisle 2 - Denim Section" },
    { id: "loc-aisle-3", code: "aisle-3", name: "Aisle 3 - Footwear Rack" },
    { id: "loc-aisle-4", code: "aisle-4", name: "Aisle 4 - Bags & Accessories" },
    { id: "loc-aisle-5", code: "aisle-5", name: "Aisle 5 - Hardware Storage" },
  ];

  for (const loc of locations) {
    await prisma.location.upsert({
      where: { code: loc.code },
      update: { name: loc.name },
      create: loc,
    });
  }
  console.log(`✅ ${locations.length} locations seeded`);

  // Items
  const items = [
    {
      id: "item-001",
      code: "ISCAN-DEMO-001",
      name: "Premium Cotton T-Shirt",
      imageUrl:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      description: "100% breathable organic combed cotton casual tee.",
      category: "Apparel",
      isActive: true,
    },
    {
      id: "item-002",
      code: "0123456789012",
      name: "Classic Denim Jeans",
      imageUrl:
        "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
      description: "Standard fit straight-leg durable denim jeans.",
      category: "Apparel",
      isActive: true,
    },
    {
      id: "item-003",
      code: "789012345678",
      name: "Running Sport Shoes",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
      description: "Cushioned lightweight road running athletic shoes.",
      category: "Footwear",
      isActive: true,
    },
    {
      id: "item-004",
      code: "567890123456",
      name: "Water-Resistant Backpack",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
      description: "Ergonomic multi-compartment commuting backpack.",
      category: "Bags",
      isActive: true,
    },
    {
      id: "item-005",
      code: "234567890123",
      name: "Stainless Steel Watch",
      imageUrl:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
      description: "Water-resistant analog wrist watch with link strap.",
      category: "Accessories",
      isActive: true,
    },
    {
      id: "item-006",
      code: "ITEM-NO-IMAGE-999",
      name: "Industrial Fasteners Box",
      imageUrl: "",
      description: "M8 heavy-duty galvanized bolt set (pack of 50).",
      category: "Hardware",
      isActive: true,
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        imageUrl: item.imageUrl,
        description: item.description,
        category: item.category,
        isActive: item.isActive,
      },
      create: item,
    });
  }
  console.log(`✅ ${items.length} catalog items seeded`);

  // Seed demo inventory counts
  const counts = [
    {
      itemId: "item-001",
      code: "ISCAN-DEMO-001",
      locationId: "loc-aisle-1",
      countedQuantity: 120,
      status: "submitted",
      notes: "Full carton counted on shelf A1",
    },
    {
      itemId: "item-002",
      code: "0123456789012",
      locationId: "loc-aisle-2",
      countedQuantity: 78,
      status: "submitted",
      notes: "2 items missing from hanger rack",
    },
    {
      itemId: "item-003",
      code: "789012345678",
      locationId: "loc-aisle-3",
      countedQuantity: 60,
      status: "submitted",
      notes: "Exact box count matches",
    },
    {
      itemId: "item-004",
      code: "567890123456",
      locationId: "loc-aisle-4",
      countedQuantity: 42,
      status: "submitted",
      notes: "2 additional units found in back bin",
    },
    {
      itemId: "item-005",
      code: "234567890123",
      locationId: "loc-aisle-5",
      countedQuantity: 25,
      status: "submitted",
      notes: "Display showcase inventory verified",
    },
  ];

  for (const count of counts) {
    await prisma.inventoryCount.create({ data: count });
  }
  console.log(`✅ ${counts.length} demo inventory counts seeded`);

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
