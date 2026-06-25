import HomeClient, { type HomeGame, type HomeGiftCard } from "@/components/HomeClient";
import { getAstralProductsByType, type AstralCatalogProduct } from "@/lib/astral-catalog";

const accents = ["#40b8ff", "#f6a33b", "#f2c96e", "#8ad8ff", "#25c6ff", "#44d26a", "#ffcf22", "#ff4aa3"];

function cssImageUrl(value?: string) {
  if (!value) return undefined;
  return `url("${value.replace(/"/g, "\\\"")}")`;
}

function toHomeGame(product: AstralCatalogProduct, index: number): HomeGame {
  const offer = product.denominations[0];
  const imageArt = cssImageUrl(product.image);

  return {
    slug: product.slug,
    name: product.name,
    currency: product.currency || product.category,
    accent: accents[index % accents.length],
    art: imageArt ? `linear-gradient(150deg, rgba(4,12,28,.08), rgba(4,12,28,.62)), ${imageArt}` : product.bg,
    image: product.image ?? "",
    denomination: offer?.label ?? product.category,
    price: offer?.price ?? 0,
  };
}

function toHomeGiftCard(product: AstralCatalogProduct): HomeGiftCard {
  const offer = product.denominations[0];

  return {
    slug: product.slug,
    name: product.name,
    tone: "astral",
    image: product.image ?? "",
    href: `/cartes/${product.slug}`,
    denomination: offer?.label ?? product.category,
    price: offer?.price ?? 0,
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const [games, giftCards] = await Promise.all([
    getAstralProductsByType("game"),
    getAstralProductsByType("giftcard"),
  ]);

  return (
    <HomeClient
      games={games.slice(0, 8).map(toHomeGame)}
      giftCards={giftCards.slice(0, 6).map(toHomeGiftCard)}
    />
  );
}
