"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

const floatingCards = [
  { title: "Recharges", text: "Jeux populaires", icon: <GamepadIcon />, className: "left-[2px] top-[248px] max-xl:left-0" },
  { title: "Diamants", text: "Cartes & packs", icon: <DiamondIcon />, className: "left-[0px] top-[388px]" },
  { title: "Cartes cadeaux", text: "Google Play, iTunes, PSN...", icon: <GiftIcon />, className: "left-[0px] top-[540px]" },
  { title: "Abonnements", text: "Pass hebdo / mensuel", icon: <CrownIcon />, className: "right-[18px] top-[290px] max-xl:right-0" },
  { title: "Livraison", text: "Instantanee & securisee", icon: <BoltIcon />, className: "right-[34px] top-[432px] max-xl:right-0" },
  { title: "Paiements", text: "100% securises", icon: <ShieldIcon />, className: "right-[50px] top-[560px] max-xl:right-0" },
];

type AccountMode = "signup" | "login";

export default function AccountPage() {
  const [mode, setMode] = useState<AccountMode>("signup");
  const isSignup = mode === "signup";

  return (
    <main className="signup-page min-h-screen overflow-hidden bg-[#f5f7ff] font-sans text-[#0f172a]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1550px] items-center justify-between gap-16 px-[60px] py-10 max-xl:gap-10 max-lg:flex-col max-lg:px-6 max-lg:py-8">
        <div className="absolute right-[60px] top-[28px] z-30 flex items-center gap-6 text-[14px] font-extrabold max-lg:static max-lg:ml-auto">
          <span>{isSignup ? "Deja un compte ?" : "Nouveau sur NEXY SHOP ?"}</span>
          <button
            type="button"
            onClick={() => setMode(isSignup ? "login" : "signup")}
            className="flex h-[46px] items-center rounded-[14px] bg-[#2563ff] px-[26px] text-[14px] font-bold text-white shadow-[0_14px_28px_rgba(37,99,255,.18)] transition duration-200 hover:brightness-110"
          >
            {isSignup ? "Se connecter" : "Creer un compte"}
          </button>
        </div>

        <section className="relative flex min-h-[760px] w-1/2 min-w-0 flex-col justify-center pt-12 max-lg:min-h-[760px] max-lg:w-full max-sm:min-h-[690px]">
          <div className="relative z-20">
            <h1 className="text-[72px] font-black leading-none tracking-[0] max-xl:text-[60px] max-sm:text-[44px]">
              <span className="text-[#071226]">NEXY </span>
              <span className="text-[#2563ff]">SHOP</span>
            </h1>
            <p className="mt-7 max-w-[540px] text-[18px] font-medium leading-[1.85] text-[#5f6b83] max-xl:text-[16px]">
              Accede a ton espace compte et profite d&apos;une experience gaming unique :<br className="max-sm:hidden" />
              commandes, recharges, cartes cadeaux, abonnements et suivi instantane.
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-[-64px] top-[165px] z-10 max-sm:top-[190px]">
            <div className="absolute left-1/2 top-[58%] h-[580px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,255,.14),rgba(79,124,255,.06)_44%,transparent_70%)] blur-2xl" />
            <motion.div
              className="relative mx-auto h-[690px] w-[520px] max-xl:h-[650px] max-xl:w-[490px] max-sm:h-[560px] max-sm:w-[390px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/nexy-signup-character.png"
                alt="Personnage gaming premium NEXY SHOP"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 520px"
                className="object-contain object-bottom drop-shadow-[0_34px_48px_rgba(37,99,255,.18)]"
              />
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 max-sm:hidden">
            {floatingCards.map((card, index) => (
              <motion.article
                key={card.title}
                className={`absolute flex min-w-[164px] items-center gap-4 rounded-[22px] border border-white/80 bg-white/90 px-[22px] py-[18px] shadow-[0_10px_40px_rgba(0,0,0,.06)] backdrop-blur ${card.className}`}
                animate={{ y: [0, index % 2 ? -6 : -10, 0] }}
                transition={{ duration: 5.2 + index * 0.35, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center text-[#2563ff]">{card.icon}</span>
                <span>
                  <strong className="block text-[13px] font-black leading-tight text-[#111827]">{card.title}</strong>
                  <small className="mt-1 block max-w-[118px] text-[11px] font-semibold leading-snug text-[#657084]">{card.text}</small>
                </span>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="relative z-20 flex w-1/2 justify-center max-lg:w-full">
          <div className="w-[620px] rounded-[34px] bg-white p-12 shadow-[0_20px_60px_rgba(0,0,0,.06)] max-sm:p-6">
            <div className="text-center">
              <h2 className="text-[56px] font-black leading-tight tracking-[0] text-[#071226] max-sm:text-[38px]">
                {isSignup ? "Creer un compte" : "Connexion"}
              </h2>
              <p className="mt-3 text-[16px] font-semibold text-[#8a94a8]">
                {isSignup ? "Rejoins la communaute" : "Retrouve ton espace"} <span className="font-black text-[#2563ff]">NEXY SHOP</span>
              </p>
            </div>

            <div className="mt-8 grid h-[58px] grid-cols-2 rounded-[18px] bg-[#f3f6ff] p-1.5">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-[14px] text-[15px] font-black transition duration-200 ${
                  isSignup ? "bg-white text-[#2563ff] shadow-[0_10px_24px_rgba(37,99,255,.12)]" : "text-[#7a8497] hover:text-[#2563ff]"
                }`}
              >
                Inscription
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-[14px] text-[15px] font-black transition duration-200 ${
                  !isSignup ? "bg-white text-[#2563ff] shadow-[0_10px_24px_rgba(37,99,255,.12)]" : "text-[#7a8497] hover:text-[#2563ff]"
                }`}
              >
                Connexion
              </button>
            </div>

            <form className="mt-9 space-y-6">
              {isSignup ? (
                <>
                  <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                    <Field label="Nom d'utilisateur" icon={<UserIcon />} placeholder="Choisis un nom d'utilisateur" />
                    <Field label="E-mail" icon={<MailIcon />} placeholder="Entre ton e-mail" type="email" />
                  </div>
                  <Field label="Mot de passe" icon={<LockIcon />} placeholder="Cree un mot de passe" type="password" action={<EyeIcon />} />
                  <Field label="Confirmer le mot de passe" icon={<LockIcon />} placeholder="Confirme ton mot de passe" type="password" action={<EyeIcon />} />
                  <Field label="Pays / Region" icon={<GlobeIcon />} placeholder="Selectionne ton pays" action={<ChevronDownIcon />} />

                  <label className="flex items-start gap-3 text-[14px] font-semibold leading-relaxed text-[#4b5565]">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#cfd6e6] accent-[#2563ff]" />
                    <span>
                      J&apos;accepte les <a className="font-black text-[#2563ff]" href="#">Conditions d&apos;utilisation</a> et la{" "}
                      <a className="font-black text-[#2563ff]" href="#">Politique de confidentialite</a>
                    </span>
                  </label>
                </>
              ) : (
                <>
                  <Field label="E-mail" icon={<MailIcon />} placeholder="Entre ton e-mail" type="email" />
                  <Field label="Mot de passe" icon={<LockIcon />} placeholder="Entre ton mot de passe" type="password" action={<EyeIcon />} />

                  <div className="flex items-center justify-between gap-4 text-[14px] font-bold text-[#64748b]">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-[#cfd6e6] accent-[#2563ff]" />
                      Se souvenir de moi
                    </label>
                    <a href="#" className="font-black text-[#2563ff]">Mot de passe oublie ?</a>
                  </div>
                </>
              )}

              <button className="h-16 w-full rounded-[18px] bg-[linear-gradient(135deg,#2563ff_0%,#0957ff_52%,#4f7cff_100%)] text-[20px] font-black text-white shadow-[0_18px_34px_rgba(37,99,255,.24)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110">
                {isSignup ? "Creer un compte" : "Se connecter"}
              </button>

              <div className="flex items-center gap-5">
                <span className="h-px flex-1 bg-[#e6eaf3]" />
                <span className="text-[13px] font-bold text-[#9aa4b7]">ou continuer avec</span>
                <span className="h-px flex-1 bg-[#e6eaf3]" />
              </div>

              <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
                <SocialButton icon={<GoogleIcon />} label="Google" />
                <SocialButton icon={<FacebookIcon />} label="Facebook" />
                <SocialButton icon={<DiscordIcon />} label="Discord" />
              </div>

              <p className="flex items-center justify-center gap-2 pt-1 text-[13px] font-semibold text-[#9aa4b7]">
                <ShieldSmallIcon />
                Connexion securisee & donnees protegees
              </p>

              <div className="grid grid-cols-3 gap-3 rounded-[20px] bg-[#f8faff] p-4 text-center max-sm:grid-cols-1">
                <AccountStat value="24/7" label="Support" />
                <AccountStat value="Instant" label="Livraison" />
                <AccountStat value="100%" label="Securise" />
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function AccountStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="rounded-2xl bg-white px-3 py-3 shadow-[0_8px_20px_rgba(15,23,42,.04)]">
      <strong className="block text-[15px] font-black text-[#2563ff]">{value}</strong>
      <small className="mt-1 block text-[11px] font-black uppercase tracking-[.08em] text-[#8a94a8]">{label}</small>
    </span>
  );
}

function Field({ label, icon, placeholder, type = "text", action }: { label: string; icon: ReactNode; placeholder: string; type?: string; action?: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-3 block text-[14px] font-black text-[#101828]">{label}</span>
      <span className="flex h-16 items-center gap-3 rounded-[18px] border border-[#dfe3f0] bg-white px-5 text-[#98a2b3] transition duration-200 focus-within:border-[#2563ff] focus-within:shadow-[0_0_0_4px_rgba(37,99,255,.09)]">
        <span className="shrink-0">{icon}</span>
        <input className="min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-[#0f172a] outline-none placeholder:text-[#9aa4b7]" type={type} placeholder={placeholder} />
        {action && <span className="shrink-0 text-[#8f99ab]">{action}</span>}
      </span>
    </label>
  );
}

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button type="button" className="flex h-[52px] items-center justify-center gap-3 rounded-2xl border border-[#e1e6f0] bg-white text-[14px] font-black text-[#1f2937] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,.08)]">
      {icon}
      {label}
    </button>
  );
}

function Svg({ children, className = "h-5 w-5" }: { children: ReactNode; className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function GamepadIcon() { return <Svg className="h-8 w-8"><path d="M6 12h4l1.3 2h1.4L14 12h4" /><path d="M7 15h.01" /><path d="M9 13h.01" /><path d="M17 14h.01" /><path d="M15 16h.01" /><path d="M5.5 9h13A3.5 3.5 0 0 1 22 12.5v3A3.5 3.5 0 0 1 18.5 19c-1.4 0-2.2-.7-3.2-1.8H8.7C7.7 18.3 6.9 19 5.5 19A3.5 3.5 0 0 1 2 15.5v-3A3.5 3.5 0 0 1 5.5 9Z" /></Svg>; }
function DiamondIcon() { return <Svg className="h-8 w-8"><path d="M6 3h12l4 6-10 12L2 9l4-6Z" /><path d="M2 9h20" /><path d="m12 21 4-12-4-6-4 6 4 12Z" /></Svg>; }
function GiftIcon() { return <Svg className="h-8 w-8"><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5A2.5 2.5 0 1 1 10 4.5C10 6 12 7 12 7Z" /><path d="M12 7h4.5A2.5 2.5 0 1 0 14 4.5C14 6 12 7 12 7Z" /></Svg>; }
function CrownIcon() { return <Svg className="h-8 w-8"><path d="m3 8 4 4 5-8 5 8 4-4-2 11H5L3 8Z" /><path d="M5 19h14" /></Svg>; }
function BoltIcon() { return <Svg className="h-8 w-8"><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" /></Svg>; }
function ShieldIcon() { return <Svg className="h-8 w-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></Svg>; }
function UserIcon() { return <Svg><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="7" r="4" /></Svg>; }
function MailIcon() { return <Svg><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></Svg>; }
function LockIcon() { return <Svg><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Svg>; }
function EyeIcon() { return <Svg><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></Svg>; }
function GlobeIcon() { return <Svg><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20" /><path d="M12 2a15.3 15.3 0 0 0 0 20" /></Svg>; }
function ChevronDownIcon() { return <Svg><path d="m6 9 6 6 6-6" /></Svg>; }
function ShieldSmallIcon() { return <Svg className="h-4 w-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9.5 12 1.7 1.7 3.8-4" /></Svg>; }
function GoogleIcon() { return <span className="text-[20px] font-black text-[#4285f4]">G</span>; }
function FacebookIcon() { return <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877f2] text-[15px] font-black text-white">f</span>; }
function DiscordIcon() { return <Svg className="h-5 w-5 text-[#5865f2]"><path d="M8 12h.01" /><path d="M16 12h.01" /><path d="M8.5 17c1.2.6 2.3.9 3.5.9s2.3-.3 3.5-.9" /><path d="M7 7c3.2-1.3 6.8-1.3 10 0l1.2 8.2c-1.2.9-2.4 1.5-3.7 1.8l-.8-1.4" /><path d="M7 7 5.8 15.2c1.2.9 2.4 1.5 3.7 1.8l.8-1.4" /></Svg>; }
