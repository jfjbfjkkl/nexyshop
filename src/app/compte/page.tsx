"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import SiteNavbar from "@/components/SiteNavbar";

type AccountPanel = "login" | "signup";

const passwordRules = [
  { label: "8 caracteres minimum", test: (value: string) => value.length >= 8 },
  { label: "Une majuscule", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Un chiffre", test: (value: string) => /\d/.test(value) },
];

export default function AccountPage() {
  const [activePanel, setActivePanel] = useState<AccountPanel>("login");
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [signupPassword, setSignupPassword] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const completedRules = useMemo(
    () => passwordRules.filter((rule) => rule.test(signupPassword)).length,
    [signupPassword],
  );
  const passwordScore = Math.round((completedRules / passwordRules.length) * 100);

  const submitDemoForm = (event: FormEvent<HTMLFormElement>, label: string) => {
    event.preventDefault();
    setFormMessage(`${label} pret. La connexion au serveur sera branchee a la prochaine etape.`);
  };

  return (
    <main className="account-page">
      <SiteNavbar activeView="all" />

      <section className="account-shell" aria-label="Compte NEXY SHOP">
        <div className="account-intro">
          <Link className="account-back" href="/">
            <ArrowLeftIcon />
            Boutique
          </Link>
          <span className="account-kicker">Espace compte</span>
          <h1>Gere tes commandes NEXY SHOP avec un acces clair et securise.</h1>
          <p>
            Connecte-toi pour retrouver ton panier, suivre tes recharges et garder tes informations pretes pour les prochains achats.
          </p>

          <div className="account-preview" aria-hidden="true">
            <span className="account-preview-orbit orbit-one" />
            <span className="account-preview-orbit orbit-two" />
            <div className="account-preview-card main-card">
              <span><ShieldIcon /></span>
              <strong>Compte protege</strong>
              <small>Verification claire avant chaque action sensible.</small>
            </div>
            <div className="account-preview-card small-card">
              <span><BoltIcon /></span>
              <strong>Commande rapide</strong>
            </div>
          </div>

          <div className="account-trust-row" aria-label="Avantages du compte">
            <span><ClockIcon /> Suivi rapide</span>
            <span><ShieldIcon /> Donnees protegees</span>
            <span><HeadsetIcon /> Support humain</span>
          </div>
        </div>

        <div className="account-workspace">
          <div className="account-mobile-switch" aria-label="Choisir une action">
            <button
              className={activePanel === "login" ? "is-active" : ""}
              type="button"
              onClick={() => setActivePanel("login")}
            >
              Se connecter
            </button>
            <button
              className={activePanel === "signup" ? "is-active" : ""}
              type="button"
              onClick={() => setActivePanel("signup")}
            >
              Creer un compte
            </button>
          </div>

          <section className={`account-card login-card ${activePanel === "login" ? "is-active" : ""}`}>
            <div className="account-card-head">
              <span><UserIcon /></span>
              <div>
                <small>Deja client</small>
                <h2>Se connecter</h2>
              </div>
            </div>

            <form className="account-form" onSubmit={(event) => submitDemoForm(event, "Connexion")}>
              <label className="account-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="exemple@email.com" autoComplete="email" required />
              </label>

              <label className="account-field">
                <span>Mot de passe</span>
                <div className="account-password-field">
                  <input
                    type={loginPasswordVisible ? "text" : "password"}
                    name="password"
                    placeholder="Ton mot de passe"
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={() => setLoginPasswordVisible((visible) => !visible)}>
                    {loginPasswordVisible ? "Masquer" : "Voir"}
                  </button>
                </div>
              </label>

              <div className="account-form-row">
                <label className="account-check">
                  <input type="checkbox" />
                  <span>Rester connecte</span>
                </label>
                <a href="#">Mot de passe oublie ?</a>
              </div>

              <button className="account-submit" type="submit">
                Connexion
                <ArrowRightIcon />
              </button>
            </form>

            <button className="account-card-link" type="button" onClick={() => setActivePanel("signup")}>
              Je n'ai pas encore de compte
            </button>
          </section>

          <section className={`account-card signup-card ${activePanel === "signup" ? "is-active" : ""}`}>
            <div className="account-card-head">
              <span><SparkIcon /></span>
              <div>
                <small>Nouveau client</small>
                <h2>Creer mon compte</h2>
              </div>
            </div>

            <form className="account-form" onSubmit={(event) => submitDemoForm(event, "Creation du compte")}>
              <label className="account-field">
                <span>Nom</span>
                <input type="text" name="name" placeholder="Ton nom" autoComplete="name" required />
              </label>

              <label className="account-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="ton@email.com" autoComplete="email" required />
              </label>

              <label className="account-field">
                <span>Creer un mot de passe</span>
                <div className="account-password-field">
                  <input
                    type={signupPasswordVisible ? "text" : "password"}
                    name="new-password"
                    placeholder="Choisis un mot de passe solide"
                    autoComplete="new-password"
                    value={signupPassword}
                    onChange={(event) => setSignupPassword(event.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setSignupPasswordVisible((visible) => !visible)}>
                    {signupPasswordVisible ? "Masquer" : "Voir"}
                  </button>
                </div>
              </label>

              <div className="account-password-meter" aria-label="Qualite du mot de passe">
                <span style={{ "--score": `${passwordScore}%` } as CSSProperties} />
              </div>

              <div className="account-rule-grid">
                {passwordRules.map((rule) => {
                  const isValid = rule.test(signupPassword);
                  return (
                    <span className={isValid ? "is-valid" : ""} key={rule.label}>
                      <CheckIcon />
                      {rule.label}
                    </span>
                  );
                })}
              </div>

              <label className="account-check consent">
                <input type="checkbox" required />
                <span>J'accepte les conditions et les notifications utiles sur mes commandes.</span>
              </label>

              <button className="account-submit signup-submit" type="submit">
                Creer mon compte
                <ArrowRightIcon />
              </button>
            </form>

            <button className="account-card-link" type="button" onClick={() => setActivePanel("login")}>
              J'ai deja un compte
            </button>
          </section>

          {formMessage && (
            <p className="account-status" role="status">
              {formMessage}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function ArrowLeftIcon() {
  return <svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
}

function ArrowRightIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function BoltIcon() {
  return <svg viewBox="0 0 24 24"><path d="M13 2 4 14h8l-1 8 9-12h-8l1-8Z" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" /></svg>;
}

function ClockIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

function HeadsetIcon() {
  return <svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h4v6H6a2 2 0 0 1-2-2v-4Zm16 0h-4v6h2a2 2 0 0 0 2-2v-4ZM16 20c0 1-2 2-4 2" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></svg>;
}

function SparkIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 2 9.8 8.8 3 11l6.8 2.2L12 20l2.2-6.8L21 11l-6.8-2.2L12 2Z" /></svg>;
}

function UserIcon() {
  return <svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0" /><circle cx="12" cy="8" r="4" /></svg>;
}
