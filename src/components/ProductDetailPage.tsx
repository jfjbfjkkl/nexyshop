"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SiteNavbar, { type NavbarView } from "@/components/SiteNavbar";

type Offer = {
  label: string;
  price: number;
  caption?: string;
};

type RegionOption = {
  id: string;
  name: string;
  helper: string;
  feeLabel?: string;
};

type CheckoutCustomerForm = {
  name: string;
  email: string;
  phone: string;
  playerId: string;
};

type ProductDetailPageProps = {
  activeView: NavbarView;
  categoryLabel: string;
  productTypeLabel: string;
  title: string;
  description: string;
  image?: string;
  background: string;
  offers: Offer[];
  selectedOffer: number;
  onSelectOffer: (index: number) => void;
  playerId: string;
  onPlayerIdChange: (value: string) => void;
  onAddToCart: () => void;
  onConfirmOrder: (customer: CheckoutCustomerForm) => void;
  addToCartLabel?: string;
  payNowLabel?: string;
  addedToCart?: boolean;
  showPlayerId: boolean;
  regionOptions?: RegionOption[];
  selectedRegion?: number;
  onRegionChange?: (index: number) => void;
  selectedRegionHelper?: string;
};

const benefitCards = [
  { title: "Paiement securise", text: "Transactions protegees", icon: <LockIcon /> },
  { title: "Recharge rapide et instantanee", text: "Traitement sans attente inutile", icon: <BoltIcon /> },
  { title: "Support client 7j/7", text: "Assistance humaine disponible", icon: <HeadsetIcon /> },
];

