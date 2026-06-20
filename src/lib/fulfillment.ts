import "server-only";

import { addAstralOrder } from "@/lib/providers/astral4gamer";
import { markPaymentFulfilled, readOrderRecord, saveOrderRecord } from "@/lib/remote-store";
import type { FulfillmentRecord, OrderTokenPayload, StoredOrderRecord } from "@/lib/commerce";

function buildInitialRecord(order: OrderTokenPayload, paymentId: string, paymentStatus: string, checkoutUrl?: string): StoredOrderRecord {
  return {
    orderId: order.orderId,
    paymentId,
    paymentStatus,
    checkoutUrl,
    currency: order.currency,
    amount: Number(order.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)),
    customer: order.customer,
    items: order.items,
    fulfillment: order.items.map((item) => ({
      partnerReference: item.partnerReference,
      providerProductId: item.providerProductId,
      status: "pending",
    })),
    updatedAt: new Date().toISOString(),
  };
}

export async function storeInitializedOrder(order: OrderTokenPayload, paymentId: string, checkoutUrl: string) {
  const record = buildInitialRecord(order, paymentId, "initiated", checkoutUrl);
  await saveOrderRecord(paymentId, record);
}

export async function fulfillAstralOrder(order: OrderTokenPayload, paymentId: string, paymentStatus: string) {
  const alreadyProcessed = await markPaymentFulfilled(paymentId);
  if (alreadyProcessed === false) {
    const existing = await readOrderRecord(paymentId);
    if (existing) return existing;
  }

  const fulfillment: FulfillmentRecord[] = [];

  for (const item of order.items) {
    try {
      const response = await addAstralOrder({
        product_id: item.providerProductId,
        quantity: item.quantity,
        partner_reference: item.partnerReference,
        data: {
          player_id: item.delivery?.playerId,
          region: item.delivery?.region,
        },
      });

      fulfillment.push({
        partnerReference: item.partnerReference,
        providerProductId: item.providerProductId,
        status: "submitted",
        astralResponse: response,
      });
    } catch (error) {
      fulfillment.push({
        partnerReference: item.partnerReference,
        providerProductId: item.providerProductId,
        status: "failed",
        error: error instanceof Error ? error.message : "Astral4Gamer order failed.",
      });
    }
  }

  const record: StoredOrderRecord = {
    orderId: order.orderId,
    paymentId,
    paymentStatus,
    currency: order.currency,
    amount: Number(order.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)),
    customer: order.customer,
    items: order.items,
    fulfillment,
    updatedAt: new Date().toISOString(),
  };

  await saveOrderRecord(paymentId, record);
  return record;
}