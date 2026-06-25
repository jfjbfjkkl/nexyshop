import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { getAstralProductsByType } from "@/lib/astral-catalog";

export const dynamic = "force-dynamic";

export default async function GiftCardsCatalogPage() {
  const giftCards = await getAstralProductsByType("giftcard");

  return (
    <main className="catalog-page catalog-gift-page">
      <SiteNavbar activeView="cards" />

      <section className="catalog-hero">
        <span className="catalog-kicker">Catalogue cartes</span>
        <h1>
          Cartes cadeaux <span className="section-count">: {giftCards.length}</span>
        </h1>
        <p>Tous les produits digitaux disponibles sont synchronises depuis Astral4Gamer.</p>
      </section>

      <section className="catalog-shell" aria-label="Toutes les cartes cadeaux disponibles">
        <div className="catalog-grid catalog-gift-grid">
          {giftCards.map((card) => (
            <Link
              className="catalog-card catalog-gift-card"
              href={`/cartes/${card.slug}`}
              key={card.slug}
              style={{ "--catalog-bg": card.bg } as CSSProperties}
            >
              <span className="catalog-card-media">
                {card.image ? (
                  <Image src={card.image} alt="" fill sizes="(max-width: 899px) 46vw, 22vw" />
                ) : (
                  <span className="catalog-logo-fallback">{card.logo}</span>
                )}
              </span>
              <span className="catalog-card-body">
                <strong>{card.name}</strong>
                <small>{card.category}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
