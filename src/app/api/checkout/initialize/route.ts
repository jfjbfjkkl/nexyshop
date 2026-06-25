import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { resolveAstralProductId, resolveCheckoutCartFromAstral } from "@/lib/catalog";
import { getAppUrl } from "@/lib/env";
import { storeInitializedOrder } from "@/lib/fulfillment";
import { createOrderToken } from "@/lib/order-token";
import { initializeMonerooPayment } from "@/lib/providers/moneroo";
import type { CheckoutPayload, CheckoutCustomer, OrderTokenPayload } from "@/lib/commerce";

function validateCustomer(customer: CheckoutCustomer | undefined) {
  if (!customer) {
    throw new Error("Customer information is required.");
  }

  const email = customer.email?.trim();
  const firstName = customer.firstName?.trim();
  const lastName = customer.lastName?.trim();

  if (!email || !firstName || !lastName) {
    throw new Error("First name, last name and email are required.");
  }

  return { email, firstName, lastName };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const customer = validateCustomer(body.customer);
    const currency = body.currency?.trim().toUpperCase() || "EUR";
    const { lines, amount } = await resolveCheckoutCartFromAstral(body.cart);
    const orderId = randomUUID();

    const items = lines.map((line, index) => ({
      ...line,
      providerProductId: resolveAstralProductId(line),
      partnerReference: `nxy_${orderId}_${index + 1}`,
    }));

    const orderPayload: OrderTokenPayload = {
      orderId,
      currency,
      createdAt: new Date().toISOString(),
      customer,
      items,
    };

    const orderToken = createOrderToken(orderPayload);
    const payment = await initializeMonerooPayment({
      amount,
      currency,
      description: `Payment for order ${orderId}`,
      return_url: `${getAppUrl()}/paiement/retour`,
      customer: {
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
      },
      metadata: {
        order_id: orderId,
        order_token: orderToken,
        customer_email: customer.email,
      },
    });

    await storeInitializedOrder(orderPayload, payment.id, payment.checkout_url);

    return NextResponse.json({
      orderId,
      paymentId: payment.id,
      checkoutUrl: payment.checkout_url,
      amount,
      currency,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to initialize checkout." },
      { status: 400 },
    );
  }
}