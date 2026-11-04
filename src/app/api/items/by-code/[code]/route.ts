import { NextRequest, NextResponse } from "next/server";
import { catalogService } from "@/features/catalog/services/catalog-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const rawCode = decodeURIComponent(params.code || "");
    const result = await catalogService.getItemByCode(rawCode);

    if (result.statusCode !== 200) {
      return NextResponse.json(
        {
          error: result.statusCode === 404 ? "NOT_FOUND" : "BAD_REQUEST",
          message: result.error,
          statusCode: result.statusCode,
        },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({ item: result.item }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred while looking up the item.",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
