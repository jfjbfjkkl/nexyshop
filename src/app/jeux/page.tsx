import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import SiteNavbar from "@/components/SiteNavbar";
import Footer from "@/components/Footer";
import { getAstralProductsByType } from "@/lib/astral-catalog";

export const dynamic = "force-dynamic";

export default async function GamesCatalogPage() {
  const games = await getAstralProductsByType("game");

  return (
    <main className="catalog-page catalog-games-page">
      <SiteNavbar activeView="games" />

      <section className="catalog-hero">
        <span className="catalog-kicker">Catalogue jeux</span>
        <h1>
          Jeux <span className="section-count">: {games.length}</span>
        </h1>
        <p>Tous les produits disponibles sont synchronises depuis Astral4Gamer.</p>
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
                <small>{game.category}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
