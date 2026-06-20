import { NextResponse } from "next/server";
import { clearAdminSessionResponse, createAdminSessionResponse, isAdminAuthenticated } from "@/lib/admin";

export async function GET(request: Request) {
  return NextResponse.json({ authenticated: isAdminAuthenticated(request) });
}

export async function POST(request: Request) {
  const configuredToken = process.env.ADMIN_API_TOKEN?.trim();
  if (!configuredToken) {
    return NextResponse.json({ error: "ADMIN_API_TOKEN is not configured." }, { status: 500 });
  }

  try {
    const body = (await request.json()) as { token?: string };
    if (body.token?.trim() !== configuredToken) {
      return NextResponse.json({ error: "Token admin invalide." }, { status: 401 });
    }

    return createAdminSessionResponse();
  } catch {
    return NextResponse.json({ error: "Requete admin invalide." }, { status: 400 });
  }
}

export async function DELETE() {
  return clearAdminSessionResponse();
}