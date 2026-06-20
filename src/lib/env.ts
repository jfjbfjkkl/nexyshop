import "server-only";

function readEnv(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function requireEnv(name: string) {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalJson<T>(name: string): T | null {
  const value = readEnv(name);
  if (!value) return null;
  return JSON.parse(value) as T;
}

export interface AstralProductMapEntry {
  productId: number;
  type: "game" | "giftcard";
  slug: string;
  denomination: string;
  region?: string;
}

export function getAppUrl() {
  return requireEnv("APP_URL").replace(/\/$/, "");
}

export function getAstralConfig() {
  return {
    baseUrl: readEnv("ASTRAL_BASE_URL") ?? "https://api.astral4gamer.com/api/reseller/v1",
    apiKey: requireEnv("ASTRAL_API_KEY"),
    productMap: optionalJson<AstralProductMapEntry[]>("ASTRAL_PRODUCT_MAP_JSON") ?? [],
  };
}

export function getMonerooConfig() {
  return {
    baseUrl: readEnv("MONEROO_BASE_URL") ?? "https://api.moneroo.io/v1",
    secretKey: requireEnv("MONEROO_SECRET_KEY"),
    webhookSecret: requireEnv("MONEROO_WEBHOOK_SECRET"),
  };
}

export function getRedisConfig() {
  const url = readEnv("UPSTASH_REDIS_REST_URL");
  const token = readEnv("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  return { url, token };
}

export function getOrderTokenSecret() {
  return requireEnv("ORDER_TOKEN_SECRET");
}