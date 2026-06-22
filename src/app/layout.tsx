import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import CustomerServiceBubble from "@/components/CustomerServiceBubble";
import ExperienceMotion from "@/components/ExperienceMotion";
import MobileBackButton from "@/components/MobileBackButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NEXY SHOP — Top Up tes jeux en un clic",
  description: "Recharges sécurisées, livraison instantanée, au meilleur prix. Free Fire, Mobile Legends, PUBG Mobile et bien plus.",
  keywords: "top up, recharge, free fire, mobile legends, pubg, cartes cadeaux, gaming",
  icons: {
    icon: "/image copy 15.png",
    shortcut: "/image copy 15.png",
    apple: "/image copy 15.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <ExperienceMotion />
        <MobileBackButton />
        <CustomerServiceBubble />
      </body>
    </html>
  );
}
