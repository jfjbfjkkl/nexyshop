import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { getOrderTokenSecret } from "@/lib/env";
import type { OrderTokenPayload } from "@/lib/commerce";

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Buffer.from(padded, "base64");
}

function sign(payload: string) {
  return toBase64Url(createHmac("sha256", getOrderTokenSecret()).update(payload).digest());
}

export function createOrderToken(payload: OrderTokenPayload) {
  const serialized = JSON.stringify(payload);
  const encodedPayload = toBase64Url(serialized);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function parseOrderToken(token: string) {
  const [encodedPayload, providedSignature] = token.split(".");
  if (!encodedPayload || !providedSignature) {
    throw new Error("Invalid order token format.");
  }

  const expectedSignature = sign(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid order token signature.");
  }

  return JSON.parse(fromBase64Url(encodedPayload).toString("utf8")) as OrderTokenPayload;
}