"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-white px-4 pb-6 pt-[136px] sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="container-main relative h-[330px] overflow-hidden rounded-2xl shadow-[0_22px_58px_rgba(11,27,59,0.18)] ring-1 ring-[#cbd3df]"
      >
        <Image
          src="/image copy.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,22,51,0.5)_0%,rgba(6,22,51,0.26)_43%,rgba(20,99,255,0.05)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_50%,rgba(93,160,255,0.22),transparent_30%)]" />

        <motion.div
          initial={{ opacity: 0, x: -46, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.22, ease: "easeOut" }}
          className="absolute bottom-0 right-0 top-0 hidden w-[56%] lg:block"
        >
          <Image
            src="/image.png"
            alt="NEXY SHOP"
            fill
            className="object-cover object-center opacity-58 mix-blend-screen"
            priority
          />
          <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#1c2c57] to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
          className="absolute right-8 top-1/2 z-10 max-w-[520px] -translate-y-1/2 sm:right-12 lg:right-16"
        >
          <h1 className="text-[clamp(2rem,4.4vw,4rem)] font-black uppercase leading-[1.08] text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.34)]">
            Recharge tes jeux
            <span className="block text-[#7fb0ff]">en toute sécurité</span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38, ease: "easeOut" }}
            className="mt-5 max-w-[430px] text-base font-semibold leading-7 text-white/84 sm:text-lg"
          >
            Recharge instantanée, service fiable et ouvert 24/7
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
