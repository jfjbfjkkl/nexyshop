"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/lib/store";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Jeux", href: "/#recharges" },
  { label: "Cartes Cadeaux", href: "/#cartes-cadeaux" },
  { label: "Chaîne", href: "https://whatsapp.com/channel/0029Vb5yueU60eBmk8siDu03" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#061633]/95 text-white shadow-[0_18px_44px_rgba(4,14,35,0.28)] backdrop-blur-xl"
    >
      <div className="container-fluid py-4">
        <div className="flex items-center gap-7">
          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ y: -1 }}
            className="flex min-w-[148px] items-end gap-1"
            aria-label="NEXY SHOP"
          >
            <span className="leading-none">
              <span className="block text-[34px] font-black italic leading-[0.92] tracking-[0.03em] text-white">NEXY</span>
              <span className="ml-7 block text-[8px] font-black leading-none tracking-[0.58em] text-[#5da0ff]">SHOP</span>
            </span>
          </motion.button>

          <nav className="ml-4 hidden flex-1 items-center justify-center gap-12 pr-16 xl:gap-16 lg:flex">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : false;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative rounded-full px-3 py-2 whitespace-nowrap text-sm font-bold transition hover:bg-white/8 hover:text-[#72a9ff] ${
                    isActive ? "text-[#72a9ff]" : "text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-4 left-3 right-3 h-[3px] rounded-full bg-[#2f7dff] shadow-[0_0_16px_rgba(47,125,255,0.7)]" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <button
              aria-label="Notifications"
              onClick={() => router.push("/notifications")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/86 transition hover:-translate-y-0.5 hover:text-[#72a9ff]"
            >
              <BellIcon />
            </button>
            <button
              aria-label="Panier"
              onClick={() => router.push("/panier")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white/86 transition hover:-translate-y-0.5 hover:text-[#72a9ff]"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#1463FF] text-[10px] font-black text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              aria-label="Compte"
              onClick={() => router.push("/compte")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white/86 transition hover:-translate-y-0.5 hover:text-[#72a9ff]"
            >
              <AccountIcon />
            </button>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((open) => !open)}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/12 lg:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-white/10 bg-[#061633] px-4 pb-4 lg:hidden"
          >
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/8"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/notifications"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/8"
              >
                Notifications
              </a>
              <a
                href="/panier"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/8"
              >
                Panier
                {totalItems > 0 && (
                  <span className="rounded-full bg-[#1463FF] px-2 py-0.5 text-[10px] font-black">{totalItems}</span>
                )}
              </a>
              <a
                href="/compte"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/8"
              >
                Compte
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path d="M6 6h15l-2 8H8L6 3H3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 21h4" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="flex h-5 w-5 flex-col items-center justify-center gap-1.5">
      <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
      <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "opacity-0" : ""}`} />
      <span className={`h-0.5 w-5 rounded-full bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
    </span>
  );
}
