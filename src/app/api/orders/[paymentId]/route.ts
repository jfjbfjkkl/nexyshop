import { NextResponse } from "next/server";
import { fulfillAstralOrder } from "@/lib/fulfillment";
import { parseOrderToken } from "@/lib/order-token";
import { verifyMonerooPayment } from "@/lib/providers/moneroo";
import { readOrderRecord } from "@/lib/remote-store";

type RouteContext = {
  params: Promise<{
    paymentId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { paymentId } = await context.params;
    const payment = await verifyMonerooPayment(paymentId);
    const token = payment.metadata?.order_token;
    const existingRecord = await readOrderRecord(paymentId);

    if (payment.status === "success" && token) {
      const record = await fulfillAstralOrder(parseOrderToken(token), paymentId, payment.status);
      return NextResponse.json({ payment, order: record });
    }

    return NextResponse.json({ payment, order: existingRecord });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load order status." },
      { status: 400 },
    );
  }
}