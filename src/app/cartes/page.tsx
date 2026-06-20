"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { giftCards } from "@/lib/data";

const giftCardImages: Record<string, string> = {
  "google-play": "/play-store-card.png",
  netflix: "/image copy.png",
  playstation: "/image copy 4.png",
  xbox: "/image copy 3.png",
  spotify: "/image copy 11.png",
  "pubg-mobile-gift": "/image copy 13.png",
};

export default function GiftCardsCatalogPage() {
  return (
    <main className="catalog-page catalog-gift-page">
      <SiteNavbar activeView="cards" />

      <section className="catalog-hero">
        <span className="catalog-kicker">Catalogue cartes</span>
        <h1>
          Cartes cadeaux <span className="section-count">: {giftCards.length}</span>
        </h1>
        <p>Une page dédiée aux cartes cadeaux, prête à évoluer avec son propre design.</p>
      </section>

      <section className="catalog-shell" aria-label="Toutes les cartes cadeaux disponibles">
        <div className="catalog-grid catalog-gift-grid">
          {giftCards.map((card) => {
            const image = card.image ?? giftCardImages[card.slug];

            return (
              <Link
                className="catalog-card catalog-gift-card"
                href={`/cartes/${card.slug}`}
                key={card.slug}
                style={{ "--catalog-bg": card.bg } as CSSProperties}
              >
                <span className="catalog-card-media">
                  {image ? (
                    <Image src={image} alt="" fill sizes="(max-width: 899px) 46vw, 22vw" />
                  ) : (
                    <span className="catalog-logo-fallback">{card.name.slice(0, 2)}</span>
                  )}
                </span>
                <span className="catalog-card-body">
                  <strong>{card.name}</strong>
                  <small>À partir de {Math.min(...card.denominations.map((item) => item.price)).toFixed(2)}€</small>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
