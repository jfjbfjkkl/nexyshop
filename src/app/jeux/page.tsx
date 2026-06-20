"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { games } from "@/lib/data";

const merchantGames = [
  {
    slug: "roblox",
    name: "Roblox",
    currency: "Robux",
    banner: "/roblox-banner.png",
    logo: "/roblox-logo.png",
  },
];

const MERCHANT_CONTACT_URL = "https://wa.me/qr/Z5IJSITCHOHFE1";

export default function GamesCatalogPage() {
  const [merchantModalGame, setMerchantModalGame] = useState<(typeof merchantGames)[number] | null>(null);

  return (
    <main className="catalog-page catalog-games-page">
      <SiteNavbar activeView="games" />

      <section className="catalog-hero">
        <span className="catalog-kicker">Catalogue jeux</span>
        <h1>
          Jeux <span className="section-count">: {games.length}</span>
        </h1>
        <p>Retrouve tous les jeux disponibles sur NEXY SHOP dans une vraie page dédiée.</p>
      </section>

      <section className="catalog-shell" aria-label="Tous les jeux disponibles">
        <div className="catalog-grid catalog-game-grid">
          {games.map((game) => (
            <Link
              className="catalog-card catalog-game-card"
              href={`/jeux/${game.slug}`}
              key={game.slug}
              style={{ "--catalog-bg": game.bg } as CSSProperties}
            >
              <span className="catalog-card-media">
                {game.image ? (
                  <Image src={game.image} alt="" fill sizes="(max-width: 899px) 46vw, 22vw" />
                ) : (
                  <span className="catalog-logo-fallback">{game.logo}</span>
                )}
              </span>
              <span className="catalog-card-body">
                <strong>{game.name}</strong>
                <small>{game.currency}</small>
              </span>
            </Link>
          ))}
        </div>

        <p className="merchant-recharge-note catalog-note">
          Recharge disponible directement chez le marchand
          <span aria-hidden="true" className="merchant-recharge-arrow">
            <ArrowIcon />
          </span>
        </p>

        <div className="merchant-game-strip catalog-merchant-strip" aria-label="Jeux disponibles chez le marchand">
          {merchantGames.map((game) => (
            <article className="merchant-game-banner" key={game.slug}>
              <button
                className="merchant-game-link"
                type="button"
                onClick={() => setMerchantModalGame(game)}
                aria-label={`Ouvrir les options marchand pour ${game.name}`}
              >
                <span className="merchant-game-logo">
                  <Image src={game.logo} alt="" fill sizes="64px" />
                </span>
                <span className="merchant-game-art">
                  <Image src={game.banner} alt="" fill sizes="(max-width: 899px) 92vw, 46vw" />
                </span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {merchantModalGame && (
        <MerchantGameModal
          game={merchantModalGame}
          onClose={() => setMerchantModalGame(null)}
        />
      )}

      <Footer />
    </main>
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
          <Link href={`/jeux/${game.slug}`} onClick={onClose}>
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

function ArrowIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}
