export type PopularityProductType = "game" | "giftcard";
export type PopularityAction = "visit" | "cart" | "purchase";

type PopularityItem = {
  type: PopularityProductType;
  slug: string;
  visits: number;
  carts: number;
  purchases: number;
  updatedAt: number;
};

type PopularityStore = {
  day: string;
  products: Record<string, PopularityItem>;
};

const STORAGE_KEY = "nexyshop-daily-popularity-v1";

const actionField: Record<PopularityAction, keyof Pick<PopularityItem, "visits" | "carts" | "purchases">> = {
  visit: "visits",
  cart: "carts",
  purchase: "purchases",
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyStore(): PopularityStore {
  return { day: todayKey(), products: {} };
}

function readStore(): PopularityStore {
  if (typeof window === "undefined") return emptyStore();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();

    const parsed = JSON.parse(raw) as PopularityStore;
    if (parsed.day !== todayKey() || !parsed.products) return emptyStore();

    return parsed;
  } catch {
    return emptyStore();
  }
}

function writeStore(store: PopularityStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function productKey(type: PopularityProductType, slug: string) {
  return `${type}:${slug}`;
}

function score(item?: PopularityItem) {
  if (!item) return 0;
  return item.visits + item.carts * 4 + item.purchases * 8;
}

export function trackProductEvent(type: PopularityProductType, slug: string, action: PopularityAction, quantity = 1) {
  if (!slug || quantity <= 0) return;

  const store = readStore();
  const key = productKey(type, slug);
  const current =
    store.products[key] ??
    {
      type,
      slug,
      visits: 0,
      carts: 0,
      purchases: 0,
      updatedAt: Date.now(),
    };

  const field = actionField[action];
  store.products[key] = {
    ...current,
    [field]: current[field] + quantity,
    updatedAt: Date.now(),
  };

  writeStore(store);
}

export function sortByDailyPopularity<T>(
  items: T[],
  type: PopularityProductType,
  getSlug: (item: T) => string,
) {
  const store = readStore();

  return [...items].sort((a, b) => {
    const aScore = score(store.products[productKey(type, getSlug(a))]);
    const bScore = score(store.products[productKey(type, getSlug(b))]);

    if (aScore !== bScore) return bScore - aScore;
    return items.indexOf(a) - items.indexOf(b);
  });
}
