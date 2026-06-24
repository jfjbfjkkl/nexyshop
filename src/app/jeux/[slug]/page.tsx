"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";
import SiteNavbar from "@/components/SiteNavbar";
import { getGame } from "@/lib/data";
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
    />
  </div>
);
}