"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";
import type { AstralCatalogProduct } from "@/lib/astral-catalog";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";

type SimilarProduct = {
  slug: string;
  name: string;
  image?: string;
  logo: string;
  currency: string;
  background: string;
};

export default function GameDetailClient({ game, similarGames }: { game: AstralCatalogProduct; similarGames: SimilarProduct[] }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    trackProductEvent(game.type, game.slug, "visit");
  }, [game.slug, game.type]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSelectedOffer(0);
      setPlayerId("");
      setAdded(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [game.slug]);

  const offers = game.denominations.map((entry, index) => ({
    label: entry.label,
    price: entry.price,
    caption: selectedOffer === index ? "Active" : "Choisir",
  }));

  const pushSelectedOffer = () => {
    const selected = game.denominations[selectedOffer] ?? game.denominations[0];

    addItem({
      productId: game.slug,
      providerProductId: selected.providerProductId,
      name: game.name,
      denomination: selected.label,
      price: selected.price,
      type: game.type,
      image: game.image,
      art: game.bg,
      delivery: game.requiresUid ? { playerId: playerId.trim(), region: "global" } : undefined,
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
        activeView={game.type === "giftcard" ? "cards" : "games"}
        categoryLabel={game.category}
        productTypeLabel="Produit Astral"
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
        showPlayerId={game.requiresUid}
        similarGames={similarGames}
      />
    </div>
  );
}