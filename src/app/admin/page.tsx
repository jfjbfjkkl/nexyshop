"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type AdminSessionState = {
  authenticated: boolean;
};

type AdminOverview = {
  appUrlConfigured: boolean;
  adminTokenConfigured: boolean;
  adminSessionSecretConfigured: boolean;
  astralApiConfigured: boolean;
  monerooConfigured: boolean;
  remoteStoreConfigured: boolean;
  astralMappingCount: number;
  balance: unknown;
  balanceError: string | null;
};

type PaymentLookupResponse = {
  payment?: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  };
  order?: {
    orderId: string;
    paymentId: string;
    paymentStatus: string;
    amount: number;
    currency: string;
    fulfillment: Array<{
      partnerReference: string;
      providerProductId: number;
      status: string;
      error?: string;
    }>;
  } | null;
  error?: string;
};

type AstralOrderLookup = Record<string, unknown>;

function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminSessionState | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [products, setProducts] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [paymentLookup, setPaymentLookup] = useState<PaymentLookupResponse | null>(null);
  const [paymentLookupLoading, setPaymentLookupLoading] = useState(false);
  const [astralQuery, setAstralQuery] = useState("");
  const [astralLookup, setAstralLookup] = useState<AstralOrderLookup | null>(null);
  const [astralLookupLoading, setAstralLookupLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data = (await response.json()) as AdminSessionState;
        setSession(data);
      } catch {
        setSession({ authenticated: false });
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!session?.authenticated) return;

    let cancelled = false;

    const loadAdminData = async () => {
      try {
        const [overviewResponse, productsResponse] = await Promise.all([
          fetch("/api/admin/overview", { cache: "no-store" }),
          fetch("/api/astral/products", { cache: "no-store" }),
        ]);

        const overviewData = (await overviewResponse.json()) as AdminOverview & { error?: string };
        const productsData = await productsResponse.json();

        if (cancelled) return;

        if (!overviewResponse.ok) {
          setError(overviewData.error ?? "Impossible de charger le tableau de bord admin.");
          return;
        }

        setOverview(overviewData);
        setProducts(productsData);
      } catch {
        if (!cancelled) setError("Impossible de charger les donnees admin.");
      }
    };

    loadAdminData();

    return () => {
      cancelled = true;
    };
  }, [session]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = (await response.json()) as { authenticated?: boolean; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Connexion admin invalide.");
      }

      setSession({ authenticated: true });
      setToken("");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Connexion admin invalide.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setSession({ authenticated: false });
    setOverview(null);
    setProducts(null);
    setPaymentLookup(null);
    setAstralLookup(null);
  }

  async function handlePaymentLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!paymentId.trim()) return;

    setPaymentLookupLoading(true);
    setPaymentLookup(null);
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(paymentId.trim())}`, { cache: "no-store" });
      const data = (await response.json()) as PaymentLookupResponse;
      setPaymentLookup(data);
    } catch {
      setPaymentLookup({ error: "Recherche paiement impossible." });
    } finally {
      setPaymentLookupLoading(false);
    }
  }

  async function handleAstralLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = astralQuery.trim();
    if (!query) return;

    setAstralLookupLoading(true);
    setAstralLookup(null);
    try {
      const response = await fetch(`/api/astral/orders?partner_reference=${encodeURIComponent(query)}`, {
        cache: "no-store",
      });
      const data = (await response.json()) as AstralOrderLookup;
      setAstralLookup(data);
    } catch {
      setAstralLookup({ error: "Recherche Astral4Gamer impossible." });
    } finally {
      setAstralLookupLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f6fb]">
      <Navbar />

      <div className="container-main px-4 pb-24 pt-[120px] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(20,99,255,0.22),_transparent_38%),linear-gradient(135deg,#08152b,#0e274d_55%,#08111f)] px-8 py-10 text-white shadow-[0_30px_90px_rgba(8,18,38,0.34)]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/65">NEXY SHOP Admin</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-black sm:text-4xl">Pilotage paiements, commandes reseller et etat d'integration.</h1>
                <p className="mt-3 text-sm text-white/72 sm:text-base">
                  Cette page centralise l'etat Moneroo, Astral4Gamer et la configuration de deploiement sans exposer les cles secrete au frontend.
                </p>
              </div>
              {session?.authenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur hover:bg-white/16"
                >
                  Deconnexion admin
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
              <p className="text-sm font-bold text-[#1463FF]">Chargement de la session admin...</p>
            </div>
          ) : !session?.authenticated ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Connexion securisee</p>
                <h2 className="mt-3 text-2xl font-black text-[#0A1020]">Ouvrir l'espace admin</h2>
                <p className="mt-3 text-sm text-[#6B7A99]">
                  Le token est envoye une seule fois au serveur. Ensuite, l'acces se fait par cookie HTTP-only signe.
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-4">
                  <label className="block text-sm font-bold text-[#0A1020]">
                    Token admin
                    <input
                      type="password"
                      value={token}
                      onChange={(event) => setToken(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none transition focus:border-[#1463FF]"
                      placeholder="Entre le token configure sur l'hebergeur"
                      autoComplete="current-password"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full rounded-2xl bg-[#1463FF] py-4 text-sm font-black text-white transition hover:bg-[#0D4FD6] disabled:cursor-not-allowed disabled:bg-[#aab4c8]"
                  >
                    {authLoading ? "Connexion en cours..." : "Se connecter"}
                  </button>
                </form>

                {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
              </section>

              <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Ce que tu controles ici</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    "Verifier le solde Astral4Gamer",
                    "Controler le mapping produit avant mise en vente",
                    "Consulter un paiement Moneroo par paymentId",
                    "Consulter une commande reseller par partner_reference",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-[#e7edf7]">
                      <p className="text-sm font-bold text-[#0A1020]">{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatusCard label="APP_URL" value={overview?.appUrlConfigured ? "Configure" : "Manquant"} tone={overview?.appUrlConfigured ? "good" : "bad"} />
                <StatusCard label="Astral API" value={overview?.astralApiConfigured ? "Connecte" : "Manquant"} tone={overview?.astralApiConfigured ? "good" : "bad"} />
                <StatusCard label="Moneroo" value={overview?.monerooConfigured ? "Connecte" : "Manquant"} tone={overview?.monerooConfigured ? "good" : "bad"} />
                <StatusCard label="Store distant" value={overview?.remoteStoreConfigured ? "Actif" : "Non configure"} tone={overview?.remoteStoreConfigured ? "good" : "warn"} />
              </section>

              <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Etat integration</p>
                      <h2 className="mt-3 text-2xl font-black text-[#0A1020]">Controle de configuration</h2>
                    </div>
                    <span className="rounded-full bg-[#EBF1FF] px-3 py-1 text-xs font-black text-[#1463FF]">
                      {overview?.astralMappingCount ?? 0} mappings
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <ChecklistRow label="Token admin" ok={overview?.adminTokenConfigured ?? false} />
                    <ChecklistRow label="Secret session admin" ok={overview?.adminSessionSecretConfigured ?? false} />
                    <ChecklistRow label="API Astral4Gamer" ok={overview?.astralApiConfigured ?? false} />
                    <ChecklistRow label="API Moneroo" ok={overview?.monerooConfigured ?? false} />
                    <ChecklistRow label="Persistance distante" ok={overview?.remoteStoreConfigured ?? false} />
                  </div>

                  <div className="mt-8 rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-[#e7edf7]">
                    <p className="text-sm text-[#6B7A99]">Solde Astral4Gamer</p>
                    {overview?.balanceError ? (
                      <p className="mt-2 text-sm font-bold text-red-600">{overview.balanceError}</p>
                    ) : (
                      <pre className="mt-3 overflow-x-auto text-xs text-[#0A1020]">{prettyJson(overview?.balance)}</pre>
                    )}
                  </div>
                </section>

                <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Catalogue fournisseur</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl font-black text-[#0A1020]">Produits Astral4Gamer</h2>
                    <span className="rounded-full bg-[#EBF1FF] px-3 py-1 text-xs font-black text-[#1463FF]">Source live sandbox ou prod</span>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#08152b] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <pre className="max-h-[420px] overflow-auto text-xs leading-6 text-white/82">{prettyJson(products)}</pre>
                  </div>
                </section>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Paiement Moneroo</p>
                  <h2 className="mt-3 text-2xl font-black text-[#0A1020]">Recherche par paymentId</h2>

                  <form onSubmit={handlePaymentLookup} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={paymentId}
                      onChange={(event) => setPaymentId(event.target.value)}
                      className="min-w-0 flex-1 rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none transition focus:border-[#1463FF]"
                      placeholder="Ex: PAY_xxx"
                    />
                    <button type="submit" className="rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-black text-white hover:bg-[#0D4FD6]">
                      {paymentLookupLoading ? "Recherche..." : "Verifier"}
                    </button>
                  </form>

                  <div className="mt-6 rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-[#e7edf7]">
                    <pre className="max-h-[320px] overflow-auto text-xs leading-6 text-[#0A1020]">{prettyJson(paymentLookup)}</pre>
                  </div>
                </section>

                <section className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#1463FF]">Commande Astral4Gamer</p>
                  <h2 className="mt-3 text-2xl font-black text-[#0A1020]">Recherche par partner_reference</h2>

                  <form onSubmit={handleAstralLookup} className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <input
                      value={astralQuery}
                      onChange={(event) => setAstralQuery(event.target.value)}
                      className="min-w-0 flex-1 rounded-2xl border border-[#e7edf7] bg-[#f8fbff] px-4 py-3 text-sm text-[#0A1020] outline-none transition focus:border-[#1463FF]"
                      placeholder="Ex: nxy_order_1"
                    />
                    <button type="submit" className="rounded-2xl bg-[#0A1020] px-6 py-3 text-sm font-black text-white hover:bg-[#162643]">
                      {astralLookupLoading ? "Recherche..." : "Consulter"}
                    </button>
                  </form>

                  <div className="mt-6 rounded-2xl bg-[#f8fbff] p-5 ring-1 ring-[#e7edf7]">
                    <pre className="max-h-[320px] overflow-auto text-xs leading-6 text-[#0A1020]">{prettyJson(astralLookup)}</pre>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function StatusCard({ label, value, tone }: { label: string; value: string; tone: "good" | "warn" | "bad" }) {
  const tones = {
    good: "bg-[#e8fff3] text-[#0f7b4b] ring-[#b8ebd0]",
    warn: "bg-[#fff8e7] text-[#9a6610] ring-[#f5d99b]",
    bad: "bg-[#fff0f0] text-[#c63535] ring-[#f0c0c0]",
  };

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-[0_14px_40px_rgba(12,32,70,0.08)] ring-1 ring-[#e7edf7]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#aab4c8]">{label}</p>
      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${tones[tone]}`}>{value}</span>
    </div>
  );
}

function ChecklistRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f8fbff] px-4 py-3 ring-1 ring-[#e7edf7]">
      <span className="text-sm font-bold text-[#0A1020]">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${ok ? "bg-[#e8fff3] text-[#0f7b4b]" : "bg-[#fff0f0] text-[#c63535]"}`}>
        {ok ? "OK" : "A configurer"}
      </span>
    </div>
  );
}