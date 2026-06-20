"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PanierPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasInvalidGameItem = useMemo(
    () => items.some((item) => item.type === "game" && (!item.delivery?.playerId || !item.delivery?.region)),
    [items],
  );

  const handleCheckout = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setCheckoutError("Renseigne ton prenom, ton nom et ton email avant de payer.");
      return;
    }

    if (hasInvalidGameItem) {
      setCheckoutError("Certaines recharges jeux n'ont pas encore de player ID ou de region.");
      return;
    }

    try {
      setLoading(true);
      setCheckoutError("");
      const response = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName,
            lastName,
            email,
          },
          cart: items,
          currency: "EUR",
        }),
      });

      const data = (await response.json()) as { checkoutUrl?: string; error?: string };
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Impossible d'initialiser le paiement.");
      }

      items.forEach((item) => {
        trackProductEvent(item.type, item.productId, "purchase", item.quantity);
      });

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Impossible d'initialiser le paiement.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <Navbar />

      <div className="container-main px-4 pb-24 pt-[120px] sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-[#0A1020] sm:text-3xl">Mon panier</h1>
          <button onClick={() => router.push("/")} className="text-sm font-bold text-[#1463FF] hover:underline">
            ← Continuer mes achats
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[28px] bg-white py-24 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
            <span className="mb-4 text-5xl">🛒</span>
            <p className="mb-2 text-lg font-black text-[#0A1020]">Ton panier est vide</p>
            <p className="mb-8 text-sm text-[#6B7A99]">Ajoute un jeu ou une carte cadeau pour commencer</p>
            <button onClick={() => router.push("/")} className="rounded-2xl bg-[#1463FF] px-8 py-3 text-sm font-bold text-white hover:bg-[#0D4FD6]">
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Articles */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-5 rounded-[22px] bg-white p-5 shadow-[0_8px_30px_rgba(12,32,70,0.07)] ring-1 ring-[#e7edf7]">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#f5f7fb] text-2xl">
                    {item.type === "game" ? "🎮" : "🎁"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#0A1020] truncate">{item.name}</p>
                    <p className="text-sm text-[#6B7A99]">{item.denomination}</p>
                    {item.type === "game" && item.delivery?.playerId && (
                      <p className="mt-1 text-xs text-[#6B7A99]">
                        ID {item.delivery.playerId} · {item.delivery.region}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-bold text-[#1463FF]">{item.price.toFixed(2)}€</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7edf7] text-lg font-bold text-[#6B7A99] hover:border-[#1463FF] hover:text-[#1463FF]"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7edf7] text-lg font-bold text-[#6B7A99] hover:border-[#1463FF] hover:text-[#1463FF]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-[#aab4c8] hover:bg-red-50 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button onClick={clearCart} className="self-start text-xs font-bold text-[#aab4c8] hover:text-red-500">
                Vider le panier
              </button>
            </div>

            {/* Résumé commande */}
            <div className="h-fit rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
              <h2 className="mb-6 text-lg font-black text-[#0A1020]">Résumé</h2>

              <div className="mb-6 space-y-4 border-b border-[#e7edf7] pb-6">
                <label className="block text-sm font-bold text-[#0A1020]">
                  Prenom
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none transition focus:border-[#1463FF]"
                    placeholder="Ton prenom"
                  />
                </label>
                <label className="block text-sm font-bold text-[#0A1020]">
                  Nom
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none transition focus:border-[#1463FF]"
                    placeholder="Ton nom"
                  />
                </label>
                <label className="block text-sm font-bold text-[#0A1020]">
                  Email de suivi
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none transition focus:border-[#1463FF]"
                    placeholder="ton@email.com"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-b border-[#e7edf7] pb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#6B7A99]">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-[#0A1020]">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <span className="font-black text-[#0A1020]">Total</span>
                <span className="text-xl font-black text-[#1463FF]">{totalPrice().toFixed(2)}€</span>
              </div>

              <button onClick={handleCheckout} className="mt-8 w-full rounded-2xl bg-[#1463FF] py-4 text-sm font-black text-white hover:bg-[#0D4FD6]">
                {loading ? "Redirection vers Moneroo..." : "Passer la commande →"}
              </button>
              {checkoutError && <p className="mt-4 text-sm font-bold text-red-600">{checkoutError}</p>}
              <p className="mt-4 text-center text-xs text-[#aab4c8]">Livraison instantanée par e-mail · Paiement sécurisé</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
