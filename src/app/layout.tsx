import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura's Artique | Snap, Polaroid & Frame Marketplace",
  description: "A tactile physical tabletop workspace offering customized polaroids, frames, and custom typography prints with real-time 3D configuration.",
  keywords: ["Polaroids", "Artistic Frames", "Creator Shop", "3D Photo Mockups", "Indie Creator Marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full desk-canvas flex flex-col text-neutral-800 antialiased">
        <CartProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
