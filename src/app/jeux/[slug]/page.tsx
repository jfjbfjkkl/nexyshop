"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";
import SiteNavbar from "@/components/SiteNavbar";
import { games, getGame, type Game } from "@/lib/data";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";

function resolveCategory(slug: string) {
  if (["free-fire", "pubg-mobile", "fortnite", "blood-strike"].includes(slug)) return "Battle Royale";
  if (["call-of-duty"].includes(slug)) return "FPS";
  if (["mobile-legends", "honor-of-kings", "brawl-stars"].includes(slug)) return "MOBA";
  if (["genshin-impact"].includes(slug)) return "RPG";
  if (["fc-mobile"].includes(slug)) return "Sport";
  return "Action";
}

const gameGroups = [
  ["free-fire", "pubg-mobile", "fortnite", "blood-strike", "call-of-duty"],
  ["mobile-legends", "honor-of-kings", "brawl-stars"],
  ["genshin-impact", "roblox"],
  ["fc-mobile"],
];

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[\s:-]+/)
    .filter((token) => token.length > 2);
}

function resolveSimilarGames(currentGame: Game) {
  const currentCategory = resolveCategory(currentGame.slug);
  const currentTokens = tokenize(currentGame.name);
  const currentGroup = gameGroups.find((group) => group.includes(currentGame.slug));

  return games
    .filter((entry) => entry.slug !== currentGame.slug)
    .map((entry) => {
      const entryName = entry.name.toLowerCase();
      const sameCategory = resolveCategory(entry.slug) === currentCategory;
      const sameGroup = currentGroup?.includes(entry.slug) ?? false;
      const matchingName = currentTokens.some((token) => entryName.includes(token));
      const score = (sameGroup ? 6 : 0) + (sameCategory ? 4 : 0) + (matchingName ? 2 : 0);

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, 3)
    .map(({ entry }) => ({
      slug: entry.slug,
      name: entry.name,
      image: entry.image,
      logo: entry.logo,
      currency: entry.currency,
      background: entry.bg,
    }));
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const game = getGame(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [added, setAdded] = useState(false);
 
  useEffect(() => {
    if (!game) return;
    trackProductEvent("game", game.slug, "visit");
  }, [game]);

  useEffect(() => {
    setSelectedOffer(0);
    setSelectedRegion(0);
    setPlayerId("");
    setAdded(false);
  }, [slug]);

  if (!game) {
    return (
      <main className="min-h-screen bg-[#f5f8ff]">
        <SiteNavbar activeView="games" />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-[880px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-black text-[#0A1020]">Jeu introuvable</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold text-[#6B7A99]">
            Le jeu demande n&apos;est plus disponible ou l&apos;adresse est incorrecte.
          </p>
          <button
            type="button"
            onClick={() => router.push("/jeux")}
            className="mt-6 rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-black text-white"
          >
            Retour au catalogue jeux
          </button>
        </section>
      </main>
    );
  }

  const region = game.regions[selectedRegion] ?? game.regions[0];
  const offers = useMemo(
    () =>
      game.denominations.map((entry) => ({
        label: entry.label,
        price: Number((entry.price * region.multiplier).toFixed(2)),
        caption: selectedOffer === game.denominations.indexOf(entry) ? "Active" : "Choisir",
      })),
    [game.denominations, region.multiplier, selectedOffer]
  );

  const pushSelectedOffer = () => {
    const selected = game.denominations[selectedOffer] ?? game.denominations[0];
    const price = Number((selected.price * region.multiplier).toFixed(2));

    addItem({
      productId: game.slug,
      name: game.name,
      denomination: selected.label,
      price,
      type: "game",
      image: game.image,
      art: game.bg,
      delivery: {
        playerId: playerId.trim(),
        region: region.id,
      },
    });
  };

  const handleAddToCart = () => {
    pushSelectedOffer();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const handleConfirmOrder = () => {
    pushSelectedOffer();
    router.push("/panier");
  };

  const similarGames = resolveSimilarGames(game);

 return (
  <div className="pt-12 sm:pt-16 lg:pt-20">
    <ProductDetailPage
      activeView="games"
      categoryLabel={resolveCategory(game.slug)}
      productTypeLabel="Recharge jeu"
      title={game.name}
      description={game.description}
      image={game.image}
      background={game.bg}
      offers={offers}
      selectedOffer={selectedOffer}
      onSelectOffer={setSelectedOffer}
      playerId={playerId}
      onPlayerIdChange={setPlayerId}
      onAddToCart={handleAddToCart}
      onConfirmOrder={handleConfirmOrder}
      addToCartLabel="Ajouter au panier"
      payNowLabel="Payer maintenant"
      addedToCart={added}
      showPlayerId
      regionOptions={game.regions}
      selectedRegion={selectedRegion}
      onRegionChange={setSelectedRegion}
      selectedRegionHelper={region.helper}
      similarGames={similarGames}
    />
  </div>
);
}
