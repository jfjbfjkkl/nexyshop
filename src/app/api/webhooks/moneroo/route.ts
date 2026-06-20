import { NextResponse } from "next/server";
import { fulfillAstralOrder } from "@/lib/fulfillment";
import { parseOrderToken } from "@/lib/order-token";
import { verifyMonerooPayment, verifyMonerooSignature } from "@/lib/providers/moneroo";

function extractPaymentId(payload: Record<string, unknown>) {
  const data = payload.data as Record<string, unknown> | undefined;
  if (typeof data?.id === "string") return data.id;
  if (typeof payload.paymentId === "string") return payload.paymentId;
  if (typeof payload.id === "string") return payload.id;
  return null;
}

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const signature = request.headers.get("x-moneroo-signature");

  if (!verifyMonerooSignature(rawPayload, signature)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  try {
    const payload = JSON.parse(rawPayload) as Record<string, unknown>;
    const paymentId = extractPaymentId(payload);
    if (!paymentId) {
      return NextResponse.json({ error: "Payment id missing from webhook." }, { status: 400 });
    }

    const verifiedPayment = await verifyMonerooPayment(paymentId);
    if (verifiedPayment.status !== "success") {
      return NextResponse.json({ received: true, skipped: verifiedPayment.status });
    }

    const token = verifiedPayment.metadata?.order_token;
    if (!token) {
      return NextResponse.json({ error: "Missing order token in payment metadata." }, { status: 400 });
    }

    const order = parseOrderToken(token);
    const record = await fulfillAstralOrder(order, paymentId, verifiedPayment.status);

    return NextResponse.json({ received: true, order: record });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed." },
      { status: 500 },
    );
  }
}