export interface Denomination {
  label: string;
  price: number;
}

export interface GameRegion {
  id: string;
  name: string;
  deliveryTime: string;
  multiplier: number;
  feeLabel: string;
  helper: string;
}

export interface Game {
  slug: string;
  name: string;
  bg: string;
  image?: string;
  logo: string;
  currency: string;
  denominations: Denomination[];
  regions: GameRegion[];
  description: string;
}

export interface GiftCard {
  slug: string;
  name: string;
  bg: string;
  image?: string;
  denominations: Denomination[];
  description: string;
}

const defaultRegions: GameRegion[] = [
  {
    id: "africa",
    name: "Afrique",
    deliveryTime: "Instantanee (24/7)",
    multiplier: 1,
    feeLabel: "0 FCFA",
    helper: "Region conseillee pour les comptes Afrique.",
  },
  {
    id: "europe",
    name: "Europe",
    deliveryTime: "10 a 20 min",
    multiplier: 1.04,
    feeLabel: "+4%",
    helper: "Recommande pour les comptes crees en Europe.",
  },
  {
    id: "mena",
    name: "MENA",
    deliveryTime: "15 a 30 min",
    multiplier: 0.96,
    feeLabel: "-4%",
    helper: "Tarifs ajustes pour Afrique du Nord et Moyen-Orient.",
  },
  {
    id: "americas",
    name: "Ameriques",
    deliveryTime: "20 a 35 min",
    multiplier: 1.08,
    feeLabel: "+8%",
    helper: "Pour les comptes localises Amerique du Nord ou Latam.",
  },
];

