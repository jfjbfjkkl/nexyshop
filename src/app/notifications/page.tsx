"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import SiteNavbar from "@/components/SiteNavbar";

type NotificationCategory = "commandes" | "produits" | "compte" | "systeme";

type UserNotification = {
  id: number;
  category: NotificationCategory;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
};

const initialNotifications: UserNotification[] = [
  {
    id: 1,
    category: "commandes",
    title: "Commande confirmee",
    description: "Ta commande #NS-7492 est confirmee et en preparation.",
    date: "2026-06-22T08:35:00Z",
    isRead: false,
  },
  {
    id: 2,
    category: "commandes",
    title: "Paiement valide",
    description: "Le paiement de 24,99 EUR a ete valide avec succes.",
    date: "2026-06-21T18:12:00Z",
    isRead: true,
  },
  {
    id: 3,
    category: "commandes",
    title: "Commande livree",
    description: "Ta recharge Free Fire a ete livree instantanement.",
    date: "2026-06-21T11:07:00Z",
    isRead: false,
  },
  {
    id: 4,
    category: "produits",
    title: "Produit de retour en stock",
    description: "La carte cadeau Steam 10 EUR est a nouveau disponible.",
    date: "2026-06-20T16:30:00Z",
    isRead: false,
  },
  {
    id: 5,
    category: "produits",
    title: "Promotion active",
    description: "-15% sur une selection de cartes cadeaux pendant 24h.",
    date: "2026-06-20T09:00:00Z",
    isRead: true,
  },
  {
    id: 6,
    category: "compte",
    title: "Connexion recente",
    description: "Nouvelle connexion detectee depuis un appareil mobile.",
    date: "2026-06-19T22:41:00Z",
    isRead: true,
  },
  {
    id: 7,
    category: "compte",
    title: "Compte cree",
    description: "Bienvenue sur NEXY SHOP, ton espace compte est actif.",
    date: "2026-06-19T08:15:00Z",
    isRead: true,
  },
  {
    id: 8,
    category: "systeme",
    title: "Mise a jour du site",
    description: "Amelioration des performances et de la stabilite mobile.",
    date: "2026-06-18T13:10:00Z",
    isRead: false,
  },
  {
    id: 9,
    category: "systeme",
    title: "Maintenance planifiee",
    description: "Maintenance legere prevue dimanche de 02:00 a 03:00.",
    date: "2026-06-17T17:48:00Z",
    isRead: true,
  },
  {
    id: 10,
    category: "produits",
    title: "Produit ajoute aux favoris",
    description: "Tu suis maintenant PUBG Mobile 60 UC.",
    date: "2026-06-16T10:20:00Z",
    isRead: true,
  },
];

