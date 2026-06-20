"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getGiftCard } from "@/lib/data";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GiftCardPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const card = getGiftCard(slug);
  const addItem = useCartStore((s) => s.addItem);
  const [selected, setSelected] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!card) return;
    trackProductEvent("giftcard", card.slug, "visit");
  }, [card]);

  if (!card) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7fb]">
        <p className="text-xl font-bold text-[#0A1020]">Carte introuvable.</p>
        <button onClick={() => router.push("/")} className="mt-6 rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-bold text-white">
          Retour à l&apos;accueil
        </button>
      </main>
    );
  }

  function handleAddToCart() {
    if (selected === null) return;
    const denom = card!.denominations[selected];
    addItem({
      productId: card!.slug,
      name: card!.name,
      denomination: denom.label,
      price: denom.price,
      type: "giftcard",
      image: card!.image,
      art: card!.bg,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[260px] overflow-hidden pt-[80px]" style={{ background: card.bg }}>
        {card.image && (
          <Image
            src={card.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative flex h-full items-end px-6 pb-8 sm:px-12">
          <div>
            <button onClick={() => router.push("/")} className="mb-3 flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white">
              ← Retour
            </button>
            <h1 className="text-3xl font-black text-white drop-shadow-lg sm:text-4xl">{card.name}</h1>
            <p className="mt-1 text-sm font-medium text-white/70">{card.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-main px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
          <h2 className="mb-2 text-lg font-black text-[#0A1020]">Choisir le montant</h2>
          <p className="mb-8 text-sm text-[#6B7A99]">Sélectionne une option puis ajoute au panier</p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {card.denominations.map((denom, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 text-center transition ${
                  selected === i
                    ? "border-[#1463FF] bg-[#EBF1FF] text-[#1463FF]"
                    : "border-[#e7edf7] bg-[#f8fbff] text-[#0A1020] hover:border-[#1463FF]/40"
                }`}
              >
                <span className="text-sm font-black">{denom.label}</span>
                <span className="text-xs font-bold text-[#6B7A99]">{denom.price.toFixed(2)}€</span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={handleAddToCart}
              disabled={selected === null}
              className={`flex-1 rounded-2xl py-4 text-sm font-black transition sm:flex-none sm:px-10 ${
                selected === null
                  ? "cursor-not-allowed bg-[#e7edf7] text-[#aab4c8]"
                  : added
                  ? "bg-green-500 text-white"
                  : "bg-[#1463FF] text-white hover:bg-[#0D4FD6]"
              }`}
            >
              {added ? "✓ Ajouté au panier !" : selected !== null ? `Ajouter — ${card.denominations[selected].price.toFixed(2)}€` : "Sélectionne un montant"}
            </button>
            <button
              onClick={() => router.push("/panier")}
              className="rounded-2xl border-2 border-[#e7edf7] px-8 py-4 text-sm font-bold text-[#0A1020] hover:border-[#1463FF]/40 sm:flex-none"
            >
              Voir le panier
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
