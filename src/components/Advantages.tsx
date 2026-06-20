"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const advantages = [
  {
    title: "Meilleurs prix garantis",
    desc: "Des tarifs clairs et compétitifs sur les recharges les plus demandées.",
    color: "#EF4444",
    bg: "#FFF1F2",
    icon: <HeartIcon />,
  },
  {
    title: "Paiement 100% sécurisé",
    desc: "Chaque transaction est protégée avec une expérience simple et fiable.",
    color: "#1463FF",
    bg: "#EEF4FF",
    icon: <ShieldIcon />,
  },
  {
    title: "Livraison instantanée",
    desc: "Les produits sont envoyés rapidement après validation de la commande.",
    color: "#F59E0B",
    bg: "#FFF7E6",
    icon: <BoltIcon />,
  },
  {
    title: "Support disponible 24/7",
    desc: "Une assistance prête à aider avant, pendant et après l'achat.",
    color: "#10B981",
    bg: "#ECFDF5",
    icon: <PhoneIcon />,
  },
];

export default function Advantages() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-[#f5f7fb] px-4 py-20 sm:px-6 lg:px-8">
      <div className="container-main">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {advantages.map((adv, i) => (
            <motion.article
              key={adv.title}
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-3xl bg-white p-7 shadow-[0_20px_55px_rgba(12,32,70,0.10)] ring-1 ring-[#e2eaf6] transition hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(12,32,70,0.16)]"
            >
              <div
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-45 blur-2xl transition group-hover:scale-125"
                style={{ background: adv.color }}
              />
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-3xl transition group-hover:scale-105" style={{ background: adv.bg, color: adv.color }}>
                {adv.icon}
              </div>
              <h3 className="relative text-base font-black text-[#071a3d]">{adv.title}</h3>
              <p className="relative mt-3 text-sm font-medium leading-6 text-[#6b7891]">{adv.desc}</p>
              <motion.span
                className="relative mt-6 block h-1 w-12 rounded-full"
                style={{ background: adv.color }}
                initial={{ width: 28 }}
                animate={isInView ? { width: 48 } : {}}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.08 }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeartIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path d="M13 2 4 14h8l-1 8 9-12h-8l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 4.7 12 19.8 19.8 0 0 1 1.6 3.3 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1l-1 1a16 16 0 0 0 5.5 5.5l1-1a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.8 2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
