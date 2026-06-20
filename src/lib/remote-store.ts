import "server-only";

import { getRedisConfig } from "@/lib/env";
import type { StoredOrderRecord } from "@/lib/commerce";

type RedisResult<T> = {
  result: T;
};

async function redisCommand<T>(command: string[]) {
  const config = getRedisConfig();
  if (!config) return null;

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Remote store request failed with status ${response.status}`);
  }

  return (await response.json()) as RedisResult<T>;
}

function orderKey(paymentId: string) {
  return `nexyshop:order:${paymentId}`;
}

function fulfillmentKey(paymentId: string) {
  return `nexyshop:fulfillment:${paymentId}`;
}

export async function saveOrderRecord(paymentId: string, value: StoredOrderRecord, ttlSeconds = 60 * 60 * 24 * 30) {
  const payload = JSON.stringify(value);
  await redisCommand(["SET", orderKey(paymentId), payload, "EX", String(ttlSeconds)]);
}

export async function readOrderRecord(paymentId: string) {
  const response = await redisCommand<string | null>(["GET", orderKey(paymentId)]);
  if (!response?.result) return null;
  return JSON.parse(response.result) as StoredOrderRecord;
}

export async function markPaymentFulfilled(paymentId: string, ttlSeconds = 60 * 60 * 24 * 30) {
  const response = await redisCommand<string | null>([
    "SET",
    fulfillmentKey(paymentId),
    new Date().toISOString(),
    "NX",
    "EX",
    String(ttlSeconds),
  ]);

  return response?.result === "OK";
}