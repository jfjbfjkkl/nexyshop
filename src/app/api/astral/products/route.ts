import { NextResponse } from "next/server";
import { listAstralProducts } from "@/lib/providers/astral4gamer";

export async function GET() {
  try {
    const products = await listAstralProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load Astral products." },
      { status: 400 },
    );
  }
}