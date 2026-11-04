import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/features/catalog/services/catalog-service";
import { z } from "zod";

const createItemSchema = z.object({
  code: z.string().min(1, "Barcode/Code is required"),
  name: z.string().min(1, "Item name is required"),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await catalogService.getAllItems();
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          message: parsed.error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const result = await catalogService.createItem(parsed.data);
    if (!result.item) {
      return NextResponse.json(
        { error: "ITEM_CREATE_FAILED", message: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ item: result.item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to create catalog item" },
      { status: 500 }
    );
  }
}
