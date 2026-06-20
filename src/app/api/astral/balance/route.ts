import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/admin";
import { getAstralBalance } from "@/lib/providers/astral4gamer";

export async function GET(request: Request) {
  const forbiddenResponse = requireAdminToken(request);
  if (forbiddenResponse) return forbiddenResponse;

  try {
    const balance = await getAstralBalance();
    return NextResponse.json(balance);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Astral balance." },
      { status: 400 },
    );
  }
}