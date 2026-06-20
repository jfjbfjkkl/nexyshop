"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { giftCards } from "@/lib/data";

export default function GiftCards() {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} id="cartes">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-12 flex flex-col gap-3 sm:mb-14"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={isInView ? { scale: [0.8, 1.1, 1] } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] shadow-lg shadow-orange-400/30"
          >
            <GiftIcon />
          </motion.div>
          <h2 className="text-section-title font-black leading-tight text-[#0A1020]">Cartes Cadeaux</h2>
        </div>
        {/* Ligne animée sous le titre */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="h-[3px] w-24 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444]"
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 xl:grid-cols-5 xl:gap-x-5 xl:gap-y-6">
        {giftCards.map((card, i) => (
          <motion.article
            key={card.slug}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.42, delay: 0.08 + i * 0.06, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.025 }}
            onClick={() => router.push(`/cartes/${card.slug}`)}
            className="group relative min-h-[220px] cursor-pointer overflow-hidden rounded-[26px] shadow-[0_20px_46px_rgba(5,18,42,0.16)] transition-shadow duration-300 hover:shadow-[0_28px_64px_rgba(20,99,255,0.2)] sm:min-h-[250px] lg:min-h-[280px]"
            style={{ background: card.bg }}
            aria-label={card.name}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_64%_8%,rgba(255,255,255,0.36),transparent_30%),linear-gradient(to_top,rgba(0,0,0,0.74),rgba(0,0,0,0.05)_65%)]" />
            <div className="absolute inset-x-5 top-5 h-px bg-white/18" />
            <div className="absolute bottom-6 left-5 right-5">
              <p className="text-sm font-black text-white">{card.name}</p>
              <p className="mt-1 text-xs text-white/60">
                À partir de {Math.min(...card.denominations.map((d) => d.price)).toFixed(2)}€
              </p>
            </div>
            <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#1463FF] text-white transition group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(20,99,255,0.55)]">
              <ArrowIcon />
            </span>
          </motion.article>
        ))}

        <motion.article
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.42, delay: 0.08 + giftCards.length * 0.06, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.025 }}
          className="group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-[26px] border-2 border-dashed border-[#d8e2f1] bg-white shadow-[0_16px_38px_rgba(12,32,70,0.09)] transition hover:border-[#1463FF]/45 hover:shadow-[0_24px_58px_rgba(20,99,255,0.15)] sm:min-h-[250px] lg:min-h-[280px]"
        >
          <GridIcon />
          <span className="text-center text-sm font-black leading-tight text-[#071a3d]">Voir toutes<br />les cartes</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1463FF] text-white">
            <ArrowIcon />
          </span>
        </motion.article>
      </div>
    </div>
  );
}

function GiftIcon() {
  return (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 3H8L2 7h20l-6-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1463FF" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
