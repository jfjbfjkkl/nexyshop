"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SiteNavbar from "@/components/SiteNavbar";
import { trackProductEvent, type PopularityProductType } from "@/lib/popularity";

export type HomeGame = {
  slug: string;
  name: string;
  currency: string;
  accent: string;
  art: string;
  image: string;
  denomination: string;
  price: number;
};

export type HomeGiftCard = {
  slug: string;
  name: string;
  tone: string;
  image: string;
  href: string;
  denomination: string;
  price: number;
};

const popularGames: HomeGame[] = [
  {
    slug: "call-of-duty-mobile-garena-sg-my",
    name: "Call of Duty Mobile Garena",
    currency: "CP",
    accent: "#40b8ff",
    art: "url('/image copy 7.png')",
    image: "/image copy 7.png",
    denomination: "80 CP",
    price: 1.49,
  },
  {
    slug: "garena-free-fire-global",
    name: "Garena Free Fire Global",
    currency: "Diamants",
    accent: "#f6a33b",
    art: "linear-gradient(150deg, rgba(39,54,91,.12), rgba(5,12,28,.92)), url('/freefire.png')",
    image: "/freefire.png",
    denomination: "100 Diamants",
    price: 1.99,
  },
  {
    slug: "free-fire-eu",
    name: "Free Fire EU",
    currency: "Diamants",
    accent: "#f2c96e",
    art: "url('/pubg-mobile-card.png')",
    image: "/pubg-mobile-card.png",
    denomination: "100 Diamants",
    price: 1.99,
  },
  {
    slug: "garena-undawn-global",
    name: "Garena Undawn Global",
    currency: "RC",
    accent: "#8ad8ff",
    art: "url('/genshin-impact-card.png')",
    image: "/genshin-impact-card.png",
    denomination: "101 RC",
    price: 1.99,
  },
  {
    slug: "free-fire-br",
    name: "Free Fire BR",
    currency: "Diamants",
    accent: "#25c6ff",
    art: "url('/image copy 9.png')",
    image: "/image copy 9.png",
    denomination: "100 Diamants",
    price: 8.99,
  },
  {
    slug: "garena-delta-force-my",
    name: "Garena Delta Force MY",
    currency: "Delta Coins",
    accent: "#44d26a",
    art: "url('/image copy 10.png')",
    image: "/image copy 10.png",
    denomination: "Produit Astral",
    price: 1.99,
  },
  {
    slug: "garena-undawn-indonesia",
    name: "Garena Undawn Indonesia",
    currency: "RC",
    accent: "#ffcf22",
    art: "url('/image copy 12.png')",
    image: "/image copy 12.png",
    denomination: "101 RC",
    price: 2.99,
  },
  {
    slug: "codm-garena-indonesia",
    name: "CODM Garena Indonesia",
    currency: "CP",
    accent: "#ff4aa3",
    art: "url('/blood-strike-card.png')",
    image: "/blood-strike-card.png",
    denomination: "80 CP",
    price: 1.49,
  },
];

const merchantGames = [
  {
    slug: "roblox",
    name: "Roblox",
    currency: "Robux",
    banner: "/roblox-banner.png",
    logo: "/image copy 15.png",
  },
];

const MERCHANT_CONTACT_URL = "https://wa.me/qr/Z5IJSITCHOHFE1";

const giftCardsHome: HomeGiftCard[] = [
  { slug: "google-play", name: "Play Store", tone: "google", image: "/play-store-card.png", href: "/cartes/google-play", denomination: "5 EUR", price: 5.49 },
  { slug: "playstation", name: "PlayStation", tone: "playstation", image: "/image copy 4.png", href: "/cartes/playstation", denomination: "10 EUR", price: 10.99 },
  { slug: "free-fire-gift", name: "Free Fire", tone: "freefire", image: "/image copy 8.png", href: "#cartes-cadeaux", denomination: "Carte cadeau Free Fire", price: 4.99 },
  { slug: "steam", name: "Steam", tone: "steam", image: "/image copy 5.png", href: "#cartes-cadeaux", denomination: "10 EUR", price: 10.99 },
  { slug: "spotify", name: "Spotify", tone: "spotify", image: "/image copy 11.png", href: "/cartes/spotify", denomination: "10 EUR", price: 10.99 },
  { slug: "pubg-mobile-gift", name: "PUBG Mobile", tone: "pubg", image: "/image copy 13.png", href: "/cartes/pubg-mobile-gift", denomination: "Carte cadeau PUBG", price: 4.99 },
];

