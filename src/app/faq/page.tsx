import Link from "next/link";
import SiteNavbar from "@/components/SiteNavbar";

const faqs = [
  {
    question: "Comment recharger un jeu ?",
    answer:
      "Choisis ton jeu sur NEXY SHOP, entre correctement ton ID joueur, sélectionne le montant de recharge souhaité, puis valide ta commande. Après le paiement, l’équipe traite la recharge et les crédits sont envoyés directement sur le compte indiqué.",
  },
  {
    question: "Combien de temps prend la livraison ?",
    answer:
      "La livraison prend généralement entre 1 et 30 minutes après validation du paiement. Le délai peut varier légèrement selon le jeu, le serveur, le volume de commandes ou la confirmation du paiement.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Nous acceptons une grande variété de moyens de paiement locaux afin de faciliter les commandes selon ton pays ou ta région. Si tu ne vois pas ton moyen de paiement habituel au moment de commander, contacte le support WhatsApp pour être guidé rapidement.",
  },
  {
    question: "Comment recevoir ma carte cadeau ?",
    answer:
      "Après l’achat, ta carte cadeau est envoyée sous forme de code ou de détail d’activation selon le produit choisi. Vérifie bien tes informations avant de payer afin que l’équipe puisse te livrer rapidement et sans erreur.",
  },
  {
    question: "Puis-je être remboursé ?",
    answer:
      "Oui, une demande de remboursement peut être étudiée si la commande n’a pas encore été livrée ou si un problème vérifiable empêche la livraison. Pour faire une demande, contacte directement le service client avec ton numéro de commande, le produit acheté et la preuve de paiement.",
  },
  {
    question: "Que faire si ma commande échoue ?",
    answer:
      "Si ta commande échoue, ne relance pas plusieurs paiements immédiatement. Vérifie ton ID joueur, ton réseau et la confirmation de paiement, puis contacte le support avec les détails de la commande. L’équipe vérifiera la situation et t’indiquera la meilleure solution.",
  },
  {
    question: "Comment contacter le support ?",
    answer:
      "Tu peux contacter le support via le bouton WhatsApp en bas à droite du site. Il permet d’ouvrir directement la conversation avec le service client NEXY SHOP pour une aide rapide sur une commande, un paiement ou une demande de remboursement.",
  },
];

export default function FAQPage() {
  return (
    <main className="faq-page nexy-shop-page">
      <div className="desktop-shell faq-shell">
        <SiteNavbar />

        <section className="faq-hero">
          <div className="faq-container">
            <span className="faq-kicker">Centre d&apos;aide</span>
            <h1>Questions fréquentes</h1>
            <p>
              Trouve rapidement les réponses importantes avant de commander :
              recharge, livraison, paiement, carte cadeau, remboursement et support.
            </p>
          </div>
        </section>

        <section className="faq-content" aria-label="Questions fréquentes NEXY SHOP">
          <div className="faq-container faq-layout">
            <div className="faq-panel">
              {faqs.map((item, index) => (
                <details className="faq-item" key={item.question} open={index === 0}>
                  <summary>
                    <span>{item.question}</span>
                    <ChevronIcon />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>

            <aside className="faq-contact-card">
              <span className="faq-contact-icon">
                <SupportIcon />
              </span>
              <h2>Besoin d&apos;une aide directe ?</h2>
              <p>
                Pour une commande urgente, une livraison en attente ou une demande de remboursement,
                contacte le support NEXY SHOP sur WhatsApp.
              </p>
              <Link href="https://wa.me/qr/Z5IJSITCHOHFE1" target="_blank" rel="noopener noreferrer">
                Contacter le support
              </Link>
            </aside>
          </div>
        </section>

        <footer className="site-footer faq-footer">
          <a className="brand-lockup footer-brand" href="#" aria-label="Nexy Shop">
            <span>
              <strong>Nexy <b>Shop</b></strong>
              <small>Recharges jeux & cartes cadeaux</small>
            </span>
          </a>
          <p>Livraison rapide, paiement securise et support disponible quand tu en as besoin.</p>
        </footer>
      </div>
    </main>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a8 8 0 0 0-8 8v3a3 3 0 0 0 3 3h1v-6H6a6 6 0 0 1 12 0h-2v6h1a3 3 0 0 0 3-3v-3a8 8 0 0 0-8-8Z" />
      <path d="M9 19h3.5A3.5 3.5 0 0 0 16 15.5" />
    </svg>
  );
}
