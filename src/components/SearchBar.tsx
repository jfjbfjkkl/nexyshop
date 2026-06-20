"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { searchProducts } from "@/lib/data";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const results = searchProducts(query);
  const hasResults = results.games.length > 0 || results.giftCards.length > 0;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function navigate(href: string) {
    setQuery("");
    setOpen(false);
    router.push(href);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto mb-20 w-[85%] max-w-[500px] sm:mb-24"
    >
      {/* Barre */}
      <motion.label
        animate={focused ? { scale: 1.015 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`flex h-14 cursor-text items-center gap-3 rounded-2xl px-5 shadow-[0_8px_32px_rgba(12,32,70,0.09)] ring-1 transition-all duration-200 ${
          focused
            ? "bg-white ring-2 ring-[#1463FF]/50 shadow-[0_12px_40px_rgba(20,99,255,0.14)]"
            : "bg-[#f5f7fb] ring-[#e4eaf4]"
        }`}
      >
        <motion.span animate={focused ? { color: "#1463FF" } : { color: "#71809a" }} transition={{ duration: 0.2 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.3">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" strokeLinecap="round" />
          </svg>
        </motion.span>
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setOpen(true); setFocused(true); }}
          placeholder="Recherche ton jeu ou ta carte cadeau..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#071a3d] outline-none placeholder:text-[#8b96aa]"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => { setQuery(""); setOpen(false); }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e7edf7] text-xs text-[#6B7A99] hover:bg-[#1463FF] hover:text-white transition"
            >
              ✕
            </motion.button>
          )}
        </AnimatePresence>
      </motion.label>

      {/* Dropdown résultats */}
      <AnimatePresence>
        {open && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[60px] z-50 overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_rgba(12,32,70,0.16)] ring-1 ring-[#e7edf7]"
          >
            {!hasResults ? (
              <p className="px-5 py-5 text-sm text-[#6B7A99]">Aucun résultat pour &ldquo;{query}&rdquo;</p>
            ) : (
              <>
                {results.games.length > 0 && (
                  <div>
                    <p className="px-5 pb-2 pt-4 text-[10px] font-black uppercase tracking-widest text-[#aab4c8]">Jeux</p>
                    {results.games.map((game, i) => (
                      <motion.button
                        key={game.slug}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate(`/jeux/${game.slug}`)}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f5f7fb]"
                      >
                        <span className="text-xl">{game.logo}</span>
                        <span className="text-sm font-bold text-[#0A1020]">{game.name}</span>
                        <span className="ml-auto text-xs text-[#aab4c8]">→</span>
                      </motion.button>
                    ))}
                  </div>
                )}
                {results.giftCards.length > 0 && (
                  <div className="border-t border-[#f0f4fa]">
                    <p className="px-5 pb-2 pt-4 text-[10px] font-black uppercase tracking-widest text-[#aab4c8]">Cartes Cadeaux</p>
                    {results.giftCards.map((card, i) => (
                      <motion.button
                        key={card.slug}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => navigate(`/cartes/${card.slug}`)}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left transition hover:bg-[#f5f7fb]"
                      >
                        <span className="text-xl">🎁</span>
                        <span className="text-sm font-bold text-[#0A1020]">{card.name}</span>
                        <span className="ml-auto text-xs text-[#aab4c8]">→</span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
