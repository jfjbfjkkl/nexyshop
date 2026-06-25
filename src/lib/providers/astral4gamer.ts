import "server-only";

import { getAstralConfig } from "@/lib/env";

type AstralOrderPayload = {
  product_id: number | string;
  quantity: number;
  partner_reference: string;
  data: {
    player_id?: string;
    region?: string;
  };
};

async function astralFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getAstralConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await response.text();
  const json = body ? JSON.parse(body) : null;

  if (!response.ok) {
    const message = json?.message ?? `Astral4Gamer request failed with status ${response.status}`;
    throw new Error(message);
  }

  return json as T;
}

export function listAstralProducts(page = 1) {
  return astralFetch<unknown>(`/products?page=${page}`, { method: "GET" });
}

export function getAstralBalance() {
  return astralFetch<unknown>("/get-balance", { method: "GET" });
}

export function addAstralOrder(payload: AstralOrderPayload) {
  return astralFetch<unknown>("/order/add-order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getAstralOrder(search: URLSearchParams) {
  const query = search.toString();
  return astralFetch<unknown>(`/order/get-order${query ? `?${query}` : ""}`, { method: "GET" });
}