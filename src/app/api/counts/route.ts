import { NextRequest, NextResponse } from "next/server";
import { inventoryService } from "@/features/inventory/services/inventory-service";
import { z } from "zod";

const createCountSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  code: z.string().min(1, "Code is required"),
  locationId: z.string().min(1, "Location is required"),
  countedQuantity: z.number().nonnegative("Counted quantity must be 0 or greater"),
  notes: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counts = await inventoryService.getAllCounts();
    return NextResponse.json({ counts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch counts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: parsed.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const result = await inventoryService.recordCount(parsed.data);

    if (!result.count) {
      return NextResponse.json(
        { error: "COUNT_RECORD_FAILED", message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ count: result.count }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to record inventory count" },
      { status: 500 }
    );
  }
}
