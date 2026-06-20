import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getMonerooConfig } from "@/lib/env";

export interface MonerooInitializePayload {
  amount: number;
  currency: string;
  description: string;
  return_url: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
  };
  metadata: Record<string, string>;
}

interface MonerooResponse<T> {
  message: string;
  data: T;
  errors: unknown;
}

export interface MonerooInitializedPayment {
  id: string;
  checkout_url: string;
}

export interface MonerooVerifiedPayment {
  id: string;
  status: string;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

async function monerooFetch<T>(path: string, init?: RequestInit): Promise<MonerooResponse<T>> {
  const config = getMonerooConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await response.text();
  const json = body ? JSON.parse(body) : null;

  if (!response.ok) {
    const message = json?.message ?? `Moneroo request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json as MonerooResponse<T>;
}

export async function initializeMonerooPayment(payload: MonerooInitializePayload) {
  const response = await monerooFetch<MonerooInitializedPayment>("/payments/initialize", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function verifyMonerooPayment(paymentId: string) {
  const response = await monerooFetch<MonerooVerifiedPayment>(`/payments/${paymentId}/verify`, {
    method: "GET",
  });

  return response.data;
}

export function verifyMonerooSignature(rawPayload: string, signature: string | null) {
  if (!signature) return false;

  const expected = createHmac("sha256", getMonerooConfig().webhookSecret)
    .update(rawPayload)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer);
}