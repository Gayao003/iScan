-- ============================================================
-- iScan Phase 2 POC — Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Create Tables
-- ============================================================

CREATE TABLE IF NOT EXISTS "Item" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Location" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "InventoryCount" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "countedQuantity" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryCount_pkey" PRIMARY KEY ("id")
);

-- Step 2: Indexes
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS "Item_code_key" ON "Item"("code");
CREATE INDEX IF NOT EXISTS "Item_code_idx" ON "Item"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "Location_code_key" ON "Location"("code");
CREATE INDEX IF NOT EXISTS "InventoryCount_itemId_idx" ON "InventoryCount"("itemId");
CREATE INDEX IF NOT EXISTS "InventoryCount_code_idx" ON "InventoryCount"("code");
CREATE INDEX IF NOT EXISTS "InventoryCount_locationId_idx" ON "InventoryCount"("locationId");
CREATE INDEX IF NOT EXISTS "InventoryCount_status_idx" ON "InventoryCount"("status");

-- Step 3: Foreign Keys
-- ============================================================

ALTER TABLE "InventoryCount"
    ADD CONSTRAINT "InventoryCount_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InventoryCount"
    ADD CONSTRAINT "InventoryCount_locationId_fkey"
    FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 4: Seed Locations
-- ============================================================

INSERT INTO "Location" ("id", "code", "name", "createdAt", "updatedAt") VALUES
    ('loc-aisle-1', 'aisle-1', 'Aisle 1 - Apparel Front',   NOW(), NOW()),
    ('loc-aisle-2', 'aisle-2', 'Aisle 2 - Denim Section',   NOW(), NOW()),
    ('loc-aisle-3', 'aisle-3', 'Aisle 3 - Footwear Rack',   NOW(), NOW()),
    ('loc-aisle-4', 'aisle-4', 'Aisle 4 - Bags & Accessories', NOW(), NOW()),
    ('loc-aisle-5', 'aisle-5', 'Aisle 5 - Hardware Storage', NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

-- Step 5: Seed Catalog Items
-- ============================================================

INSERT INTO "Item" ("id", "code", "name", "imageUrl", "description", "category", "isActive", "createdAt", "updatedAt") VALUES
    ('item-001', 'ISCAN-DEMO-001',    'Premium Cotton T-Shirt',    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', '100% breathable organic combed cotton casual tee.', 'Apparel',     true, NOW(), NOW()),
    ('item-002', '0123456789012',     'Classic Denim Jeans',       'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80', 'Standard fit straight-leg durable denim jeans.',   'Apparel',     true, NOW(), NOW()),
    ('item-003', '789012345678',      'Running Sport Shoes',       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', 'Cushioned lightweight road running athletic shoes.','Footwear',    true, NOW(), NOW()),
    ('item-004', '567890123456',      'Water-Resistant Backpack',  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', 'Ergonomic multi-compartment commuting backpack.',  'Bags',        true, NOW(), NOW()),
    ('item-005', '234567890123',      'Stainless Steel Watch',     'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80', 'Water-resistant analog wrist watch with link strap.','Accessories', true, NOW(), NOW()),
    ('item-006', 'ITEM-NO-IMAGE-999', 'Industrial Fasteners Box',  '', 'M8 heavy-duty galvanized bolt set (pack of 50).', 'Hardware',    true, NOW(), NOW())
ON CONFLICT ("code") DO NOTHING;

-- Step 6: Seed Demo Inventory Counts
-- ============================================================

INSERT INTO "InventoryCount" ("id", "itemId", "code", "locationId", "countedQuantity", "status", "notes", "capturedAt", "createdAt", "updatedAt") VALUES
    ('count-001', 'item-001', 'ISCAN-DEMO-001', 'loc-aisle-1', 120, 'submitted', 'Full carton counted on shelf A1',      NOW() - interval '4 hours', NOW(), NOW()),
    ('count-002', 'item-002', '0123456789012',  'loc-aisle-2', 78,  'submitted', '2 items missing from hanger rack',     NOW() - interval '3 hours', NOW(), NOW()),
    ('count-003', 'item-003', '789012345678',   'loc-aisle-3', 60,  'submitted', 'Exact box count matches',              NOW() - interval '2 hours', NOW(), NOW()),
    ('count-004', 'item-004', '567890123456',   'loc-aisle-4', 42,  'submitted', '2 additional units found in back bin', NOW() - interval '1 hour',  NOW(), NOW()),
    ('count-005', 'item-005', '234567890123',   'loc-aisle-5', 25,  'submitted', 'Display showcase inventory verified',  NOW() - interval '30 minutes', NOW(), NOW())
ON CONFLICT DO NOTHING;
