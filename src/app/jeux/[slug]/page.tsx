import GameDetailClient from "@/components/GameDetailClient";
import SiteNavbar from "@/components/SiteNavbar";
import { getAstralCatalog, getAstralProductBySlug } from "@/lib/astral-catalog";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const legacyGameRedirects: Record<string, string> = {
  "call-of-duty": "/jeux/call-of-duty-mobile-garena-sg-my",
  "free-fire": "/jeux/garena-free-fire-global",
  "pubg-mobile": "/jeux",
  "genshin-impact": "/jeux",
  fortnite: "/jeux",
  "fc-mobile": "/jeux",
  "brawl-stars": "/jeux",
  "blood-strike": "/jeux",
  "mobile-legends": "/jeux",
  roblox: "/jeux",
};

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getAstralProductBySlug(slug);

  if (!game) {
    const redirectTo = legacyGameRedirects[slug];
    if (redirectTo) redirect(redirectTo);

    return (
      <main className="min-h-screen bg-[#f5f8ff]">
        <SiteNavbar activeView="games" />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-[880px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-black text-[#0A1020]">Jeu introuvable</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold text-[#6B7A99]">
            Le jeu demande n&apos;est plus disponible chez Astral4Gamer ou l&apos;adresse est incorrecte.
          </p>
        </section>
      </main>
    );
  }

  const similarGames = (await getAstralCatalog())
    .filter((entry) => entry.type === "game" && entry.slug !== game.slug)
    .sort((a, b) => Number(b.category === game.category) - Number(a.category === game.category))
    .slice(0, 3)
    .map((entry) => ({
      slug: entry.slug,
      name: entry.name,
      image: entry.image,
      logo: entry.logo,
      currency: entry.currency,
      background: entry.bg,
    }));

  return <GameDetailClient game={game} similarGames={similarGames} />;
}
