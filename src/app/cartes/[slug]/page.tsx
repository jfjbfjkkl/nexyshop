import GameDetailClient from "@/components/GameDetailClient";
import SiteNavbar from "@/components/SiteNavbar";
import { getAstralCatalog, getAstralProductBySlug } from "@/lib/astral-catalog";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const legacyCardSlugs = new Set(["google-play", "playstation", "spotify", "pubg-mobile-gift", "netflix", "xbox", "steam"]);

export default async function GiftCardDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getAstralProductBySlug(slug);

  if (!product || product.type !== "giftcard") {
    if (legacyCardSlugs.has(slug)) redirect("/cartes");

    return (
      <main className="min-h-screen bg-[#f5f8ff]">
        <SiteNavbar activeView="cards" />
        <section className="mx-auto flex min-h-[70vh] w-full max-w-[880px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-black text-[#0A1020]">Produit introuvable</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold text-[#6B7A99]">
            Le produit demande n&apos;est plus disponible chez Astral4Gamer ou l&apos;adresse est incorrecte.
          </p>
        </section>
      </main>
    );
  }

  const similarProducts = (await getAstralCatalog())
    .filter((entry) => entry.type === "giftcard" && entry.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3)
    .map((entry) => ({
      slug: entry.slug,
      name: entry.name,
      image: entry.image,
      logo: entry.logo,
      currency: entry.currency,
      background: entry.bg,
    }));

  return <GameDetailClient game={product} similarGames={similarProducts} />;
}
