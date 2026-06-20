"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";
import { useCartStore, type CartItem } from "@/lib/store";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onExploreGames?: () => void;
};

export default function CartDrawer({ open, onClose, onExploreGames }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!open) return null;

  const exploreGames = () => {
    onClose();
    if (onExploreGames) {
      onExploreGames();
      return;
    }
    window.location.href = "/jeux";
  };

  return (
    <>
      <button className="cart-drawer-backdrop" aria-label="Fermer le panier" type="button" onClick={onClose} />
      <aside className="cart-drawer" aria-label="Panier">
        <div className="cart-drawer-head">
          <span>
            <strong>Panier</strong>
            <small>{cartCount} article{cartCount > 1 ? "s" : ""}</small>
          </span>
          <button type="button" aria-label="Fermer le panier" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty-state">
            <CartIcon />
            <strong>Ton panier est vide</strong>
            <small>Ajoute un jeu ou une carte cadeau pour commencer.</small>
            <button type="button" onClick={exploreGames}>
              Explorer les jeux
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <CartDrawerItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  onQuantity={updateQuantity}
                />
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Total</span>
                <strong>{formatEuro(cartTotal)}</strong>
              </div>
              <Link href="/panier" onClick={onClose}>
                Commander
              </Link>
              <button type="button" onClick={clearCart}>
                Vider le panier
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

function CartDrawerItem({ item, onRemove, onQuantity }: { item: CartItem; onRemove: (id: string) => void; onQuantity: (id: string, quantity: number) => void }) {
  return (
    <article className="cart-drawer-item">
      <span className="cart-item-thumb" style={!item.image && item.art ? { background: item.art } as CSSProperties : undefined}>
        {item.image ? (
          <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <CartIcon />
        )}
      </span>
      <span className="cart-item-main">
        <strong>{item.name}</strong>
        <small>{item.denomination}</small>
        <span className="cart-item-bottom">
          <b>{formatEuro(item.price * item.quantity)}</b>
          <span className="cart-item-controls">
            <button type="button" aria-label={`Diminuer ${item.name}`} disabled={item.quantity <= 1} onClick={() => onQuantity(item.id, item.quantity - 1)}>-</button>
            <em>{item.quantity}</em>
            <button type="button" aria-label={`Augmenter ${item.name}`} onClick={() => onQuantity(item.id, item.quantity + 1)}>+</button>
          </span>
          <button className="cart-remove" type="button" aria-label={`Retirer ${item.name}`} onClick={() => onRemove(item.id)}>
            Retirer
          </button>
        </span>
      </span>
    </article>
  );
}

function CartIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6h15l-2 8H8L6 3H3" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
