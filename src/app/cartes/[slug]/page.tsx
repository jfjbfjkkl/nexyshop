"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetailPage from "@/components/ProductDetailPage";
import SiteNavbar from "@/components/SiteNavbar";
import { getGiftCard } from "@/lib/data";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";

const giftCardImages: Record<string, string> = {
  "google-play": "/play-store-card.png",
  netflix: "/image copy.png",
  playstation: "/image copy 4.png",
  xbox: "/image copy 3.png",
  spotify: "/image copy 11.png",
  "pubg-mobile-gift": "/image copy 13.png",
};

function resolveCategory(name: string) {
  if (name.includes("Spotify") || name.includes("Netflix")) return "Abonnement";
  if (name.includes("Play") || name.includes("Xbox") || name.includes("PUBG")) return "Produit digital";
  return "Carte cadeau";
}

export default function GiftCardDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const card = getGiftCard(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedOffer, setSelectedOffer] = useState(0);
  const [accountId, setAccountId] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!card) return;
    trackProductEvent("giftcard", card.slug, "visit");
  }, [card]);

  useEffect(() => {
    setSelectedOffer(0);
    setAccountId("");
    setAdded(false);
  }, [slug]);

  if (!card) {
    return (
      <main className="min-h-screen bg-[#f5f8ff]">
        <SiteNavbar activeView="cards" />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-[880px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-black text-[#0A1020]">Produit introuvable</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold text-[#6B7A99]">
            Le produit demande n&apos;est plus disponible ou l&apos;adresse est incorrecte.
          </p>
          <button
            type="button"
            onClick={() => router.push("/cartes")}
            className="mt-6 rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-black text-white"
          >
            Retour au catalogue cartes
          </button>
        </section>
      </main>
    );
  }

  const offers = useMemo(
    () => card.denominations.map((entry, index) => ({
      label: entry.label,
      price: entry.price,
      caption: selectedOffer === index ? "Active" : "Choisir",
    })),
    [card.denominations, selectedOffer]
  );

  const pushSelectedOffer = () => {
    const selected = card.denominations[selectedOffer] ?? card.denominations[0];

    addItem({
      productId: card.slug,
      name: card.name,
      denomination: selected.label,
      price: selected.price,
      type: "giftcard",
      image: card.image ?? giftCardImages[card.slug],
      art: card.bg,
      delivery: accountId.trim() ? { playerId: accountId.trim() } : undefined,
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
      activeView="cards"
      categoryLabel={resolveCategory(card.name)}
      productTypeLabel="Produit digital"
      title={card.name}
      description={card.description}
      image={card.image ?? giftCardImages[card.slug]}
      background={card.bg}
      offers={offers}
      selectedOffer={selectedOffer}
      onSelectOffer={setSelectedOffer}
      playerId={accountId}
      onPlayerIdChange={setAccountId}
      onAddToCart={handleAddToCart}
      onConfirmOrder={handleConfirmOrder}
      addToCartLabel="Ajouter au panier"
      payNowLabel="Payer maintenant"
      addedToCart={added}
      showPlayerId
    />
  </div>
);
}