export const games: Game[] = [
  {
    slug: "call-of-duty",
    name: "Call of Duty",
    bg: "linear-gradient(160deg, #14181f 0%, #29364a 48%, #05070b 100%)",
    image: "/image copy 7.png",
    logo: "COD",
    currency: "CP",
    description: "Recharge tes CP Call of Duty pour obtenir passes, skins, packs et contenus premium.",
    regions: defaultRegions,
    denominations: [
      { label: "80 CP", price: 1.49 },
      { label: "420 CP", price: 5.99 },
      { label: "880 CP", price: 11.99 },
      { label: "2400 CP", price: 29.99 },
      { label: "5000 CP", price: 59.99 },
      { label: "10800 CP", price: 119.99 },
    ],
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    bg: "linear-gradient(160deg, #FF6B35 0%, #E8450A 45%, #6B1400 100%)",
    image: "/freefire.png",
    logo: "🔥",
    currency: "Diamants",
    description: "Recharge ton compte Free Fire avec des Diamants. Profite des skins, personnages et passes de saison.",
    regions: defaultRegions,
    denominations: [
      { label: "100 Diamants", price: 1.99 },
      { label: "210 Diamants", price: 3.99 },
      { label: "520 Diamants", price: 8.99 },
      { label: "1060 Diamants", price: 17.99 },
      { label: "2180 Diamants", price: 34.99 },
      { label: "5600 Diamants", price: 84.99 },
    ],
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    bg: "linear-gradient(160deg, #1E4DB7 0%, #0D2260 45%, #04091A 100%)",
    logo: "⚔️",
    currency: "Diamonds",
    description: "Recharge tes Diamonds Mobile Legends: Bang Bang pour débloquer héros, skins et emotes exclusifs.",
    regions: defaultRegions,
    denominations: [
      { label: "86 Diamonds", price: 1.99 },
      { label: "172 Diamonds", price: 3.99 },
      { label: "257 Diamonds", price: 5.99 },
      { label: "514 Diamonds", price: 10.99 },
      { label: "1048 Diamonds", price: 20.99 },
      { label: "2195 Diamonds", price: 39.99 },
    ],
  },
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    bg: "linear-gradient(160deg, #C8A000 0%, #7A5500 45%, #2E1F00 100%)",
    image: "/pubg-mobile-card.png",
    logo: "🎯",
    currency: "UC",
    description: "Recharge ton compte PUBG Mobile avec des UC. Achète des tenues royales, véhicules et caisses.",
    regions: defaultRegions,
    denominations: [
      { label: "60 UC", price: 1.99 },
      { label: "120 UC", price: 3.99 },
      { label: "325 UC", price: 9.99 },
      { label: "660 UC", price: 19.99 },
      { label: "1800 UC", price: 49.99 },
      { label: "3850 UC", price: 99.99 },
    ],
  },
  {
    slug: "honor-of-kings",
    name: "Honor of Kings",
    bg: "linear-gradient(160deg, #7C3AED 0%, #4C1D95 45%, #1A0535 100%)",
    logo: "👑",
    currency: "Tokens",
    description: "Recharge tes Tokens Honor of Kings pour obtenir des skins légendaires et des héros exclusifs.",
    regions: defaultRegions,
    denominations: [
      { label: "100 Tokens", price: 1.99 },
      { label: "200 Tokens", price: 3.99 },
      { label: "500 Tokens", price: 9.99 },
      { label: "1000 Tokens", price: 18.99 },
    ],
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    bg: "linear-gradient(160deg, #0EA5E9 0%, #0369A1 45%, #012030 100%)",
    image: "/genshin-impact-card.png",
    logo: "✨",
    currency: "Cristaux Genèse",
    description: "Recharge tes Cristaux Genèse Genshin Impact pour invoquer des personnages et armes 5 étoiles.",
    regions: defaultRegions,
    denominations: [
      { label: "60 Cristaux", price: 1.99 },
      { label: "300 Cristaux", price: 4.99 },
      { label: "980 Cristaux", price: 14.99 },
      { label: "1980 Cristaux", price: 29.99 },
      { label: "3280 Cristaux", price: 49.99 },
      { label: "6480 Cristaux", price: 99.99 },
    ],
  },
  {
    slug: "fortnite",
    name: "Fortnite",
    bg: "linear-gradient(160deg, #17B8FF 0%, #1765E8 44%, #06235F 100%)",
    image: "/image copy 9.png",
    logo: "FN",
    currency: "V-Bucks",
    description: "Recharge tes V-Bucks Fortnite pour obtenir le Passe de combat, des skins, emotes et packs premium.",
    regions: defaultRegions,
    denominations: [
      { label: "1000 V-Bucks", price: 8.99 },
      { label: "2800 V-Bucks", price: 22.99 },
      { label: "5000 V-Bucks", price: 36.99 },
      { label: "13500 V-Bucks", price: 89.99 },
    ],
  },
  {
    slug: "fc-mobile",
    name: "FC Mobile",
    bg: "linear-gradient(160deg, #0B2218 0%, #0C7C4A 46%, #071225 100%)",
    image: "/image copy 10.png",
    logo: "FC",
    currency: "FC Points",
    description: "Recharge tes FC Points FC Mobile pour obtenir packs, joueurs, passes et contenus premium.",
    regions: defaultRegions,
    denominations: [
      { label: "100 FC Points", price: 1.99 },
      { label: "500 FC Points", price: 7.99 },
      { label: "1050 FC Points", price: 14.99 },
      { label: "2200 FC Points", price: 29.99 },
      { label: "5750 FC Points", price: 74.99 },
    ],
  },
  {
    slug: "brawl-stars",
    name: "Brawl Stars",
    bg: "linear-gradient(160deg, #FFD447 0%, #F06A22 44%, #641B7E 100%)",
    image: "/image copy 12.png",
    logo: "BS",
    currency: "Gemmes",
    description: "Recharge tes Gemmes Brawl Stars pour obtenir skins, Brawl Pass, offres speciales et contenus premium.",
    regions: defaultRegions,
    denominations: [
      { label: "30 Gemmes", price: 2.99 },
      { label: "80 Gemmes", price: 6.99 },
      { label: "170 Gemmes", price: 13.99 },
      { label: "360 Gemmes", price: 27.99 },
      { label: "950 Gemmes", price: 69.99 },
      { label: "2000 Gemmes", price: 139.99 },
    ],
  },
  {
    slug: "blood-strike",
    name: "Blood Strike",
    bg: "linear-gradient(160deg, #3b0710 0%, #931422 48%, #130308 100%)",
    image: "/blood-strike-card.png",
    logo: "BS",
    currency: "Gold",
    description: "Recharge ton Gold Blood Strike pour debloquer armes, apparences et contenus competitifs.",
    regions: defaultRegions,
    denominations: [
      { label: "100 Gold", price: 1.49 },
      { label: "300 Gold", price: 3.99 },
      { label: "500 Gold", price: 6.49 },
      { label: "1000 Gold", price: 12.49 },
      { label: "2000 Gold", price: 23.99 },
      { label: "5000 Gold", price: 54.99 },
    ],
  },
  {
    slug: "roblox",
    name: "Roblox",
    bg: "linear-gradient(160deg, #3366ff 0%, #173cbd 46%, #071a5c 100%)",
    image: "/roblox-banner.png",
    logo: "R",
    currency: "Robux",
    description: "Recharge ton compte Roblox avec des Robux pour acheter accessoires, experiences premium et contenus de createurs.",
    regions: defaultRegions,
    denominations: [
      { label: "400 Robux", price: 4.99 },
      { label: "800 Robux", price: 9.99 },
      { label: "1700 Robux", price: 19.99 },
      { label: "4500 Robux", price: 49.99 },
      { label: "10000 Robux", price: 99.99 },
    ],
  },
];

