import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "nexyshop_admin_session";

function getConfiguredAdminToken() {
  return process.env.ADMIN_API_TOKEN?.trim() ?? null;
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? process.env.ORDER_TOKEN_SECRET?.trim() ?? null;
}

function signAdminValue(value: string) {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error("Missing admin session secret. Set ADMIN_SESSION_SECRET or ORDER_TOKEN_SECRET.");
  }

  return createHmac("sha256", secret).update(value).digest("hex");
}

function parseCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return new Map<string, string>();

  return new Map(
    cookieHeader
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const separatorIndex = entry.indexOf("=");
        if (separatorIndex === -1) return [entry, ""];
        return [entry.slice(0, separatorIndex), decodeURIComponent(entry.slice(separatorIndex + 1))];
      }),
  );
}

function readAdminSession(request: Request) {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  return cookies.get(ADMIN_COOKIE_NAME) ?? null;
}

function isValidSignedValue(rawValue: string) {
  const [payload, providedSignature] = rawValue.split(".");
  if (!payload || !providedSignature) return false;

  const expectedSignature = signAdminValue(payload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

function buildAdminCookie(value: string) {
  const signature = signAdminValue(value);
  return `${value}.${signature}`;
}

export function isAdminAuthenticated(request: Request) {
  const configuredToken = getConfiguredAdminToken();
  if (!configuredToken) return true;

  const providedHeader = request.headers.get("x-admin-token");
  if (providedHeader === configuredToken) return true;

  const session = readAdminSession(request);
  if (!session || !isValidSignedValue(session)) return false;

  const [value] = session.split(".");
  return value === configuredToken;
}

export function requireAdminToken(request: Request) {
  if (isAdminAuthenticated(request)) return null;

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function createAdminSessionResponse() {
  const configuredToken = getConfiguredAdminToken();
  if (!configuredToken) {
    throw new Error("Missing ADMIN_API_TOKEN environment variable.");
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: buildAdminCookie(configuredToken),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export function clearAdminSessionResponse() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}