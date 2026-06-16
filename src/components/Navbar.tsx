"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Sparkles, Layout, Home, Heart, MessageSquare } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/#catalog", label: "Shop", icon: ShoppingBag },
    { href: "/customizer", label: "3D Customizer", icon: Sparkles },
    { href: "/creator", label: "Creator Portal", icon: Layout },
    { href: "/about", label: "About", icon: Heart },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4">
      <div className="bg-white/80 backdrop-blur-md border border-black/5 rounded-2xl px-6 py-3.5 flex items-center justify-between shadow-diffused">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-pastel-pink flex items-center justify-between p-1.5 transition-transform duration-300 group-hover:rotate-12">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
            Aura&apos;s Artique
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale(1.02) ${
                  isActive
                    ? "bg-pastel-pink/35 text-rose-700 font-semibold"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Cart & Reseller Handshake */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className={`relative p-2.5 rounded-xl border border-neutral-100 flex items-center justify-center transition-all hover:scale(1.05) ${
              pathname === "/cart"
                ? "bg-rose-50 text-rose-600 border-rose-100"
                : "bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-sans text-xs font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
