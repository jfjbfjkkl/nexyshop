import "server-only";

import { games, giftCards } from "@/lib/data";
import { getAstralConfig } from "@/lib/env";
import type { CartDeliveryData, CartItem, ProductType, ResolvedCheckoutLine } from "@/lib/commerce";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function roundPrice(value: number) {
  return Number(value.toFixed(2));
}

function resolveGamePrice(slug: string, denomination: string, delivery?: CartDeliveryData) {
  const game = games.find((entry) => entry.slug === slug);
  if (!game) {
    throw new Error(`Unknown game product: ${slug}`);
  }

  const selectedDenomination = game.denominations.find(
    (entry) => normalizeText(entry.label) === normalizeText(denomination),
  );

  if (!selectedDenomination) {
    throw new Error(`Unknown denomination for ${slug}: ${denomination}`);
  }

  const region = game.regions.find((entry) => entry.id === delivery?.region);
  if (!region) {
    throw new Error(`Missing or invalid region for ${slug}`);
  }

  if (!delivery?.playerId?.trim()) {
    throw new Error(`Missing player ID for ${slug}`);
  }

  return {
    name: game.name,
    unitPrice: roundPrice(selectedDenomination.price * region.multiplier),
  };
}

function resolveGiftCardPrice(slug: string, denomination: string) {
  const card = giftCards.find((entry) => entry.slug === slug);
  if (!card) {
    throw new Error(`Unknown gift card product: ${slug}`);
  }

  const selectedDenomination = card.denominations.find(
    (entry) => normalizeText(entry.label) === normalizeText(denomination),
  );

  if (!selectedDenomination) {
    throw new Error(`Unknown denomination for ${slug}: ${denomination}`);
  }

  return {
    name: card.name,
    unitPrice: roundPrice(selectedDenomination.price),
  };
}

export function resolveCheckoutLine(item: CartItem): ResolvedCheckoutLine {
  const quantity = Number.isFinite(item.quantity) ? Math.max(1, Math.floor(item.quantity)) : 1;
  const priceSource = item.type === "game"
    ? resolveGamePrice(item.productId, item.denomination, item.delivery)
    : resolveGiftCardPrice(item.productId, item.denomination);

  return {
    id: item.id,
    slug: item.productId,
    name: priceSource.name,
    type: item.type,
    denomination: item.denomination,
    quantity,
    unitPrice: priceSource.unitPrice,
    lineTotal: roundPrice(priceSource.unitPrice * quantity),
    delivery: item.delivery,
  };
}

export function resolveCheckoutCart(cart: CartItem[]) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const lines = cart.map(resolveCheckoutLine);
  const amount = roundPrice(lines.reduce((sum, line) => sum + line.lineTotal, 0));

  return { lines, amount };
}

export function resolveAstralProductId(line: ResolvedCheckoutLine) {
  const { productMap } = getAstralConfig();
  const match = productMap.find((entry) => {
    if (entry.type !== line.type) return false;
    if (entry.slug !== line.slug) return false;
    if (normalizeText(entry.denomination) !== normalizeText(line.denomination)) return false;
    if (line.type === "game") {
      return entry.region === line.delivery?.region;
    }
    return true;
  });

  if (!match) {
    throw new Error(`No Astral4Gamer mapping configured for ${line.slug} / ${line.denomination}`);
  }

  return match.productId;
}

export function getCatalogProducts(type?: ProductType) {
  if (type === "game") return games;
  if (type === "giftcard") return giftCards;
  return { games, giftCards };
}