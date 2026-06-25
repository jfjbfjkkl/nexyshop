import "server-only";

import { listAstralProducts } from "@/lib/providers/astral4gamer";
import type { ProductType } from "@/lib/commerce";

export type AstralDenomination = {
  label: string;
  price: number;
  providerProductId: number | string;
};

export type AstralCatalogProduct = {
  id: number;
  slug: string;
  type: ProductType;
  name: string;
  category: string;
  description: string;
  image?: string;
  bg: string;
  logo: string;
  currency: string;
  requiresUid: boolean;
  denominations: AstralDenomination[];
};

type AstralVariation = {
  variation_id?: number | string;
  id?: number | string;
  name?: string;
  price?: number | string;
  currency?: string;
};

type AstralProduct = {
  id?: number;
  name?: string;
  category?: string;
  sku?: string;
  image_url?: string;
  description?: string;
  price?: number | string;
  currency?: string;
  requires_uid?: boolean;
  variations?: AstralVariation[];
};

type AstralProductsPage = {
  current_page?: number;
  last_page?: number;
  data: AstralProduct[];
};

function isProductsPage(value: unknown): value is AstralProductsPage {
  return typeof value === "object" && value !== null && Array.isArray((value as AstralProductsPage).data);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeLogo(name: string) {
  const initials = name
    .replace(/\([^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "NX";
}

function makeBackground(seed: number) {
  const palettes = [
    ["#1463ff", "#071a44", "#020817"],
    ["#15a37a", "#08382d", "#020817"],
    ["#f97316", "#7c2d12", "#140700"],
    ["#7c3aed", "#32135f", "#070214"],
    ["#0ea5e9", "#075985", "#02131f"],
  ];
  const palette = palettes[Math.abs(seed) % palettes.length];
  return `linear-gradient(160deg, ${palette[0]} 0%, ${palette[1]} 48%, ${palette[2]} 100%)`;
}

function classifyProduct(product: AstralProduct): ProductType {
  const haystack = `${product.name ?? ""} ${product.category ?? ""} ${product.description ?? ""}`.toLowerCase();
  if (!product.requires_uid) return "giftcard";
  if (/gift|card|voucher|code|shells/.test(haystack) && !/undawn|mobile|free fire|pubg|genshin|brawl|blood|roblox|call of duty/.test(haystack)) {
    return "giftcard";
  }
  return "game";
}

function readPrice(value: number | string | undefined) {
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isFinite(parsed) ? Number(Number(parsed).toFixed(2)) : 0;
}

function normalizeProduct(product: AstralProduct, slug: string): AstralCatalogProduct | null {
  if (!product.id || !product.name) return null;

  const variations = Array.isArray(product.variations) ? product.variations : [];
  const denominations = variations.length > 0
    ? variations.map((variation) => ({
        label: variation.name?.trim() || product.name || "Offre",
        price: readPrice(variation.price),
        providerProductId: variation.variation_id ?? variation.id ?? product.id!,
      }))
    : [{ label: product.name, price: readPrice(product.price), providerProductId: product.id }];

  return {
    id: product.id,
    slug,
    type: classifyProduct(product),
    name: product.name,
    category: product.category || "Produit Astral",
    description: product.description || `Produit ${product.name} fourni par Astral4Gamer.`,
    image: product.image_url,
    bg: makeBackground(product.id),
    logo: makeLogo(product.name),
    currency: product.currency || denominations[0]?.label || "Produit digital",
    requiresUid: Boolean(product.requires_uid),
    denominations: denominations.filter((entry) => entry.price > 0),
  };
}

export async function getAstralCatalog() {
  const products: AstralProduct[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await listAstralProducts(page);
    if (!isProductsPage(response)) break;

    products.push(...response.data);
    lastPage = response.last_page ?? response.current_page ?? page;
    page += 1;
  } while (page <= lastPage && page <= 50);

  const slugCounts = new Map<string, number>();

  return products
    .map((product) => {
      const baseSlug = slugify(product.name || product.sku || `astral-${product.id}`) || `astral-${product.id}`;
      const count = slugCounts.get(baseSlug) ?? 0;
      slugCounts.set(baseSlug, count + 1);
      const slug = count === 0 ? baseSlug : `${baseSlug}-${product.id}`;
      return normalizeProduct(product, slug);
    })
    .filter((product): product is AstralCatalogProduct => Boolean(product && product.denominations.length > 0));
}

export async function getAstralProductBySlug(slug: string) {
  const products = await getAstralCatalog();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getAstralProductsByType(type: ProductType) {
  const products = await getAstralCatalog();
  return products.filter((product) => product.type === type);
}