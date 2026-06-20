"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGame } from "@/lib/data";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const game = getGame(slug);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedDenomination, setSelectedDenomination] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!game) return;
    trackProductEvent("game", game.slug, "visit");
  }, [game]);

  const selectedRegionEntry = game?.regions[selectedRegion];
  const selectedPrice = useMemo(() => {
    if (!game || selectedDenomination === null || !selectedRegionEntry) return null;
    return Number((game.denominations[selectedDenomination].price * selectedRegionEntry.multiplier).toFixed(2));
  }, [game, selectedDenomination, selectedRegionEntry]);

  if (!game) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7fb]">
        <p className="text-xl font-bold text-[#0A1020]">Jeu introuvable.</p>
        <button onClick={() => router.push("/")} className="mt-6 rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-bold text-white">
          Retour a l&apos;accueil
        </button>
      </main>
    );
  }

  function handleAddToCart() {
    if (selectedDenomination === null || !selectedRegionEntry || !playerId.trim() || selectedPrice === null) return;

    const denomination = game.denominations[selectedDenomination];
    addItem({
      productId: game.slug,
      name: game.name,
      denomination: denomination.label,
      price: selectedPrice,
      type: "game",
      image: game.image,
      art: game.bg,
      delivery: {
        playerId: playerId.trim(),
        region: selectedRegionEntry.id,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <Navbar />

      <div className="relative h-[280px] overflow-hidden pt-[80px]" style={{ background: game.bg }}>
        {game.image && <Image src={game.image} alt="" fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="relative flex h-full items-end px-6 pb-8 sm:px-12">
          <div>
            <button onClick={() => router.push("/")} className="mb-3 flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white">
              ← Retour
            </button>
            <h1 className="text-3xl font-black text-white drop-shadow-lg sm:text-4xl">{game.name}</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-white/75">{game.description}</p>
          </div>
        </div>
      </div>

      <div className="container-main px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
            <h2 className="text-lg font-black text-[#0A1020]">1. Choisis ta recharge</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {game.denominations.map((denomination, index) => (
                <button
                  key={denomination.label}
                  type="button"
                  onClick={() => setSelectedDenomination(index)}
                  className={`rounded-2xl border-2 px-4 py-5 text-left transition ${
                    selectedDenomination === index
                      ? "border-[#1463FF] bg-[#EBF1FF]"
                      : "border-[#e7edf7] bg-[#f8fbff] hover:border-[#1463FF]/40"
                  }`}
                >
                  <p className="text-sm font-black text-[#0A1020]">{denomination.label}</p>
                  <p className="mt-2 text-xs font-bold text-[#6B7A99]">Base {denomination.price.toFixed(2)}€</p>
                </button>
              ))}
            </div>

            <h2 className="mt-10 text-lg font-black text-[#0A1020]">2. Region du compte</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {game.regions.map((region, index) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setSelectedRegion(index)}
                  className={`rounded-2xl border-2 p-5 text-left transition ${
                    selectedRegion === index
                      ? "border-[#1463FF] bg-[#EBF1FF]"
                      : "border-[#e7edf7] bg-[#f8fbff] hover:border-[#1463FF]/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-[#0A1020]">{region.name}</p>
                    <span className="text-xs font-black text-[#1463FF]">{region.feeLabel}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6B7A99]">{region.helper}</p>
                  <p className="mt-3 text-xs font-bold text-[#6B7A99]">Livraison {region.deliveryTime}</p>
                </button>
              ))}
            </div>
          </section>

          <aside className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
            <h2 className="text-lg font-black text-[#0A1020]">3. Infos de livraison</h2>
            <label className="mt-6 block text-sm font-bold text-[#0A1020]">
              ID joueur
              <input
                value={playerId}
                onChange={(event) => setPlayerId(event.target.value)}
                placeholder="Entre ton player ID"
                className="mt-2 w-full rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none ring-0 transition focus:border-[#1463FF]"
              />
            </label>

            <div className="mt-6 rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-[#e7edf7]">
              <p className="text-sm text-[#6B7A99]">Produit</p>
              <p className="mt-1 text-lg font-black text-[#0A1020]">{game.name}</p>
              <p className="mt-4 text-sm text-[#6B7A99]">Region</p>
              <p className="mt-1 font-bold text-[#0A1020]">{selectedRegionEntry?.name}</p>
              <p className="mt-4 text-sm text-[#6B7A99]">Montant final</p>
              <p className="mt-1 text-2xl font-black text-[#1463FF]">
                {selectedPrice !== null ? `${selectedPrice.toFixed(2)}€` : "Choisis une recharge"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedDenomination === null || !playerId.trim()}
              className={`mt-8 w-full rounded-2xl py-4 text-sm font-black transition ${
                selectedDenomination === null || !playerId.trim()
                  ? "cursor-not-allowed bg-[#e7edf7] text-[#aab4c8]"
                  : added
                  ? "bg-green-500 text-white"
                  : "bg-[#1463FF] text-white hover:bg-[#0D4FD6]"
              }`}
            >
              {added ? "✓ Ajoute au panier" : "Ajouter au panier"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/panier")}
              className="mt-4 w-full rounded-2xl border-2 border-[#e7edf7] px-8 py-4 text-sm font-bold text-[#0A1020] hover:border-[#1463FF]/40"
            >
              Voir le panier
            </button>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