export default function HomeClient({ games = popularGames, giftCards = giftCardsHome }: { games?: HomeGame[]; giftCards?: HomeGiftCard[] }) {
  return (
    <main className="nexy-home">
      <ResponsiveHome games={games.length > 0 ? games : popularGames} giftCards={giftCards.length > 0 ? giftCards : giftCardsHome} />
    </main>
  );
}

function ResponsiveHome({ games, giftCards }: { games: HomeGame[]; giftCards: HomeGiftCard[] }) {
  const router = useRouter();
  const popularGames = games;
  const giftCardsHome = giftCards;
  const mobilePopularGames = useMemo(() => [...popularGames].reverse(), [popularGames]);
  const [viewMode, setViewMode] = useState<"all" | "games" | "cards">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [motionKey, setMotionKey] = useState(0);
  const [clickingCard, setClickingCard] = useState<string | null>(null);
  const [merchantModalGame, setMerchantModalGame] = useState<(typeof merchantGames)[number] | null>(null);
  const [isMobileHome, setIsMobileHome] = useState(false);
  const [pendingScrollTarget, setPendingScrollTarget] = useState<"top" | "recharges" | "cartes-cadeaux" | null>(null);
  const giftCardsRef = useRef<HTMLDivElement | null>(null);
  const [giftCardsVisible, setGiftCardsVisible] = useState(false);
  const [visibleGames, setVisibleGames] = useState(() => popularGames.slice(0, 5));
  const [visibleGiftCards, setVisibleGiftCards] = useState(() => giftCardsHome.slice(0, 4));
  const query = searchQuery.trim().toLowerCase();
  const searchGames = popularGames.filter((game) => game.name.toLowerCase().includes(query));
  const searchCards = giftCardsHome.filter((card) => card.name.toLowerCase().includes(query));
  const hasSearch = searchOpen && searchQuery.trim().length > 0;

  useEffect(() => {
    const updatePopularSelections = () => {
      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      setIsMobileHome(isMobile);
      setVisibleGames(
        isMobile
          ? mobilePopularGames.slice(0, 5)
          : popularGames.slice(0, 5),
      );
      setVisibleGiftCards(giftCardsHome.slice(0, 4));
    };

    updatePopularSelections();
    const mediaQuery = window.matchMedia("(max-width: 899px)");
    mediaQuery.addEventListener("change", updatePopularSelections);
    window.addEventListener("storage", updatePopularSelections);
    const interval = window.setInterval(updatePopularSelections, 30 * 60 * 1000);

    return () => {
      mediaQuery.removeEventListener("change", updatePopularSelections);
      window.removeEventListener("storage", updatePopularSelections);
      window.clearInterval(interval);
    };
  }, [giftCardsHome, mobilePopularGames, popularGames]);

  useEffect(() => {
    if (!pendingScrollTarget) return;

    const frame = window.requestAnimationFrame(() => {
      if (pendingScrollTarget === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(pendingScrollTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      setPendingScrollTarget(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingScrollTarget, viewMode, motionKey]);

  useEffect(() => {
    const row = giftCardsRef.current;
    if (!row) return;

    setGiftCardsVisible(false);
    const fallback = window.setTimeout(() => setGiftCardsVisible(true), 700);

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => {
        window.clearTimeout(fallback);
        setGiftCardsVisible(true);
      });
      return () => {
        window.clearTimeout(fallback);
        window.cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        window.clearTimeout(fallback);
        setGiftCardsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(row);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [viewMode, motionKey]);

  const switchHomeView = (mode: "all" | "games" | "cards", targetId?: "recharges" | "cartes-cadeaux") => {
    setSearchOpen(false);
    setViewMode(mode);
    setMotionKey((key) => key + 1);
    setPendingScrollTarget(targetId ?? "top");
  };

  const animateCardNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    key: string,
    tracking?: { type: PopularityProductType; slug: string },
  ) => {
    if (tracking) trackProductEvent(tracking.type, tracking.slug, "visit");

    if (window.matchMedia("(min-width: 900px)").matches) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    setClickingCard(key);
    window.setTimeout(() => {
      router.push(href);
    }, 190);
    window.setTimeout(() => {
      setClickingCard(null);
    }, 280);
  };

  return (
    <section className="nexy-shop-page">
      <div className="desktop-shell">
        <SiteNavbar
          activeView={viewMode}
          onHome={() => switchHomeView("all")}
          onGames={() => switchHomeView("games", "recharges")}
          onCards={() => switchHomeView("cards", "cartes-cadeaux")}
          searchGames={popularGames}
          searchCards={giftCardsHome}
        />

        {viewMode !== "all" && (
          <button
            className="mobile-back-return mobile-home-view-back"
            type="button"
            aria-label="Retourner à l'accueil"
            onClick={() => switchHomeView("all")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6 9 12l6 6" />
            </svg>
          </button>
        )}

        <section className="desktop-hero" id="boutique">
          <div className="desktop-hero-art" aria-hidden="true">
            <div className="hero-card-rotator">
              <span className="hero-rotator-card card-one" />
              <span className="hero-rotator-card card-two" />
              <span className="hero-rotator-card card-three" />
            </div>
          </div>
          <div className="desktop-hero-copy">
            <h1 className="typing-title">
              <span className="hero-brand-main">Nexy</span>
              <span className="hero-brand-sub">Shop</span>
            </h1>
            <p>
              <span className="hero-copy-desktop">Recharge tes jeux favoris et obtiens tes cartes cadeaux instantanement, en toute securite.</span>
              <span className="hero-copy-mobile">Recharger instantanément en toute sécurité.</span>
            </p>
          </div>
        </section>
        <div className="mobile-hero-search desktop-search-wrap">
          <label className="desktop-search">
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Rechercher un jeu ou une carte..."
            />
            <SearchIcon />
          </label>
          {hasSearch && (
            <div className="desktop-search-panel">
              <div className="desktop-search-panel-head">
                <strong>Resultats</strong>
                <span>{searchGames.length + searchCards.length} article(s)</span>
              </div>
              <div className="desktop-search-results">
                {searchGames.map((game) => (
                  <Link className="desktop-search-result" href={`/jeux/${game.slug}`} key={game.slug} onClick={() => setSearchOpen(false)}>
                    <span className="search-thumb image-thumb" style={{ "--art": game.art } as CSSProperties}>
                      {game.image && <Image src={game.image} alt="" fill sizes="44px" className="object-cover" />}
                    </span>
                    <span>
                      <strong>{game.name}</strong>
                      <small>Jeu - {game.currency}</small>
                    </span>
                    <ArrowIcon />
                  </Link>
                ))}
                {searchCards.map((card) => (
                  <Link className="desktop-search-result" href={card.href} key={card.name} onClick={() => setSearchOpen(false)}>
                    <span className="search-thumb image-thumb">
                      <Image src={card.image} alt="" fill className="object-cover" />
                    </span>
                    <span>
                      <strong>{card.name}</strong>
                      <small>Carte cadeau</small>
                    </span>
                    <ArrowIcon />
                  </Link>
                ))}
                {searchGames.length + searchCards.length === 0 && (
                  <p className="desktop-search-empty">Aucun article trouve pour cette recherche.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="hero-blue-line">Pour tout jeu, abonnement ou carte cadeau non trouvé sur le site, veuillez contacter le service client.</div>

        <div className="desktop-grid">
          <div>
            {(viewMode === "all" || viewMode === "games") && (
              <>
            <DesktopSectionHeader
              title={viewMode === "games" ? "Jeux" : "Jeux populaires"}
              count={viewMode === "games" ? popularGames.length : undefined}
              action={viewMode === "all" ? "Voir plus" : undefined}
              onAction={() => switchHomeView("games", "recharges")}
            />
            <div className={`desktop-carousel-row ${viewMode === "games" ? "expanded-list" : ""}`} id="recharges">
              <div className="desktop-game-grid">
                {(viewMode === "games" ? (isMobileHome ? mobilePopularGames : popularGames) : visibleGames).map((game) => (
                  <article
                    className={`desktop-game-card ${clickingCard === `game-${game.slug}` ? "is-clicking" : ""}`}
                    key={`${motionKey}-${game.slug}`}
                    style={{ "--accent": game.accent, "--art": game.art } as CSSProperties}
                  >
                    <Link
                      className="desktop-card-link"
                      href={`/jeux/${game.slug}`}
                      onClick={(event) => animateCardNavigation(event, `/jeux/${game.slug}`, `game-${game.slug}`)}
                    >
                      <div className="desktop-game-art">
                        {game.image ? (
                          <Image src={game.image} alt="" fill sizes="(max-width: 899px) 46vw, 22vw" className="object-cover" />
                        ) : (
                          <GameMark name={game.name} />
                        )}
                      </div>
                      <span className="desktop-game-name">
                        <strong>{game.name}</strong>
                        <span className="desktop-card-arrow" aria-label={`Voir ${game.name}`}>
                          Entrer
                        </span>
                      </span>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
            {viewMode === "games" && (
              <>
                <p className="merchant-recharge-note">
                  Recharge disponible directement chez le marchand
                  <span aria-hidden="true" className="merchant-recharge-arrow">
                    <ArrowIcon />
                  </span>
                </p>
                <div className="merchant-game-strip" aria-label="Jeux disponibles chez le marchand">
                  {merchantGames.map((game) => (
                    <MerchantGameBanner
                      game={game}
                      key={game.slug}
                      onOpen={() => setMerchantModalGame(game)}
                    />
                  ))}
                </div>
              </>
            )}
              </>
            )}

            {viewMode === "all" && <MobileGiftShowcase />}
            {viewMode === "all" && <div className="desktop-section-divider" aria-hidden="true" />}

            {(viewMode === "all" || viewMode === "cards") && (
              <>
            <DesktopSectionHeader
              title="Cartes cadeaux"
              count={viewMode === "cards" ? giftCardsHome.length : undefined}
              action={viewMode === "all" ? "Voir plus" : undefined}
              onAction={() => switchHomeView("cards", "cartes-cadeaux")}
            />
            <div ref={giftCardsRef} className={`desktop-carousel-row gift-carousel-row ${viewMode === "cards" ? "expanded-list" : ""} ${giftCardsVisible ? "is-gift-visible" : ""}`} id="cartes-cadeaux">
              <div className="gift-grid">
                {(viewMode === "cards" ? giftCardsHome : visibleGiftCards).map((card) => (
                  <GiftCard
                    key={`${motionKey}-${card.name}`}
                    name={card.name}
                    slug={card.slug}
                    tone={card.tone}
                    image={card.image}
                    href={card.href}
                    clicking={clickingCard === `gift-${card.name}`}
                    onNavigate={animateCardNavigation}
                  />
                ))}
              </div>
            </div>
              </>
            )}

            {viewMode === "all" && <AfterGiftSection />}
            {viewMode !== "all" && <div className="filtered-bottom-space" aria-hidden="true" />}
          </div>
        </div>

        <footer className="site-footer">
          <div className="footer-intro">
            <a className="brand-lockup footer-brand" href="#" aria-label="Nexy Shop">
              <span>
                <strong>Nexy <b>Shop</b></strong>
                <small>Recharges jeux & cartes cadeaux</small>
              </span>
            </a>
            <p>Livraison rapide, paiement securise et support disponible quand tu en as besoin.</p>
            <p className="site-copyright">© 2026 NEXY SHOP - Tous droits réservés</p>
          </div>

          <div className="footer-panel footer-service-panel">
            <div className="footer-panel-head">
              <span><HeadsetIcon /></span>
              <strong>Info service client</strong>
            </div>
            <p>Le service client est gere par un assistant humain, disponible de 10h a 18h.</p>
            <a className="footer-contact-link" href="tel:+22898309566">
              <PhoneIcon />
              <span>+228 98309566</span>
            </a>
          </div>

          <div className="footer-panel footer-legal-panel">
            <div className="footer-panel-head">
              <span><LockShieldIcon /></span>
              <strong>Légal</strong>
            </div>
            <nav className="footer-legal-links" aria-label="Liens legaux">
              <a href="#">Mention légale</a>
              <a href="#">Confidentialité</a>
              <a href="#">Politique de remboursement</a>
              <a href="#">Cookie</a>
              <a className="footer-help-link" href="/faq">Aide</a>
            </nav>
          </div>
        </footer>

      </div>
      {merchantModalGame && (
        <MerchantGameModal
          game={merchantModalGame}
          onClose={() => setMerchantModalGame(null)}
        />
      )}
    </section>
  );
}

function DesktopSectionHeader({ title, count, action, onAction }: { title: string; count?: number; action?: string; onAction?: () => void }) {
  return (
    <div className="section-head desktop-section-head">
      <h2>
        {title}
        {typeof count === "number" && (
          <span className="section-count"> : {count}</span>
        )}
      </h2>
      {action && (
        <button type="button" onClick={onAction}>
          {action} <ArrowIcon />
        </button>
      )}
    </div>
  );
}

function MobileGiftShowcase() {
  return (
    <div className="mobile-gift-showcase" aria-hidden="true">
      <span className="mobile-gift-slide secure-payment" />
      <span className="mobile-gift-slide fast-recharge" />
      <span className="mobile-gift-slide support-client" />
    </div>
  );
}

function AfterGiftSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setStepsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStepsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.34, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="support" className={`after-gift-section ${stepsVisible ? "is-visible" : ""}`}>
      <div className="after-gift-main">
        <span className="after-gift-kicker">Experience Nexy Shop</span>
        <h3>Recharge simple, livraison rapide et support disponible.</h3>
        <p>Choisis ton jeu ou ta carte cadeau, valide ta commande et recois ton achat rapidement avec un suivi clair.</p>
        <div className="after-gift-actions">
        </div>
      </div>
      <div className="after-gift-steps" aria-label="Avantages Nexy Shop">
        <article>
          <div><BoltIcon /></div>
          <strong>Livraison rapide</strong>
          <small>Recharge instantanee</small>
        </article>
        <article>
          <div><LockShieldIcon /></div>
          <strong>Paiement securise</strong>
          <small>Transactions protegees</small>
        </article>
        <article>
          <div><HeadsetIcon /></div>
          <strong>Support 24/7</strong>
          <small>Nous sommes la pour vous</small>
        </article>
      </div>
    </section>
  );
}

function GiftCard({
  name,
  slug,
  tone,
  image,
  href,
  clicking,
  onNavigate,
}: {
  name: string;
  slug: string;
  tone: string;
  image?: string;
  href: string;
  clicking: boolean;
  onNavigate: (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    key: string,
    tracking?: { type: PopularityProductType; slug: string },
  ) => void;
}) {
  return (
    <article className={`gift-card ${tone} ${clicking ? "is-clicking" : ""}`} style={image ? { background: "none", position: "relative" } : {}}>
      <Link
        className="gift-card-link"
        href={href}
        onClick={(event) => onNavigate(event, href, `gift-${name}`, { type: "giftcard", slug })}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 899px) 48vw, 24vw"
            className="gift-card-image object-cover"
            style={{ zIndex: 0 }}
          />
        ) : (
          <div><GiftLogo tone={tone} /></div>
        )}
      </Link>
    </article>
  );
}

function MerchantGameBanner({
  game,
  onOpen,
}: {
  game: (typeof merchantGames)[number];
  onOpen: () => void;
}) {
  return (
    <article className="merchant-game-banner">
      <button
        className="merchant-game-link"
        type="button"
        onClick={onOpen}
        aria-label={`Ouvrir les options marchand pour ${game.name}`}
      >
        <span className="merchant-game-logo">
          <Image src={game.logo} alt="" fill sizes="64px" />
        </span>
        <span className="merchant-game-art">
          <Image src={game.banner} alt="" fill sizes="(max-width: 899px) 92vw, 46vw" priority={false} />
        </span>
      </button>
    </article>
  );
}

function MerchantGameModal({
  game,
  onClose,
}: {
  game: (typeof merchantGames)[number];
  onClose: () => void;
}) {
  return (
    <div className="merchant-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="merchant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="merchant-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="merchant-modal-close" type="button" aria-label="Fermer" onClick={onClose}>
          <CloseIcon />
        </button>
        <span className="merchant-modal-logo">
          <Image src={game.logo} alt="" fill sizes="72px" />
        </span>
        <h3 id="merchant-modal-title">{game.name}</h3>
        <p>Les recharges dans ce jeu se font manuellement chez un marchand NEXY.</p>
        <div className="merchant-modal-actions">
          <Link
            href={`/jeux/${game.slug}`}
            onClick={() => {
              trackProductEvent("game", game.slug, "visit");
              onClose();
            }}
          >
            Voir les prix
          </Link>
          <a href={MERCHANT_CONTACT_URL} target="_blank" rel="noopener noreferrer">
            Contacter le marchand
          </a>
        </div>
      </section>
    </div>
  );
}

function GameMark({ name, compact = false }: { name: string; compact?: boolean }) {
  if (name.includes("Call")) return <span className={`game-mark cod ${compact ? "compact" : ""}`}>COD</span>;
  if (name.includes("Mobile")) return <span className={`game-mark ml ${compact ? "compact" : ""}`}>M</span>;
  if (name.includes("Free")) return <span className={`game-mark ff ${compact ? "compact" : ""}`}>FREE FIRE</span>;
  if (name.includes("PUBG")) return <span className={`game-mark pubg ${compact ? "compact" : ""}`}>PUBG</span>;
  if (name.includes("Genshin")) return <span className={`game-mark gi ${compact ? "compact" : ""}`}>GENSHIN</span>;
  if (name.includes("Fortnite")) return <span className={`game-mark fortnite ${compact ? "compact" : ""}`}>FORTNITE</span>;
  if (name.includes("FC Mobile")) return <span className={`game-mark fc-mobile ${compact ? "compact" : ""}`}>FC MOBILE</span>;
  if (name.includes("Brawl")) return <span className={`game-mark brawl-stars ${compact ? "compact" : ""}`}>BRAWL</span>;
  if (name.includes("Blood")) return <span className={`game-mark bs ${compact ? "compact" : ""}`}>BLOOD</span>;
  return <span className={`game-mark so ${compact ? "compact" : ""}`}>S2</span>;
}

function GiftLogo({ tone }: { tone: string }) {
  if (tone === "playstation") return <span className="simple-logo">PS</span>;
  if (tone === "roblox") return <span className="simple-logo roblox-logo">R</span>;
  return <span className="simple-logo steam">S</span>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function BoltIcon() {
  return <svg viewBox="0 0 24 24"><path d="M13 2 4 14h8l-1 8 9-12h-8l1-8Z" /></svg>;
}

function LockShieldIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12h6v5H9zM10 12V9a2 2 0 0 1 4 0v3" /></svg>;
}

function HeadsetIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4ZM16 20c0 1-2 2-4 2" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8.05 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.9Z" /></svg>;
}
