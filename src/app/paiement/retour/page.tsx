"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { StoredOrderRecord } from "@/lib/commerce";

type PaymentStatusResponse = {
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
  order?: StoredOrderRecord | null;
  error?: string;
};

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<PaymentReturnFallback />}>
      <PaymentReturnContent />
    </Suspense>
  );
}

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const paymentStatus = searchParams.get("paymentStatus");
  const [state, setState] = useState<PaymentStatusResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(paymentId));

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadStatus = async () => {
      try {
        const response = await fetch(`/api/orders/${paymentId}`, { cache: "no-store" });
        const data = (await response.json()) as PaymentStatusResponse;
        if (!cancelled) setState(data);
      } catch {
        if (!cancelled) setState({ error: "Impossible de verifier le paiement." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <Navbar />

      <div className="container-main px-4 pb-24 pt-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Retour paiement</p>
          <h1 className="mt-3 text-3xl font-black text-[#0A1020]">Suivi de ta commande</h1>
          <p className="mt-3 text-sm text-[#6B7A99]">
            Moneroo renvoie le client ici apres le paiement. Le serveur reverifie ensuite l'etat avant d'envoyer les commandes a Astral4Gamer.
          </p>

          <div className="mt-8 rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-[#e7edf7]">
            <p className="text-sm text-[#6B7A99]">Statut navigateur</p>
            <p className="mt-1 text-lg font-black text-[#0A1020]">{paymentStatus ?? "en attente"}</p>
            {paymentId && <p className="mt-2 text-xs text-[#6B7A99]">Payment ID: {paymentId}</p>}
          </div>

          {loading && <p className="mt-6 text-sm font-bold text-[#1463FF]">Verification en cours...</p>}

          {!loading && state?.error && (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{state.error}</p>
          )}

          {!loading && state?.payment && (
            <div className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#f8fbff] p-4 ring-1 ring-[#e7edf7]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#aab4c8]">Paiement</p>
                  <p className="mt-2 text-lg font-black text-[#0A1020]">{state.payment.status}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fbff] p-4 ring-1 ring-[#e7edf7]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#aab4c8]">Montant</p>
                  <p className="mt-2 text-lg font-black text-[#0A1020]">{state.payment.amount} {state.payment.currency}</p>
                </div>
                <div className="rounded-2xl bg-[#f8fbff] p-4 ring-1 ring-[#e7edf7]">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#aab4c8]">Commande</p>
                  <p className="mt-2 text-lg font-black text-[#0A1020]">{state.order?.orderId ?? "En attente"}</p>
                </div>
              </div>

              {state.order && (
                <div>
                  <h2 className="text-lg font-black text-[#0A1020]">Livraison Astral4Gamer</h2>
                  <div className="mt-4 space-y-3">
                    {state.order.fulfillment.map((item) => (
                      <div key={item.partnerReference} className="rounded-2xl bg-[#f8fbff] p-4 ring-1 ring-[#e7edf7]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-black text-[#0A1020]">{item.partnerReference}</p>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#1463FF] ring-1 ring-[#e7edf7]">{item.status}</span>
                        </div>
                        {item.error && <p className="mt-2 text-sm text-red-600">{item.error}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-black text-white hover:bg-[#0D4FD6]">
              Retour boutique
            </Link>
            <Link href="/panier" className="rounded-2xl border border-[#e7edf7] px-6 py-3 text-sm font-bold text-[#0A1020] hover:border-[#1463FF]/40">
              Revoir le panier
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function PaymentReturnFallback() {
  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <Navbar />
      <div className="container-main px-4 pb-24 pt-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
          <p className="text-sm font-bold text-[#1463FF]">Chargement du statut de paiement...</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}