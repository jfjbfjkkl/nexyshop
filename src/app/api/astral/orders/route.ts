import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/admin";
import { getAstralOrder } from "@/lib/providers/astral4gamer";

export async function GET(request: Request) {
  const forbiddenResponse = requireAdminToken(request);
  if (forbiddenResponse) return forbiddenResponse;

  try {
    const order = await getAstralOrder(new URL(request.url).searchParams);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Astral order." },
      { status: 400 },
    );
  }
}