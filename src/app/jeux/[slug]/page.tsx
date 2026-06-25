"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { games, getGame } from "@/lib/data";
import { trackProductEvent } from "@/lib/popularity";
import { useCartStore } from "@/lib/store";

const FAVORITES_KEY = "nexyshop-favorite-games";
const RECENTLY_VIEWED_KEY = "nexyshop-recent-games";

type GalleryItem = {
  id: string;
  type: "image" | "gradient";
  image?: string;
  bg?: string;
};

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function resolveCategory(slug: string) {
  if (["free-fire", "pubg-mobile", "fortnite", "blood-strike"].includes(slug)) return "Battle Royale";
  if (["call-of-duty"].includes(slug)) return "FPS";
  if (["mobile-legends", "honor-of-kings", "brawl-stars"].includes(slug)) return "MOBA";
  if (["genshin-impact"].includes(slug)) return "RPG";
  if (["fc-mobile"].includes(slug)) return "Sport";
  return "Action";
}

function resolveBadges(slug: string) {
  const category = resolveCategory(slug);
  const base = category === "FPS" ? ["Action", "FPS"] : ["Action", category];
  return [...base, "Disponible"];
}

function buildGallery(image: string | undefined, bg: string): GalleryItem[] {
  const fallbackA = "linear-gradient(150deg,#10275f 0%,#0b1734 54%,#040812 100%)";
  const fallbackB = "linear-gradient(150deg,#1c8dff 0%,#1250b7 46%,#071832 100%)";

  if (!image) {
    return [
      { id: "g1", type: "gradient", bg },
      { id: "g2", type: "gradient", bg: fallbackA },
      { id: "g3", type: "gradient", bg: fallbackB },
    ];
  }

  return [
    { id: "g1", type: "image", image },
    { id: "g2", type: "gradient", bg },
    { id: "g3", type: "image", image },
    { id: "g4", type: "gradient", bg: fallbackB },
  ];
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const game = getGame(slug);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedDenomination, setSelectedDenomination] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [playerId, setPlayerId] = useState("");
  const [added, setAdded] = useState(false);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!game) return;
    trackProductEvent("game", game.slug, "visit");
  }, [game]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const frame = window.requestAnimationFrame(() => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? "[]");
        if (Array.isArray(parsed)) {
          setFavoriteSlugs(parsed.filter((entry): entry is string => typeof entry === "string"));
        }
      } catch {
        setFavoriteSlugs([]);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!game || typeof window === "undefined") return;

    const frame = window.requestAnimationFrame(() => {
      setGalleryIndex(0);

      let current: string[] = [];
      try {
        const parsed = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]");
        if (Array.isArray(parsed)) {
          current = parsed.filter((entry): entry is string => typeof entry === "string");
        }
      } catch {
        current = [];
      }

      const next = [game.slug, ...current.filter((entry) => entry !== game.slug)].slice(0, 10);
      setRecentSlugs(next);
      window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [game]);

  if (!game) {
    return (
      <main className="min-h-screen bg-[#f5f7fb]">
        <SiteNavbar activeView="games" variant="light" />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-[900px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-black text-[#0A1020]">Jeu introuvable</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold text-[#607399]">
            Le jeu demande n&apos;existe plus ou l&apos;URL est incorrecte.
          </p>
          <button
            type="button"
            onClick={() => router.push("/jeux")}
            className="mt-6 rounded-2xl bg-[#1463FF] px-6 py-3 text-sm font-black text-white transition active:scale-[0.98]"
          >
            Retour au catalogue jeux
          </button>
        </section>
      </main>
    );
  }

  const currentGame = game;
  const selectedRegionEntry = currentGame.regions[selectedRegion];
  const selectedPack = currentGame.denominations[selectedDenomination];
  const selectedPrice = Number((selectedPack.price * selectedRegionEntry.multiplier).toFixed(2));
  const canPurchase = playerId.trim().length > 0;
  const gallery = buildGallery(currentGame.image, currentGame.bg);
  const currentGallery = gallery[galleryIndex] ?? gallery[0];
  const badges = resolveBadges(currentGame.slug);
  const isFavorite = favoriteSlugs.includes(currentGame.slug);
  const similarGames = games
    .filter((entry) => entry.slug !== currentGame.slug && resolveCategory(entry.slug) === resolveCategory(currentGame.slug))
    .concat(games.filter((entry) => entry.slug !== currentGame.slug))
    .filter((entry, index, list) => list.findIndex((candidate) => candidate.slug === entry.slug) === index)
    .slice(0, 3);
  const recentGames = recentSlugs
    .filter((entry) => entry !== currentGame.slug)
    .map((entry) => games.find((candidate) => candidate.slug === entry))
    .filter((entry): entry is (typeof games)[number] => Boolean(entry))
    .concat(games.filter((entry) => entry.slug !== currentGame.slug))
    .filter((entry, index, list) => list.findIndex((candidate) => candidate.slug === entry.slug) === index)
    .slice(0, 3);

  function toggleFavorite() {
    if (typeof window === "undefined") return;

    const next = isFavorite
      ? favoriteSlugs.filter((entry) => entry !== currentGame.slug)
      : [currentGame.slug, ...favoriteSlugs].slice(0, 20);

    setFavoriteSlugs(next);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  }

  function pushSelectedPackToCart(denominationIndex: number) {
    if (!canPurchase) return false;

    const chosenPack = currentGame.denominations[denominationIndex];
    const chosenPrice = Number((chosenPack.price * selectedRegionEntry.multiplier).toFixed(2));

    addItem({
      productId: currentGame.slug,
      name: currentGame.name,
      denomination: chosenPack.label,
      price: chosenPrice,
      type: "game",
      image: currentGame.image,
      art: currentGame.bg,
      delivery: {
        playerId: playerId.trim(),
        region: selectedRegionEntry.id,
      },
    });
    trackProductEvent("game", currentGame.slug, "cart");
    return true;
  }

  function handleAddToCart(denominationIndex = selectedDenomination) {
    setSelectedDenomination(denominationIndex);
    if (!pushSelectedPackToCart(denominationIndex)) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  function handleBuyNow(denominationIndex = selectedDenomination) {
    setSelectedDenomination(denominationIndex);
    if (!pushSelectedPackToCart(denominationIndex)) return;
    router.push("/panier");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f9ff]">
      <SiteNavbar activeView="games" variant="light" />

      <section className="mx-auto grid w-full max-w-[1220px] gap-4 px-4 pb-6 pt-20 sm:gap-6 sm:px-6 sm:pb-8 sm:pt-24 lg:grid-cols-[minmax(0,3fr)_minmax(360px,2fr)] lg:gap-8 lg:px-10 lg:pt-28">
        <div className="min-w-0 space-y-3 sm:space-y-4 [animation:game-detail-rise_.55s_ease_both]">
          <Link
            href="/jeux"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d9e6fb] bg-white px-3.5 py-2 text-[11px] font-black text-[#31598f] shadow-[0_8px_22px_rgba(9,34,88,0.06)] transition hover:-translate-y-0.5 hover:border-[#1463ff]/35 sm:px-4 sm:text-xs"
          >
            <ArrowLeftIcon />
            Catalogue jeux
          </Link>

          <article className="group overflow-hidden rounded-[1.1rem] border border-white bg-white shadow-[0_18px_42px_rgba(8,30,74,0.12)] sm:rounded-[1.35rem] sm:shadow-[0_24px_70px_rgba(8,30,74,0.14)]">
            <div
              className="relative aspect-[16/10] min-h-[200px] overflow-hidden bg-[#071225] sm:min-h-[360px] lg:min-h-[510px]"
              style={currentGallery.type === "gradient" ? { background: currentGallery.bg } : undefined}
            >
              {currentGallery.type === "image" && currentGallery.image && (
                <Image
                  key={currentGallery.id}
                  src={currentGallery.image}
                  alt={`${currentGame.name} visuel principal`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/72 via-[#020817]/18 to-transparent" />
              <div className="absolute inset-x-3 top-3 flex items-start justify-end gap-3 sm:inset-x-4 sm:bottom-4 sm:top-auto sm:items-end sm:justify-between">
                <div className="hidden min-w-0 rounded-2xl border border-white/18 bg-[#061a3f]/60 px-4 py-3 text-white shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur-md sm:block">
                  <span className="text-[11px] font-black uppercase tracking-wide text-white/65">Image officielle</span>
                  <p className="mt-1 truncate text-sm font-black sm:text-base">{currentGame.name}</p>
                </div>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-[1rem] border backdrop-blur-md transition active:scale-95 sm:h-12 sm:w-12 sm:rounded-2xl ${
                    isFavorite
                      ? "border-[#ffcad6] bg-[#fff0f4] text-[#e31953]"
                      : "border-white/18 bg-white/14 text-white hover:bg-white/22"
                  }`}
                >
                  <HeartIcon filled={isFavorite} />
                </button>
              </div>
            </div>
          </article>

          <div className="hidden grid-cols-4 gap-2 sm:grid sm:gap-3">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGalleryIndex(index)}
                className={`group relative aspect-[4/3] overflow-hidden rounded-2xl border bg-white shadow-[0_10px_28px_rgba(9,34,88,0.08)] transition duration-300 active:scale-[0.98] ${
                  galleryIndex === index
                    ? "border-[#1463ff] ring-4 ring-[#1463ff]/14"
                    : "border-[#d8e6ff] hover:-translate-y-0.5 hover:border-[#1463ff]/45"
                }`}
                style={item.type === "gradient" ? { background: item.bg } : undefined}
                aria-label={`Afficher l'image ${index + 1}`}
              >
                {item.type === "image" && item.image && (
                  <Image src={item.image} alt="" fill sizes="160px" className="object-cover transition duration-500 group-hover:scale-110" />
                )}
                <span className={`absolute inset-x-3 bottom-2 h-1 rounded-full transition ${galleryIndex === index ? "bg-[#1463ff]" : "bg-white/65"}`} />
              </button>
            ))}
          </div>
        </div>

        <aside className="min-w-0 space-y-3 sm:space-y-4 [animation:game-detail-rise_.65s_ease_both] lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-[1.1rem] border border-[#d8e6ff] bg-white p-4 shadow-[0_18px_42px_rgba(8,30,74,0.1)] sm:rounded-[1.35rem] sm:p-6 sm:shadow-[0_24px_70px_rgba(8,30,74,0.12)]">
            <div className="flex items-start justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-[#4f76bf] sm:text-xs">Recharge jeu</p>
                <h1 className="mt-1.5 text-[1.7rem] font-black leading-tight text-[#091936] sm:mt-2 sm:text-4xl">{currentGame.name}</h1>
              </div>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#d8e6ff] bg-[#f3f8ff] text-base font-black text-[#1456c8] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
                {currentGame.logo}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full border border-[#d8e6ff] bg-[#f4f8ff] px-2.5 py-1 text-[10px] font-black text-[#1f5eb8] sm:px-3 sm:text-[11px]">
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-black text-[#102042] sm:mt-4 sm:text-sm">
              <span className="text-[#ffb323]" aria-hidden="true">★★★★★</span>
              <span>4.9</span>
              <span className="font-bold text-[#657796]">(256 avis)</span>
            </div>

            <p className="mt-3 text-[13px] font-semibold leading-6 text-[#526783] sm:mt-4 sm:text-sm sm:leading-7">
              {currentGame.description} Livraison claire, paiement securise et traitement rapide pour recevoir tes {currentGame.currency} sans friction.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
              <QuickInfo icon={<DeviceIcon />} label="Plateforme" value="PC / PS / Xbox / Mobile" />
              <QuickInfo icon={<BoltIcon />} label="Livraison" value="Automatique" />
              <QuickInfo icon={<ClockIcon />} label="Delai" value={selectedRegionEntry.deliveryTime} />
              <QuickInfo icon={<StockIcon />} label="Disponibilite" value="En stock" />
            </div>

            <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3">
              <label className="block text-[11px] font-black uppercase tracking-wide text-[#57709f] sm:text-xs">
                Region
                <select
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(Number(event.target.value))}
                  className="mt-1.5 h-11 w-full rounded-[1rem] border border-[#d8e6ff] bg-[#f9fbff] px-3.5 text-[13px] font-bold text-[#102042] outline-none transition focus:border-[#1463ff] sm:mt-2 sm:h-12 sm:rounded-2xl sm:px-4 sm:text-sm"
                >
                  {currentGame.regions.map((region, index) => (
                    <option key={region.id} value={index}>{region.name} - {region.feeLabel}</option>
                  ))}
                </select>
              </label>

              <label className="block text-[11px] font-black uppercase tracking-wide text-[#57709f] sm:text-xs">
                ID joueur
                <input
                  value={playerId}
                  onChange={(event) => setPlayerId(event.target.value)}
                  placeholder="Entre ton player ID"
                  className="mt-1.5 h-11 w-full rounded-[1rem] border border-[#d8e6ff] bg-[#f9fbff] px-3.5 text-[13px] font-bold text-[#102042] outline-none transition focus:border-[#1463ff] sm:mt-2 sm:h-12 sm:rounded-2xl sm:px-4 sm:text-sm"
                />
              </label>
            </div>

            <div className="mt-4 hidden rounded-[1rem] border border-[#d8e6ff] bg-gradient-to-br from-[#f7fbff] to-white p-3.5 sm:mt-5 sm:block sm:rounded-2xl sm:p-4">
              <span className="text-[11px] font-black uppercase tracking-wide text-[#667a98] sm:text-xs">A partir de</span>
              <div className="mt-1 flex flex-wrap items-end justify-between gap-2.5 sm:gap-3">
                <strong className="text-[2rem] font-black leading-none text-[#1463ff] sm:text-4xl">{formatEuro(selectedPrice)}</strong>
                <span className="rounded-full bg-[#eaf3ff] px-2.5 py-1 text-[11px] font-black text-[#185fca] sm:px-3 sm:text-xs">{selectedPack.label}</span>
              </div>
            </div>

            <div className="mt-4 hidden gap-2.5 sm:mt-5 sm:grid sm:gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!canPurchase}
                className={`min-h-12 rounded-[1rem] px-4 text-sm font-black shadow-[0_14px_30px_rgba(20,99,255,0.22)] transition duration-200 active:scale-[0.98] sm:rounded-2xl ${
                  canPurchase
                    ? "bg-[#1463ff] text-white hover:-translate-y-0.5 hover:bg-[#0d54df]"
                    : "cursor-not-allowed bg-[#e8eef8] text-[#9aaccc] shadow-none"
                }`}
              >
                Acheter maintenant
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canPurchase}
                className={`min-h-12 rounded-[1rem] border px-4 text-sm font-black transition duration-200 active:scale-[0.98] sm:rounded-2xl ${
                  !canPurchase
                    ? "cursor-not-allowed border-[#d8e6ff] bg-white text-[#9aaccc]"
                    : added
                    ? "border-[#0ca678] bg-[#0ca678] text-white"
                    : "border-[#1463ff]/28 bg-white text-[#1463ff] hover:-translate-y-0.5 hover:bg-[#eef5ff]"
                }`}
              >
                {added ? "Ajoute au panier" : "Ajouter au panier"}
              </button>
            </div>

            <div className="mt-3 flex min-h-11 items-center gap-2 rounded-[1rem] border border-[#dcf0e8] bg-[#f3fffa] px-3.5 py-2.5 text-[13px] font-black text-[#087254] sm:mt-4 sm:rounded-2xl sm:px-4 sm:py-3 sm:text-sm">
              <ShieldIcon />
              Paiement 100% securise
            </div>
          </section>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-[1220px] px-4 pb-7 sm:px-6 sm:pb-8 lg:px-10">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2.5 sm:mb-4 sm:gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wide text-[#4f76bf] sm:text-xs">Choisir une offre</p>
            <h2 className="mt-1 text-[1.35rem] font-black text-[#102042] sm:text-2xl">Offres disponibles</h2>
          </div>
          <span className="rounded-full border border-[#d8e6ff] bg-white px-2.5 py-1 text-[11px] font-black text-[#5c7192] sm:px-3 sm:text-xs">
            {currentGame.denominations.length} packs
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {currentGame.denominations.map((denomination, index) => {
            const finalPrice = Number((denomination.price * selectedRegionEntry.multiplier).toFixed(2));
            const isSelected = selectedDenomination === index;
            const popular = index === Math.min(2, currentGame.denominations.length - 1);
            const productCode = `${currentGame.slug}-${selectedRegionEntry.id}-${String(index + 1).padStart(2, "0")}`.toUpperCase();

            return (
              <article
                key={denomination.label}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setSelectedDenomination(index)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  setSelectedDenomination(index);
                }}
                className={`group relative overflow-hidden rounded-none border bg-white p-4 text-left shadow-[0_10px_24px_rgba(9,34,88,0.07)] transition duration-300 hover:-translate-y-1 sm:rounded-[1.2rem] sm:p-4 sm:shadow-[0_14px_34px_rgba(9,34,88,0.08)] ${
                  isSelected
                    ? "border-[#1463ff] ring-4 ring-[#1463ff]/12"
                    : "border-[#d8e6ff] hover:border-[#1463ff]/40"
                }`}
              >
                {popular && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-[#1463ff] px-2.5 py-1 text-[10px] font-black text-white shadow-[0_8px_18px_rgba(20,99,255,0.28)] sm:right-3 sm:top-3 sm:px-3 sm:text-[11px]">
                    Populaire
                  </span>
                )}
                <div className="flex items-center gap-3 pr-20 sm:pr-24">
                  <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-none text-base font-black text-white sm:h-16 sm:w-16 sm:rounded-2xl sm:text-lg" style={{ background: currentGame.bg }}>
                    {currentGame.image ? (
                      <Image src={currentGame.image} alt="" fill sizes="80px" className="object-cover opacity-95 transition duration-500 group-hover:scale-110" />
                    ) : (
                      currentGame.logo
                    )}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-black text-[#102042] sm:text-base">{denomination.label}</h3>
                    <p className="mt-1 text-[11px] font-bold text-[#627696] sm:text-xs">{currentGame.currency} pour {currentGame.name}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 border-t border-[#e4eefc] pt-4 sm:mt-4 sm:gap-2.5 sm:pt-3.5">
                  <div className="flex flex-wrap items-end justify-between gap-2.5">
                    <div className="grid gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#7a8daa]">ID produit</span>
                      <strong className="break-all text-[12px] font-black text-[#102042]">{productCode}</strong>
                    </div>
                    <div className="grid gap-1 text-right">
                      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-[#7a8daa]">Prix</span>
                      <strong className="text-[1.6rem] font-black leading-none text-[#1463ff] sm:text-2xl">{formatEuro(finalPrice)}</strong>
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:hidden">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleBuyNow(index);
                      }}
                      disabled={!canPurchase}
                      className={`min-h-12 w-full px-4 text-sm font-black transition duration-200 active:scale-[0.98] ${
                        canPurchase
                          ? "bg-[#1463ff] text-white"
                          : "cursor-not-allowed bg-[#e8eef8] text-[#9aaccc]"
                      }`}
                    >
                      Acheter maintenant
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleAddToCart(index);
                      }}
                      disabled={!canPurchase}
                      className={`min-h-12 w-full border px-4 text-sm font-black transition duration-200 active:scale-[0.98] ${
                        !canPurchase
                          ? "cursor-not-allowed border-[#d8e6ff] bg-white text-[#9aaccc]"
                          : "border-[#1463ff]/28 bg-white text-[#1463ff]"
                      }`}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1220px] gap-4 px-4 pb-8 sm:grid-cols-2 sm:gap-4 sm:px-6 sm:pb-10 lg:grid-cols-3 lg:px-10">
        {[...similarGames, ...recentGames].slice(0, 3).map((entry) => (
          <Link
            key={entry.slug}
            href={`/jeux/${entry.slug}`}
            className="group overflow-hidden rounded-[1rem] border border-[#d8e6ff] bg-white p-3 shadow-[0_8px_22px_rgba(9,34,88,0.06)] transition hover:-translate-y-0.5 hover:border-[#1463ff]/35 sm:rounded-2xl sm:p-3.5 sm:shadow-[0_10px_28px_rgba(9,34,88,0.06)]"
          >
            <div className="relative aspect-[16/8.5] min-h-[98px] overflow-hidden rounded-[0.85rem] bg-[#f3f8ff] sm:min-h-[118px] sm:rounded-[1rem]">
              {entry.image ? (
                <Image
                  src={entry.image}
                  alt={entry.name}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-2xl font-black text-white" style={{ background: entry.bg }}>
                  {entry.logo}
                </div>
              )}
            </div>
            <div className="min-h-[82px] px-1.5 pb-1.5 pt-4 sm:min-h-[92px] sm:px-2 sm:pb-2 sm:pt-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f3f8ff] text-sm font-black text-[#1463ff] shadow-[0_8px_18px_rgba(9,34,88,0.07)] sm:h-11 sm:w-11">
                  {entry.logo}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="truncate text-sm font-black leading-5 text-[#102042] sm:text-[15px]">{entry.name}</p>
                  <p className="mt-1 text-[12px] font-bold leading-5 text-[#607396] sm:text-[13px]">{entry.denominations.length} offres disponibles</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <Footer />
    </main>
  );
}

function QuickInfo({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="min-w-0 rounded-[1rem] border border-[#dce8fa] bg-[#f8fbff] p-2.5 sm:rounded-2xl sm:p-3">
      <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-[0.85rem] bg-white text-[#1463ff] shadow-[0_6px_16px_rgba(9,34,88,0.07)] sm:mb-2 sm:h-8 sm:w-8 sm:rounded-xl">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-wide text-[#6b7e9d] sm:text-[11px]">{label}</p>
      <p className="mt-1 text-[11px] font-black leading-4 text-[#102042] sm:text-xs sm:leading-5">{value}</p>
    </article>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
      <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m20 7-8-4-8 4 8 4 8-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 7v10l8 4 8-4V7M12 11v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
