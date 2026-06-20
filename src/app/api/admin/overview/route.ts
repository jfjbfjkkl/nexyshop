import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/admin";
import { getAstralBalance } from "@/lib/providers/astral4gamer";
import { getAstralConfig, getMonerooConfig, getRedisConfig } from "@/lib/env";

export async function GET(request: Request) {
  const forbiddenResponse = requireAdminToken(request);
  if (forbiddenResponse) return forbiddenResponse;

  const overview = {
    appUrlConfigured: Boolean(process.env.APP_URL?.trim()),
    adminTokenConfigured: Boolean(process.env.ADMIN_API_TOKEN?.trim()),
    adminSessionSecretConfigured: Boolean(process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ORDER_TOKEN_SECRET?.trim()),
    astralApiConfigured: false,
    monerooConfigured: false,
    remoteStoreConfigured: Boolean(getRedisConfig()),
    astralMappingCount: 0,
    balance: null as unknown,
    balanceError: null as string | null,
  };

  try {
    const astral = getAstralConfig();
    overview.astralApiConfigured = Boolean(astral.apiKey);
    overview.astralMappingCount = astral.productMap.length;
  } catch {
    overview.astralApiConfigured = false;
  }

  try {
    const moneroo = getMonerooConfig();
    overview.monerooConfigured = Boolean(moneroo.secretKey && moneroo.webhookSecret);
  } catch {
    overview.monerooConfigured = false;
  }

  try {
    overview.balance = await getAstralBalance();
  } catch (error) {
    overview.balanceError = error instanceof Error ? error.message : "Unable to load Astral balance.";
  }

  return NextResponse.json(overview);
}