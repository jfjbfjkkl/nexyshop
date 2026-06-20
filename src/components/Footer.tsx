"use client";

import { motion } from "framer-motion";

const columns = [
  { title: "Produits", links: ["Top Up", "Cartes Cadeaux", "Jeux"] },
  { title: "Aide", links: ["Centre d'aide", "Contact", "FAQ"] },
  { title: "Légal", links: ["Conditions", "Confidentialité", "Cookies"] },
];

const payments = ["VISA", "MC", "PayPal", "OM", "Wave"];

export default function Footer() {
  return (
    <section className="relative bg-white px-4 pb-0 pt-28 sm:px-6 lg:px-8">
      <footer
        id="support"
        className="container-main relative overflow-hidden rounded-t-[2rem] bg-[#061633] text-white shadow-none"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12" />
        <div className="relative grid gap-24 px-7 pb-24 pt-28 sm:px-12 lg:grid-cols-[1.05fr_2fr] lg:px-20 lg:pb-28 lg:pt-32">
          <div>
            <a href="#" className="inline-flex items-end gap-1" aria-label="NEXY SHOP">
              <span className="leading-none">
                <span className="block text-3xl font-black italic tracking-[0.03em] text-white">NEXY</span>
                <span className="ml-6 block text-[8px] font-black tracking-[0.55em] text-[#6ca9ff]">SHOP</span>
              </span>
            </a>
            <p className="mt-10 max-w-sm text-sm font-medium leading-8 text-white/62">
              Recharges rapides, cartes cadeaux et support disponible pour t&apos;accompagner simplement.
            </p>
            <div className="mt-14">
              <p className="mb-6 text-xs font-black uppercase tracking-[0.22em] text-white/38">Moyens de paiement</p>
              <div className="flex flex-wrap gap-5">
                {payments.map((payment) => (
                  <span key={payment} className="rounded-2xl border border-white/12 bg-white/8 px-5 py-3 text-xs font-black text-white/82">
                    {payment}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-16 pt-3 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-8 text-xs font-black uppercase tracking-[0.22em] text-white/38">{column.title}</h3>
                <ul className="grid gap-6">
                  {column.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 3 }}
                        className="inline-flex text-sm font-semibold leading-7 text-white/66 transition hover:text-white"
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-7 sm:px-8 lg:px-14">
          <div className="flex flex-col gap-3 text-sm font-medium text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 NEXY SHOP. Tous droits réservés.</span>
            <span>Support 24/7</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