const filters: Array<{ key: "all" | NotificationCategory; label: string }> = [
  { key: "all", label: "Toutes" },
  { key: "commandes", label: "Commandes" },
  { key: "produits", label: "Produits" },
  { key: "compte", label: "Compte" },
  { key: "systeme", label: "Systeme" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [removingIds, setRemovingIds] = useState<number[]>([]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, item) => count + (item.isRead ? 0 : 1), 0),
    [notifications],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesFilter = activeFilter === "all" || item.category === activeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [notifications, activeFilter, normalizedQuery]);

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        return { ...item, isRead: true };
      }),
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  const removeNotification = (id: number) => {
    setRemovingIds((current) => (current.includes(id) ? current : [...current, id]));

    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
      setRemovingIds((current) => current.filter((itemId) => itemId !== id));
    }, 220);
  };

  const clearAllNotifications = () => {
    if (notifications.length === 0) return;
    setRemovingIds(notifications.map((item) => item.id));

    window.setTimeout(() => {
      setNotifications([]);
      setRemovingIds([]);
    }, 220);
  };

  const hasAnyNotifications = notifications.length > 0;
  const hasVisibleNotifications = filteredNotifications.length > 0;

  return (
    <main className="notifications-page">
      <SiteNavbar activeView="all" variant="light" />

      <section className="notifications-shell" aria-label="Page notifications">
        <header className="notifications-header">
          <div>
            <span className="notifications-kicker">Centre de notifications</span>
            <h1>Notifications</h1>
            <p>Retrouvez toutes les informations importantes concernant votre compte et vos commandes.</p>
          </div>
          <div className="notifications-overview" aria-label="Resume notifications">
            <span>
              <b>{notifications.length}</b>
              Total
            </span>
            <span>
              <b>{unreadCount}</b>
              Non lues
            </span>
          </div>
        </header>

        <section className="notifications-tools" aria-label="Recherche et filtres">
          <label className="notifications-search" aria-label="Rechercher une notification">
            <SearchIcon />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Rechercher une notification..."
            />
          </label>

          <div className="notifications-filters" role="tablist" aria-label="Filtres notifications">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={activeFilter === filter.key}
                className={activeFilter === filter.key ? "is-active" : ""}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="notifications-actions" aria-label="Actions globales">
            <button type="button" onClick={markAllAsRead} disabled={unreadCount === 0 || notifications.length === 0}>
              Marquer tout comme lu
            </button>
            <button type="button" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              Supprimer toutes les notifications
            </button>
          </div>
        </section>

        {!hasAnyNotifications && (
          <section className="notifications-empty" aria-live="polite">
            <div className="notifications-empty-illustration" aria-hidden="true">
              <BellIcon />
            </div>
            <h2>Aucune notification pour le moment.</h2>
            <p>Tout est a jour. Nous t'informerons ici des activites importantes de ton compte.</p>
            <Link href="/" className="notifications-home-link">Retour a l'accueil</Link>
          </section>
        )}

        {hasAnyNotifications && !hasVisibleNotifications && (
          <section className="notifications-empty small" aria-live="polite">
            <div className="notifications-empty-illustration" aria-hidden="true">
              <SearchIcon />
            </div>
            <h2>Aucun resultat</h2>
            <p>Aucune notification ne correspond a ta recherche ou au filtre selectionne.</p>
          </section>
        )}

        {hasVisibleNotifications && (
          <section className="notifications-list" aria-label="Liste des notifications">
            {filteredNotifications.map((item, index) => {
              const removing = removingIds.includes(item.id);

              return (
                <article
                  key={item.id}
                  className={`notification-card ${item.isRead ? "is-read" : "is-unread"} ${removing ? "is-removing" : ""}`}
                  style={{ "--notification-delay": `${Math.min(index, 10) * 35}ms` } as CSSProperties}
                >
                  <span className={`notification-icon ${item.category}`} aria-hidden="true">
                    <CategoryIcon category={item.category} />
                  </span>

                  <div className="notification-content">
                    <div className="notification-head">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      {!item.isRead && <span className="notification-unread-badge">Non lu</span>}
                    </div>

                    <div className="notification-meta">
                      <span>{labelForCategory(item.category)}</span>
                      <span>{formatDate(item.date)}</span>
                      <span>{formatTime(item.date)}</span>
                      <span className={`notification-status ${item.isRead ? "read" : "unread"}`}>
                        {item.isRead ? "Lu" : "Non lu"}
                      </span>
                    </div>
                  </div>

                  <div className="notification-actions" aria-label="Actions notification">
                    <button type="button" onClick={() => markAsRead(item.id)} disabled={item.isRead}>
                      Marquer comme lu
                    </button>
                    <button type="button" onClick={() => removeNotification(item.id)}>
                      Supprimer
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}

function labelForCategory(category: NotificationCategory) {
  if (category === "commandes") return "Commandes";
  if (category === "produits") return "Produits";
  if (category === "compte") return "Compte";
  return "Systeme";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function CategoryIcon({ category }: { category: NotificationCategory }) {
  if (category === "commandes") {
    return <PackageIcon />;
  }

  if (category === "produits") {
    return <TagIcon />;
  }

  if (category === "compte") {
    return <UserIcon />;
  }

  return <SparkIcon />;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></svg>;
}

function BellIcon() {
  return <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
}

function PackageIcon() {
  return <svg viewBox="0 0 24 24"><path d="m12 3 8 4.5-8 4.5L4 7.5 12 3Z" /><path d="M20 7.5V16.5L12 21l-8-4.5V7.5" /><path d="M12 12v9" /></svg>;
}

function TagIcon() {
  return <svg viewBox="0 0 24 24"><path d="M5 12V6.5A1.5 1.5 0 0 1 6.5 5H12l7 7-7 7H6.5A1.5 1.5 0 0 1 5 17.5V12Z" /><path d="M9 9.5h.01" /></svg>;
}

function UserIcon() {
  return <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>;
}

function SparkIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 2 9.8 8.8 3 11l6.8 2.2L12 20l2.2-6.8L21 11l-6.8-2.2L12 2Z" /></svg>;
}
