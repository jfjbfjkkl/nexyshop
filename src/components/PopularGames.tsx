"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { games } from "@/lib/data";

export default function PopularGames() {
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} id="jeux">
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
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1463FF] to-[#0D4FD6] shadow-lg shadow-blue-500/30"
          >
            <GameIcon />
          </motion.div>
          <h2 className="text-section-title font-black leading-tight text-[#0A1020]">Top Up — Jeux populaires</h2>
        </div>
        {/* Ligne animée sous le titre */}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="h-[3px] w-28 rounded-full bg-gradient-to-r from-[#1463FF] to-[#5da0ff]"
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6 xl:grid-cols-5 xl:gap-x-5 xl:gap-y-6">
        {games.map((game, i) => (
          <motion.article
            key={game.slug}
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.42, delay: 0.07 + i * 0.06, ease: "easeOut" }}
            whileHover={{ y: -8, scale: 1.025 }}
            onClick={() => router.push(`/jeux/${game.slug}`)}
            className="group relative min-h-[168px] cursor-pointer overflow-hidden rounded-[26px] border border-white/20 p-6 shadow-[0_18px_42px_rgba(5,18,42,0.15)] transition-shadow duration-300 hover:shadow-[0_24px_58px_rgba(20,99,255,0.22)] sm:min-h-[190px] lg:min-h-[210px]"
            style={{ background: game.bg }}
          >
            {game.image && (
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_52%),linear-gradient(to_top,rgba(0,0,0,0.55),transparent_58%)]" />
            <div className="absolute inset-x-5 top-5 h-px bg-white/18" />
            <div className="relative flex h-full flex-col items-center justify-center gap-5 text-white">
              {!game.image && (
                <span className="rounded-3xl bg-white/12 px-5 py-4 text-4xl drop-shadow-lg backdrop-blur-md transition group-hover:scale-105">
                  {game.logo}
                </span>
              )}
              <span className="text-center text-sm font-black leading-tight sm:text-base">{game.name}</span>
            </div>
            <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-sm transition group-hover:bg-[#1463FF] group-hover:shadow-[0_0_22px_rgba(20,99,255,0.55)]">
              <ArrowIcon />
            </span>
          </motion.article>
        ))}

        <motion.article
          initial={{ opacity: 0, y: 22, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.42, delay: 0.07 + games.length * 0.06, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.025 }}
          className="flex min-h-[168px] cursor-pointer flex-col items-center justify-center gap-5 rounded-[26px] border-2 border-dashed border-[#d8e2f1] bg-white shadow-[0_16px_38px_rgba(12,32,70,0.09)] transition hover:border-[#1463FF]/45 hover:shadow-[0_24px_58px_rgba(20,99,255,0.15)] sm:min-h-[190px] lg:min-h-[210px]"
        >
          <GridIcon />
          <span className="text-center text-sm font-black leading-tight text-[#071a3d]">Voir tous<br />les jeux</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1463FF] text-white">
            <ArrowIcon />
          </span>
        </motion.article>
      </div>
    </div>
  );
}

function GameIcon() {
  return (
    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <path d="M12 12h4m-2-2v4M7 12h.01M9 14h.01" strokeLinecap="round" strokeLinejoin="round" />
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