export default function ProductDetailPage({
  activeView,
  categoryLabel,
  productTypeLabel,
  title,
  description,
  image,
  background,
  offers,
  selectedOffer,
  onSelectOffer,
  playerId,
  onPlayerIdChange,
  onAddToCart,
  onConfirmOrder,
  addToCartLabel = "Ajouter au panier",
  payNowLabel = "Payer maintenant",
  addedToCart = false,
  showPlayerId,
  regionOptions,
  selectedRegion = 0,
  onRegionChange,
  selectedRegionHelper,
}: ProductDetailPageProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [customer, setCustomer] = useState<CheckoutCustomerForm>({
    name: "",
    email: "",
    phone: "",
    playerId,
  });

  const activeOffer = offers[selectedOffer] ?? offers[0];

  useEffect(() => {
    setCustomer((current) => ({ ...current, playerId }));
  }, [playerId]);

  const syncPlayerIdAndOpenModal = () => {
    setModalOpen(true);
  };

  const addToCart = () => {
    onAddToCart();
  };

  const submitOrder = () => {
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      return;
    }

    if (showPlayerId && customer.playerId.trim().length === 0) {
      return;
    }

    onConfirmOrder({
      ...customer,
      playerId: customer.playerId.trim(),
    });
    setModalOpen(false);
  };

  return (
   <main className="min-h-screen bg-[#f5f8ff] text-[#0A1020] pt-24 sm:pt-28 lg:pt-32">
      <SiteNavbar activeView={activeView} />

      <section className="relative overflow-hidden px-4 pb-12 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pb-16 lg:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,99,255,0.16),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(7,24,50,0.12),transparent_26%),linear-gradient(180deg,#f7faff_0%,#eef4ff_100%)]" />
 
        <div className="container-main relative">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mt-16 sm:mt-20 lg:mt-24 overflow-hidden rounded-[28px] border border-white/12 shadow-[0_24px_58px_rgba(5,18,42,0.16)]"
          style={{ background }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.24),transparent_52%),linear-gradient(to_top,rgba(0,0,0,0.56),transparent_58%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_24%,transparent_72%,rgba(255,255,255,0.1))]" />
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover"
              />
            )}

            <div className="relative min-h-[260px] sm:min-h-[320px] lg:min-h-[360px]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent_0%,rgba(2,10,28,0.18)_100%)] sm:h-28" />
            <div className="pointer-events-none absolute right-6 top-6 h-16 w-16 rounded-full border border-white/14 bg-white/10 blur-[1px] sm:h-20 sm:w-20" />
            <div className="pointer-events-none absolute bottom-6 left-6 h-12 w-28 rounded-full bg-white/12 blur-2xl sm:h-16 sm:w-36" />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            className="mt-12 grid grid-cols-3 gap-3 sm:mt-14 sm:gap-4 lg:mt-16"
          >
            {benefitCards.map((card) => (
              <article
                key={card.title}
                className="flex aspect-square min-h-[92px] flex-col items-center justify-center rounded-[20px] border border-[#dbe8fb] bg-white/92 px-2.5 py-2.5 text-center shadow-[0_14px_34px_rgba(12,32,70,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,99,255,0.14)] sm:min-h-[104px] sm:rounded-[22px] sm:px-3.5 sm:py-3.5"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-[14px] bg-[#edf4ff] text-[#1463FF] shadow-[inset_0_0_0_1px_rgba(20,99,255,0.08)] sm:mb-2.5 sm:h-9 sm:w-9 sm:rounded-2xl">
                  {card.icon}
                </div>
                <strong className="block max-w-full text-[8px] font-black leading-[1.25] text-[#0A1020] [overflow-wrap:anywhere] sm:text-[9px]">{card.title}</strong>
              </article>
            ))}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: "easeOut" }}
            className="mt-14 sm:mt-16"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4d76bd] sm:text-[10px]">Tarifs du produit</span>
                <h2 className="mt-2 text-2xl font-black text-[#0A1020] sm:text-[2rem]">Choisissez une offre</h2>
              </div>
              {activeOffer && (
                <span className="rounded-full bg-[#edf4ff] px-3 py-1.5 text-[9px] font-black text-[#1463FF] sm:text-[10px]">
                  Selection: {activeOffer.label}
                </span>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 xl:grid-cols-3">
              {offers.map((offer, index) => {
                const active = index === selectedOffer;

                return (
                  <motion.button
                    key={`${offer.label}-${index}`}
                    type="button"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => onSelectOffer(index)}
                    className={`group flex min-h-[88px] flex-col items-center justify-center rounded-[18px] px-3 py-3 text-center transition duration-300 sm:min-h-[94px] sm:rounded-[20px] sm:px-3.5 sm:py-3.5 ${
                      active
                        ? "border border-[#1463FF] bg-[linear-gradient(135deg,#f4f8ff_0%,#ebf2ff_100%)] shadow-[0_0_0_4px_rgba(20,99,255,0.14),0_18px_36px_rgba(20,99,255,0.12)]"
                        : "border border-[#e4ecfa] bg-[#fbfdff] shadow-[0_12px_26px_rgba(12,32,70,0.05)] hover:border-[#1463FF]/38"
                    }`}
                  >
                    <span className="text-[7px] font-black uppercase tracking-[0.16em] text-[#6B7A99] sm:text-[8px]">Offre</span>
                    <strong className="mt-1.5 block max-w-full text-[10px] font-black leading-[1.25] text-[#0A1020] [overflow-wrap:anywhere] sm:text-[11px]">{offer.label}</strong>
                    <div className="mt-2.5 flex w-full items-center justify-center gap-1.5 sm:gap-2">
                      <span className="text-[14px] font-black leading-none text-[#1463FF] sm:text-[16px]">{formatEuro(offer.price)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[7px] font-black sm:px-2.5 sm:text-[8px] ${active ? "bg-[#1463FF] text-white" : "bg-[#eef3fc] text-[#5f7393]"}`}>
                        {offer.caption ?? "Selectionner"}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-14 h-px w-full bg-[linear-gradient(90deg,rgba(20,99,255,0),rgba(20,99,255,0.22),rgba(20,99,255,0))] sm:mt-16" />

            <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 sm:grid-cols-2">
              <label className="block sm:col-span-2 text-[8px] font-black uppercase tracking-[0.18em] text-[#4d76bd] sm:text-[9px]">
                Identifiant du joueur
                <input
                  value={playerId}
                  onChange={(event) => {
                    onPlayerIdChange(event.target.value);
                    setCustomer((current) => ({ ...current, playerId: event.target.value }));
                  }}
                  placeholder="Entrez votre ID"
                  className="mt-3 h-12 w-full rounded-2xl border border-[#dce7fb] bg-[#fbfdff] px-4 text-[10px] font-bold text-[#0A1020] outline-none transition placeholder:text-[#9caac3] focus:border-[#1463FF] sm:text-[11px]"
                />
              </label>
              <label className="block text-[8px] font-black uppercase tracking-[0.18em] text-[#4d76bd] sm:text-[9px]">
                Email
                <input
                  type="email"
                  value={customer.email}
                  onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
                  placeholder="Entrez votre email"
                  className="mt-3 h-12 w-full rounded-2xl border border-[#dce7fb] bg-[#fbfdff] px-4 text-[10px] font-bold text-[#0A1020] outline-none transition placeholder:text-[#9caac3] focus:border-[#1463FF] sm:text-[11px]"
                />
              </label>
              <label className="block text-[8px] font-black uppercase tracking-[0.18em] text-[#4d76bd] sm:text-[9px]">
                Numero de telephone
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Entrez votre numero"
                  className="mt-3 h-12 w-full rounded-2xl border border-[#dce7fb] bg-[#fbfdff] px-4 text-[10px] font-bold text-[#0A1020] outline-none transition placeholder:text-[#9caac3] focus:border-[#1463FF] sm:text-[11px]"
                />
              </label>
            </div>

            <div className="mt-12 grid gap-4 sm:mt-14 sm:gap-5 sm:grid-cols-2">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                onClick={addToCart}
                className={`min-h-[54px] rounded-[22px] border px-5 text-sm font-black transition ${
                  addedToCart
                    ? "border-[#17a36b] bg-[#17a36b] text-white shadow-[0_18px_36px_rgba(23,163,107,0.18)]"
                    : "border-[#d7e4fb] bg-white text-[#0A1020] hover:border-[#1463FF]/35 hover:bg-[#f8fbff]"
                }`}
              >
                {addedToCart ? "Ajoute au panier" : addToCartLabel}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                onClick={syncPlayerIdAndOpenModal}
                className="min-h-[54px] rounded-[22px] bg-[linear-gradient(135deg,#1463FF,#0D4FD6)] px-5 text-sm font-black text-white shadow-[0_18px_36px_rgba(20,99,255,0.26)] transition hover:shadow-[0_22px_42px_rgba(20,99,255,0.34)]"
              >
                {payNowLabel}
              </motion.button>
            </div>
          </motion.section>

          <HomeFooter />
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && activeOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#031022]/55 px-4 py-8 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.section
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-[720px] overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-[0_28px_80px_rgba(3,16,34,0.35)]"
            >
              <div className="border-b border-[#e7eefb] bg-[linear-gradient(180deg,#f7faff_0%,#ffffff_100%)] px-5 py-5 sm:px-7">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#4d76bd]">Fenetre de paiement</span>
                <h3 className="mt-2 text-2xl font-black text-[#0A1020]">Informations de commande</h3>
              </div>

              <div className="grid gap-6 px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[.92fr_1.08fr]">
                <div className="rounded-[24px] border border-[#e4ecfa] bg-[#f8fbff] p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#6B7A99]">Commande</p>
                  <div className="mt-4 space-y-4">
                    <SummaryRow label="Produit" value={title} />
                    <SummaryRow label="Offre selectionnee" value={activeOffer.label} />
                    <SummaryRow label="Prix total" value={formatEuro(activeOffer.price)} highlight />
                    {showPlayerId && <SummaryRow label="ID joueur" value={customer.playerId || playerId || "A renseigner"} />}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#4d76bd]">Informations client</p>
                  <div className="mt-4 grid gap-3">
                    <Field
                      label="Nom"
                      value={customer.name}
                      onChange={(value) => setCustomer((current) => ({ ...current, name: value }))}
                    />
                    <Field
                      label="Email"
                      value={customer.email}
                      type="email"
                      onChange={(value) => setCustomer((current) => ({ ...current, email: value }))}
                    />
                    <Field
                      label="Numero de telephone"
                      value={customer.phone}
                      onChange={(value) => setCustomer((current) => ({ ...current, phone: value }))}
                    />
                    {showPlayerId && (
                      <Field
                        label="ID du joueur"
                        value={customer.playerId}
                        onChange={(value) => {
                          setCustomer((current) => ({ ...current, playerId: value }));
                          onPlayerIdChange(value);
                        }}
                      />
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="min-h-[50px] rounded-[20px] border border-[#d7e4fb] bg-white px-5 text-sm font-black text-[#0A1020] transition hover:bg-[#f8fbff]"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={submitOrder}
                      disabled={
                        !customer.name.trim() ||
                        !customer.email.trim() ||
                        !customer.phone.trim() ||
                        (showPlayerId && !customer.playerId.trim())
                      }
                      className="min-h-[50px] rounded-[20px] bg-[linear-gradient(135deg,#1463FF,#0D4FD6)] px-5 text-sm font-black text-white shadow-[0_18px_36px_rgba(20,99,255,0.26)] transition disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Valider la commande
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#e8eef9] pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-bold text-[#6B7A99]">{label}</span>
      <span className={`text-right text-sm font-black ${highlight ? "text-[#1463FF]" : "text-[#0A1020]"}`}>{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#4d76bd]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-[#dce7fb] bg-[#fbfdff] px-4 text-sm font-bold text-[#0A1020] outline-none transition focus:border-[#1463FF]"
      />
    </label>
  );
}

function HomeFooter() {
  return (
    <footer className="site-footer mt-8">
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
          <span><LockIcon /></span>
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
  );
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function LockIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M7 11V8a5 5 0 1 1 10 0v3" strokeLinecap="round" />
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4ZM16 20c0 1-2 2-4 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.79.63 2.64a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.44-1.29a2 2 0 0 1 2.11-.45c.85.3 1.74.51 2.64.63A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}