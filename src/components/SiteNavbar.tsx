"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import CartDrawer from "@/components/CartDrawer";
import { games, giftCards } from "@/lib/data";
import { useCartStore } from "@/lib/store";

export type NavbarView = "all" | "games" | "cards";

type NavSearchGame = {
  slug: string;
  name: string;
  currency: string;
  art?: string;
  image?: string;
};

type NavSearchCard = {
  name: string;
  href: string;
  image?: string;
  art?: string;
};

type SiteNavbarProps = {
  activeView?: NavbarView;
  variant?: "default" | "light";
  onHome?: () => void;
  onGames?: () => void;
  onCards?: () => void;
  searchGames?: NavSearchGame[];
  searchCards?: NavSearchCard[];
};

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029Vb5yueU60eBmk8siDu03";
const WHATSAPP_SERVICE_URL = "https://wa.me/qr/Z5IJSITCHOHFE1";

export default function SiteNavbar({ activeView = "all", variant = "default", onHome, onGames, onCards, searchGames, searchCards }: SiteNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);

  const navGames: NavSearchGame[] =
    searchGames ??
    games.map((game) => ({
      slug: game.slug,
      name: game.name,
      currency: game.currency,
      image: game.image,
      art: game.image ? `url('${game.image}')` : game.bg,
    }));

  const navCards: NavSearchCard[] =
    searchCards ??
    giftCards.map((card) => ({
      name: card.name,
      href: `/cartes/${card.slug}`,
      art: card.bg,
    }));

  const query = searchQuery.trim().toLowerCase();
  const filteredGames = navGames.filter((game) => game.name.toLowerCase().includes(query));
  const filteredCards = navCards.filter((card) => card.name.toLowerCase().includes(query));
  const hasSearch = searchOpen && query.length > 0;
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const closePanels = () => {
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const goHome = () => {
    closePanels();
    if (onHome) {
      onHome();
      return;
    }
    window.location.href = "/";
  };

  const goGames = () => {
    closePanels();
    if (onGames) {
      onGames();
      return;
    }
    window.location.href = "/#recharges";
  };

  const goCards = () => {
    closePanels();
    if (onCards) {
      onCards();
      return;
    }
    window.location.href = "/#cartes-cadeaux";
  };

  const goChannel = () => {
    closePanels();
    window.open(WHATSAPP_CHANNEL_URL, "_blank", "noopener,noreferrer");
  };

  const goService = () => {
    closePanels();
    window.open(WHATSAPP_SERVICE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <header className="mobile-transparent-nav" aria-label="Navigation mobile">
        <button
          className="mobile-menu-trigger"
          type="button"
          aria-label="Ouvrir le menu"
          aria-controls="mobile-main-menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setSearchOpen(false);
            setMenuOpen(true);
          }}
        >
          <MenuIcon />
          <span>Menu</span>
        </button>
        <div className="mobile-transparent-actions" aria-label="Actions rapides">
          <button type="button" aria-label="Notifications">
            <BellIcon />
          </button>
          <button type="button" aria-label="Panier" onClick={() => setCartOpen(true)}>
            <CartIcon />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <Link href="/compte" aria-label="Compte">
            <UserIcon />
          </Link>
        </div>
      </header>

      <button
        className={`mobile-menu-backdrop-large ${menuOpen ? "is-open" : ""}`}
        type="button"
        aria-label="Fermer le menu"
        onClick={() => setMenuOpen(false)}
      />

      <aside id="mobile-main-menu" className={`mobile-main-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-brand-card">
          <span className="mobile-menu-logo-frame">
            <Image src="/image copy 15.png" alt="" fill sizes="48px" />
          </span>
          <span>
            <strong>NEXY SHOP</strong>
            <small>Recharges, cartes cadeaux et support</small>
          </span>
          <button type="button" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <nav className="mobile-main-menu-list" aria-label="Menu principal">
          <button type="button" onClick={goGames}>
            <span><GamepadIcon /></span>
            <strong>Jeux</strong>
          </button>
          <button type="button" onClick={goCards}>
            <span><GiftLargeIcon /></span>
            <strong>Carte cadeau</strong>
          </button>
          <hr />
          <button type="button" onClick={closePanels}>
            <span><TagIcon /></span>
            <strong>Promotion</strong>
          </button>
          <button type="button" onClick={closePanels}>
            <span><CrownIcon /></span>
            <strong>Abonnement</strong>
          </button>
          <hr />
          <button type="button" onClick={goChannel}>
            <span><UsersIcon /></span>
            <strong>Communauté</strong>
          </button>
          <button type="button" onClick={goService}>
            <span><HeadsetIcon /></span>
            <strong>Service client</strong>
          </button>
          <hr />
          <Link className="mobile-main-login" href="/compte" onClick={closePanels}>
            <UserIcon />
            <strong>Connexion</strong>
          </Link>
        </nav>
      </aside>

      <header className={`desktop-nav ${variant === "light" ? "desktop-nav-light" : ""}`}>
        <Link className="brand-lockup desktop-brand" href="/" aria-label="Nexy Shop">
          <span className="desktop-brand-text">
            <span>NEXY</span>
            <small>SHOP</small>
          </span>
        </Link>
        <nav>
          <button className={activeView === "all" ? "active" : ""} type="button" onClick={goHome}>Accueil</button>
          <button className={activeView === "games" ? "active" : ""} type="button" onClick={goGames}>Jeux</button>
          <button className={activeView === "cards" ? "active" : ""} type="button" onClick={goCards}>Cartes cadeaux</button>
          <button type="button" onClick={goChannel}>Chaîne</button>
        </nav>
        <div className="desktop-search-wrap">
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
              placeholder="Rechercher un jeu, une carte ou un produit..."
            />
          </label>
          {hasSearch && (
            <div className="desktop-search-panel">
              <div className="desktop-search-panel-head">
                <strong>Résultats</strong>
                <span>{filteredGames.length + filteredCards.length} article(s)</span>
              </div>
              <div className="desktop-search-results">
                {filteredGames.map((game) => (
                  <Link className="desktop-search-result" href={`/jeux/${game.slug}`} key={game.slug} onClick={() => setSearchOpen(false)}>
                    <span className="search-thumb" style={{ "--art": game.art ?? (game.image ? `url('${game.image}')` : "#eef4ff") } as CSSProperties} />
                    <span>
                      <strong>{game.name}</strong>
                      <small>Jeu - {game.currency}</small>
                    </span>
                    <ArrowIcon />
                  </Link>
                ))}
                {filteredCards.map((card) => (
                  <Link className="desktop-search-result" href={card.href} key={card.name} onClick={() => setSearchOpen(false)}>
                    {card.image ? (
                      <span className="search-thumb image-thumb">
                        <Image src={card.image} alt="" fill sizes="54px" className="object-cover" />
                      </span>
                    ) : (
                      <span className="search-thumb" style={{ "--art": card.art ?? "#eef4ff" } as CSSProperties} />
                    )}
                    <span>
                      <strong>{card.name}</strong>
                      <small>Carte cadeau</small>
                    </span>
                    <ArrowIcon />
                  </Link>
                ))}
                {filteredGames.length + filteredCards.length === 0 && (
                  <p className="desktop-search-empty">Aucun article trouvé pour cette recherche.</p>
                )}
              </div>
            </div>
          )}
        </div>
        <button className="desktop-icon-button" type="button" aria-label="Ouvrir le panier" onClick={() => setCartOpen(true)}>
          <CartIcon />
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>
        <Link className="desktop-icon-button" href="/compte" aria-label="Compte"><UserIcon /></Link>
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onExploreGames={goGames} />
    </>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function CartIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6h15l-2 8H8L6 3H3" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></svg>;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 3.5a8.37 8.37 0 0 0-7.1 12.8L4 20.5l4.3-1.12A8.38 8.38 0 1 0 12.04 3.5Z" />
      <path d="M9.16 8.14c-.18-.4-.37-.41-.54-.42h-.46c-.16 0-.42.06-.64.31-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.68 4.16 3.65 2.06.8 2.48.64 2.93.6.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28l-1.62-.8c-.24-.12-.42-.18-.6.18-.18.36-.69.88-.84 1.06-.15.18-.31.2-.55.08-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.38.1-.5.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42l-.68-1.92Z" />
    </svg>
  );
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}

function TagIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12V6.5A1.5 1.5 0 0 1 6.5 5H12l7 7-7 7H6.5A1.5 1.5 0 0 1 5 17.5V12Z" /><path d="M9 9.5h.01M10 15l5-5M14.5 15h.01" /></svg>;
}

function CrownIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4.5 8.5 8 12l4-6 4 6 3.5-3.5V18H4.5V8.5Z" /><path d="M7 21h10M9 15h6" /></svg>;
}

function UsersIcon() {
  return <svg viewBox="0 0 24 24"><path d="M16 21a4 4 0 0 0-8 0" /><circle cx="12" cy="8" r="3.5" /><path d="M20 19a3.2 3.2 0 0 0-3.2-3.2M4 19a3.2 3.2 0 0 1 3.2-3.2" /><path d="M17.5 9.5a2.5 2.5 0 0 1 0 4M6.5 9.5a2.5 2.5 0 0 0 0 4" /></svg>;
}

function LinkIcon() {
  return <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" /><path d="M14 11a5 5 0 0 0-7.07 0l-2 2A5 5 0 0 0 12 20.07l1.15-1.15" /></svg>;
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 10.8 12 4l8 6.8" />
      <path d="M6.5 10.5V20h11v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function GamepadIcon() {
  return <svg viewBox="0 0 24 24"><path d="M7 15h-.5a3.5 3.5 0 0 1 0-7h11a3.5 3.5 0 0 1 0 7H17l-2-2H9l-2 2Z" /><path d="M8 10v3M6.5 11.5h3M16 10.8h.01M18 12.5h.01" /></svg>;
}

function GiftLargeIcon() {
  return <svg viewBox="0 0 48 48"><path d="M8 20h32v21H8z" /><path d="M24 20v21M6 20h36M15 11c6 0 9 9 9 9s-13 1-13-5c0-2 2-4 4-4Zm18 0c-6 0-9 9-9 9s13 1 13-5c0-2-2-4-4-4Z" /></svg>;
}

function BellIcon() {
  return <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
}

function HeadsetIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4ZM16 20c0 1-2 2-4 2" /></svg>;
}

function UserIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>;
}
