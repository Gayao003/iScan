import { NextResponse } from "next/server";
import { reconciliationService } from "@/features/inventory/services/reconciliation-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await reconciliationService.getReconciliationData();
    return NextResponse.json({ reconciliation: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to fetch reconciliation records" },
      { status: 500 }
    );
  }
}