export const giftCards: GiftCard[] = [
  {
    slug: "google-play",
    name: "Google Play",
    bg: "linear-gradient(135deg,#064b9f,#071a3b 45%,#9a0d93)",
    description: "Carte cadeau Google Play pour acheter des applis, jeux, films et musique sur le Play Store.",
    denominations: [
      { label: "5€", price: 5.49 },
      { label: "10€", price: 10.99 },
      { label: "15€", price: 15.99 },
      { label: "25€", price: 26.49 },
      { label: "50€", price: 52.99 },
      { label: "100€", price: 104.99 },
    ],
  },
  {
    slug: "netflix",
    name: "Netflix",
    bg: "linear-gradient(135deg,#26030b,#8d0812 50%,#070407)",
    description: "Carte cadeau Netflix pour profiter de films et séries en illimité sans carte bancaire.",
    denominations: [
      { label: "15€", price: 15.99 },
      { label: "30€", price: 31.49 },
      { label: "60€", price: 61.99 },
    ],
  },
  {
    slug: "playstation",
    name: "PlayStation",
    bg: "linear-gradient(135deg,#0752d5,#06154f)",
    description: "Carte cadeau PlayStation Store pour acheter des jeux PS4/PS5, DLC et abonnements PS Plus.",
    denominations: [
      { label: "10€", price: 10.99 },
      { label: "20€", price: 20.99 },
      { label: "50€", price: 52.49 },
      { label: "100€", price: 103.99 },
    ],
  },
  {
    slug: "xbox",
    name: "Xbox",
    bg: "linear-gradient(135deg,#0e8e24,#074e12)",
    description: "Carte cadeau Xbox pour acheter des jeux, DLC et abonnements Game Pass sur Xbox et PC.",
    denominations: [
      { label: "5€", price: 5.49 },
      { label: "10€", price: 10.99 },
      { label: "15€", price: 15.99 },
      { label: "25€", price: 25.99 },
      { label: "50€", price: 51.99 },
    ],
  },
  {
    slug: "spotify",
    name: "Spotify",
    bg: "linear-gradient(135deg,#04201a,#04100f)",
    image: "/image copy 11.png",
    description: "Carte cadeau Spotify Premium pour écouter de la musique sans pub et en mode hors-ligne.",
    denominations: [
      { label: "10€", price: 10.99 },
      { label: "30€", price: 31.49 },
      { label: "60€", price: 61.99 },
    ],
  },
  {
    slug: "pubg-mobile-gift",
    name: "PUBG Mobile",
    bg: "linear-gradient(135deg,#111827,#3b2a12 48%,#d8f833)",
    image: "/image copy 13.png",
    description: "Carte cadeau PUBG Mobile pour acheter UC, packs, passes et contenus premium.",
    denominations: [
      { label: "Carte PUBG 5€", price: 5.49 },
      { label: "Carte PUBG 10€", price: 10.99 },
      { label: "Carte PUBG 20€", price: 20.99 },
      { label: "Carte PUBG 50€", price: 52.49 },
    ],
  },
];

export function getGame(slug: string) {
  return games.find((g) => g.slug === slug);
}

export function getGiftCard(slug: string) {
  return giftCards.find((g) => g.slug === slug);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { games: [], giftCards: [] };
  return {
    games: games.filter((g) => g.name.toLowerCase().includes(q)),
    giftCards: giftCards.filter((g) => g.name.toLowerCase().includes(q)),
  };
}
