"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sliders, TrendingUp, Copy, Check, ExternalLink, 
  Plus, ShoppingBag, Layout, User, PlusCircle, Trash 
} from "lucide-react";

interface CreatorProduct {
  id: string;
  name: string;
  baseName: string;
  basePrice: number;
  layoutScale: string;
  layoutPrice: number;
  resellerMargin: number;
  customText: string;
}

export default function CreatorDashboard() {
  // Creator registration
  const [creatorHandle, setCreatorHandle] = useState("auras_prints");
  const [isRegistered, setIsRegistered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Profit Engine Simulator states
  const [simBasePrice, setSimBasePrice] = useState(250); // Acrylic Frame (250) or Glass Frame (400)
  const [simFilmPrice, setSimFilmPrice] = useState(50); // Square (50), Wide (90), Mini (50)
  const [resellerMargin, setResellerMargin] = useState(120); // Slider 0 - 300
  const [customizationFee, setCustomizationFee] = useState(50); // Standard custom image upload fee

  // Custom Product Creation
  const [prodName, setProdName] = useState("My Minimalist Layout");
  const [selectedBaseId, setSelectedBaseId] = useState(1);
  const [selectedLayoutId, setSelectedLayoutId] = useState(102); // Square
  const [prodCustomText, setProdCustomText] = useState("Live in the Moment");

  // Published creator products list
  const [myProducts, setMyProducts] = useState<CreatorProduct[]>([]);

  // Load creator state and products from localStorage
  useEffect(() => {
    const savedHandle = localStorage.getItem("creator_handle");
    if (savedHandle) {
      setCreatorHandle(savedHandle);
      setIsRegistered(true);
    }

    const savedProducts = localStorage.getItem("creator_products");
    if (savedProducts) {
      try {
        setMyProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse creator products", e);
      }
    } else {
      // Default initial mock items
      const initialProducts: CreatorProduct[] = [
        {
          id: "cp-1",
          name: "Vibes Only Mini Board",
          baseName: "Acrylic Desktop Panel",
          basePrice: 250,
          layoutScale: "Mini",
          layoutPrice: 50,
          resellerMargin: 100,
          customText: "Good Vibes Only"
        },
        {
          id: "cp-2",
          name: "Golden Hour Wide Landscape",
          baseName: "Retro Glass Frame",
          basePrice: 400,
          layoutScale: "Wide",
          layoutPrice: 90,
          resellerMargin: 150,
          customText: "Sunset Silhouette"
        }
      ];
      setMyProducts(initialProducts);
      localStorage.setItem("creator_products", JSON.stringify(initialProducts));
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorHandle.trim()) {
      const sanitized = creatorHandle.toLowerCase().replace(/[^a-z0-9_-]/g, "");
      localStorage.setItem("creator_handle", sanitized);
      setCreatorHandle(sanitized);
      setIsRegistered(true);
    }
  };

  const handleResetHandle = () => {
    localStorage.removeItem("creator_handle");
    setIsRegistered(false);
  };

  // Profit Engine Calculations (FR-3.2 Matrix)
  const gstRate = 0.18;
  const pBase = simBasePrice + simFilmPrice;
  const pCustomization = customizationFee;
  const subtotal = pBase + pCustomization + resellerMargin;
  const calculatedGst = subtotal * gstRate;
  const customerPrice = subtotal * (1 + gstRate);

  // Copy sharing link
  const copyStorefrontLink = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      const url = `${origin}/shop/${creatorHandle}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Add Product to Storefront
  const handlePublishProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const base = selectedBaseId === 1 
      ? { name: "Acrylic Desktop Panel", price: 250 } 
      : { name: "Retro Glass Frame", price: 400 };

    const layout = selectedLayoutId === 101 
      ? { scale: "Mini", price: 50 } 
      : selectedLayoutId === 103 
      ? { scale: "Wide", price: 90 } 
      : { scale: "Square", price: 50 };

    const newProd: CreatorProduct = {
      id: `cp-${Date.now()}`,
      name: prodName,
      baseName: base.name,
      basePrice: base.price,
      layoutScale: layout.scale,
      layoutPrice: layout.price,
      resellerMargin: resellerMargin,
      customText: prodCustomText
    };

    const updated = [newProd, ...myProducts];
    setMyProducts(updated);
    localStorage.setItem("creator_products", JSON.stringify(updated));
    
    // Reset product input fields
    setProdName("My Layout Configuration");
    setProdCustomText("Script Caption");
  };

  const handleDeleteProduct = (id: string) => {
    const updated = myProducts.filter(p => p.id !== id);
    setMyProducts(updated);
    localStorage.setItem("creator_products", JSON.stringify(updated));
  };

  return (
    <div className="py-4">
      {/* Page Title */}
      <div className="mb-8 border-b border-black/5 pb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500">Reseller & Social Profit Engine</span>
        <h1 className="font-serif text-4xl font-extrabold text-neutral-800 mt-1">Creator Dashboard</h1>
        <p className="text-neutral-500 text-sm font-sans mt-0.5">
          Assemble custom print mockups, set flexible markups, monitor checkouts, and share your store link.
        </p>
      </div>

      {!isRegistered ? (
        // Registration screen
        <div className="max-w-md mx-auto my-12 bg-white border border-neutral-200 rounded-2xl p-8 shadow-diffused text-center">
          <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-neutral-800">Launch Your Storefront</h2>
          <p className="text-xs text-neutral-500 font-sans mt-2 mb-6">
            Register your unique handle to generate creator storefront subroutes and sell personalized polaroid frame packages.
          </p>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Creator Handle</label>
              <div className="flex items-center border border-neutral-200 rounded-xl px-3 bg-stone-50/50 focus-within:border-rose-400 focus-within:ring-1 focus-within:ring-rose-200">
                <span className="text-xs text-neutral-400 font-mono font-medium">aurasartique.com/shop/</span>
                <input
                  type="text"
                  required
                  value={creatorHandle}
                  onChange={(e) => setCreatorHandle(e.target.value)}
                  placeholder="your_handle"
                  className="flex-1 py-3 pl-1 font-mono text-sm focus:outline-none bg-transparent text-neutral-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-3.5 rounded-xl text-xs transition-transform duration-200 hover:scale(1.02) flex items-center justify-center gap-2 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Creator Account</span>
            </button>
          </form>
        </div>
      ) : (
        // Active Dashboard
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Columns (Handle Registration & Profit Matrix) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Storefront Handle widget */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pastel-pink rounded-xl flex items-center justify-center text-rose-700">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-800">
                    Storefront: @{creatorHandle}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-mono select-all mt-0.5">
                    aurasartique.com/shop/{creatorHandle}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={copyStorefrontLink}
                  className="flex-1 md:flex-none border border-neutral-200 hover:bg-neutral-50 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-500" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
                <Link
                  href={`/shop/${creatorHandle}`}
                  className="p-2.5 rounded-xl border border-neutral-200 hover:bg-rose-50/20 hover:border-rose-200 text-rose-600 flex items-center justify-center"
                  title="View Storefront"
                >
                  <ExternalLink className="w-4.5 h-4.5" />
                </Link>
                <button
                  onClick={handleResetHandle}
                  className="text-xs text-neutral-400 hover:text-rose-600 font-sans hover:underline ml-2"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Profit Engine Matrix Simulator (FR-3.2) */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-neutral-500" />
                  Profit Margin Calculator
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                  GST 18% Compliant
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {/* 1. Base Materials Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Base Frame Material</label>
                    <select
                      value={simBasePrice}
                      onChange={(e) => setSimBasePrice(parseInt(e.target.value))}
                      className="bg-stone-50 border border-neutral-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-400 font-medium"
                    >
                      <option value={250}>Acrylic Floating Panel (₹250)</option>
                      <option value={400}>Retro Glass Frame (₹400)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Film Print Layout</label>
                    <select
                      value={simFilmPrice}
                      onChange={(e) => setSimFilmPrice(parseInt(e.target.value))}
                      className="bg-stone-50 border border-neutral-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-400 font-medium"
                    >
                      <option value={50}>Mini Film (₹50)</option>
                      <option value={50}>Classic Square (₹50)</option>
                      <option value={90}>Retro Wide (₹90)</option>
                    </select>
                  </div>
                </div>

                {/* 2. Customization Fee Toggle */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    <span>Specialized Customization Handling Fee</span>
                    <span className="font-sans text-neutral-700">₹{customizationFee}</span>
                  </div>
                  <select
                    value={customizationFee}
                    onChange={(e) => setCustomizationFee(parseInt(e.target.value))}
                    className="bg-stone-50 border border-neutral-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-400 font-medium"
                  >
                    <option value={50}>Standard Custom Image Upload (₹50)</option>
                    <option value={0}>No Custom Photo - Text/Color Only (₹0)</option>
                  </select>
                </div>

                {/* 3. Margin Slider (FR-3.1) */}
                <div className="flex flex-col gap-1.5 bg-rose-50/20 p-4 rounded-xl border border-rose-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-rose-800">Your Reseller Margin (M_reseller)</span>
                    <span className="font-extrabold text-rose-900 bg-white px-2 py-0.5 border border-rose-200 rounded">
                      ₹{resellerMargin} profit per unit
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={resellerMargin}
                    onChange={(e) => setResellerMargin(parseInt(e.target.value))}
                    className="w-full accent-rose-400 cursor-ew-resize h-1.5 rounded-lg bg-neutral-200 mt-2"
                  />
                  <span className="text-[10px] text-rose-600 mt-1 italic">
                    All retail collections apply 18% Goods & Services Tax (GST) on checkout.
                  </span>
                </div>

                {/* 4. Calculation Matrix (FR-3.2 Matrix) */}
                <div className="bg-stone-50/70 p-4 rounded-xl border border-neutral-100 flex flex-col gap-2 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Base supply cost (P_base = frame + film)</span>
                    <span>₹{pBase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Specialized handling fee (P_customization)</span>
                    <span>₹{pCustomization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Reseller markup allocation (M_reseller)</span>
                    <span className="text-emerald-700 font-semibold">+ ₹{resellerMargin}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-1.5 font-semibold text-neutral-700">
                    <span>Subtotal cost (excl. GST)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Goods & Services Tax (GST rate: 18%)</span>
                    <span>₹{calculatedGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-300 pt-2 font-bold text-sm text-neutral-800">
                    <span>Customer Retail Checkout Cost (P_customer)</span>
                    <span className="text-rose-700 text-base">₹{customerPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Trends Chart (FR-3.2 & MEESHO stats) */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused">
              <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-neutral-500" />
                Storefront Daily checkout trends
              </h3>
              
              {/* SVG mock graph */}
              <div className="w-full aspect-[3/1] bg-stone-50/50 rounded-xl border border-neutral-100 p-2 relative flex flex-col justify-between">
                {/* Simulated Chart Lines */}
                <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
                  
                  {/* Area fill */}
                  <path
                    d="M 10 70 Q 50 30 100 55 T 200 15 T 290 25 L 290 70 L 10 70 Z"
                    fill="rgba(255, 209, 220, 0.3)"
                  />
                  
                  {/* Trendline */}
                  <path
                    d="M 10 70 Q 50 30 100 55 T 200 15 T 290 25"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  
                  {/* Highlight dots */}
                  <circle cx="200" cy="15" r="3.5" fill="#f43f5e" />
                  <circle cx="290" cy="25" r="3.5" fill="#f43f5e" />
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[9px] uppercase tracking-wider font-semibold text-neutral-400 px-2 pt-1.5 border-t border-neutral-100">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu (Today)</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Stats dashboard cards */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-stone-50 border border-neutral-100 p-2.5 rounded-xl">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Units Sold</span>
                  <span className="text-base font-extrabold text-neutral-800 mt-0.5 block">14</span>
                </div>
                <div className="bg-stone-50 border border-neutral-100 p-2.5 rounded-xl">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Gross revenue</span>
                  <span className="text-base font-extrabold text-neutral-800 mt-0.5 block">₹5,420</span>
                </div>
                <div className="bg-stone-50 border border-neutral-100 p-2.5 rounded-xl">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Your earnings</span>
                  <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">₹1,680</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Publish Custom Configurations Drawer) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Publish Custom Configuration Form */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused">
              <h3 className="font-serif text-lg font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-3 mb-4">
                <Plus className="w-5 h-5 text-rose-500" />
                Publish Custom Configuration
              </h3>

              <form onSubmit={handlePublishProduct} className="flex flex-col gap-4">
                {/* Configuration Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Design Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Dreamy Pink Desktop layout"
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                {/* Base Product */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Base Product Material</label>
                  <select
                    value={selectedBaseId}
                    onChange={(e) => setSelectedBaseId(parseInt(e.target.value))}
                    className="bg-stone-50 border border-neutral-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-400 font-medium"
                  >
                    <option value={1}>Acrylic Desktop Panel (₹250)</option>
                    <option value={2}>Retro Glass Frame (₹400)</option>
                  </select>
                </div>

                {/* Frame Layout */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Layout Canvas Ratio</label>
                  <select
                    value={selectedLayoutId}
                    onChange={(e) => setSelectedLayoutId(parseInt(e.target.value))}
                    className="bg-stone-50 border border-neutral-200 p-2.5 rounded-xl text-xs focus:outline-none focus:border-rose-400 font-medium"
                  >
                    <option value={101}>Mini Film size (+ ₹50)</option>
                    <option value={102}>Classic Square 1:1 (+ ₹50)</option>
                    <option value={103}>Retro Wide landscape format (+ ₹90)</option>
                  </select>
                </div>

                {/* Default Text Caption */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Default Script Text</label>
                  <input
                    type="text"
                    value={prodCustomText}
                    onChange={(e) => setProdCustomText(e.target.value)}
                    placeholder="e.g. Wild & Free"
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="text-neutral-500 font-sans text-[11px] leading-normal pt-1 bg-rose-50/20 p-3.5 rounded-xl border border-rose-100/40">
                  <div className="flex justify-between font-bold text-rose-800 text-[11px]">
                    <span>Target Retail Price (excl. Tax)</span>
                    <span>₹{pBase + 50 + resellerMargin}</span>
                  </div>
                  <p className="mt-1 leading-normal text-[10px]">
                    Calculated using your current calculator margin setting of <strong>₹{resellerMargin}</strong>. Users will be able to customize their own image upon purchasing.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-neutral-800 hover:bg-neutral-900 text-white font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to My Storefront</span>
                </button>
              </form>
            </div>

            {/* List of Published Creator Configurations */}
            <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-diffused">
              <h3 className="font-serif text-lg font-bold text-neutral-800 border-b border-neutral-100 pb-3 mb-4 flex justify-between items-center">
                <span>Published Designs ({myProducts.length})</span>
                <span className="text-[10px] text-neutral-400 uppercase font-sans">Active on route</span>
              </h3>

              <div className="flex flex-col gap-3.5 max-h-[400px] overflow-y-auto pr-1">
                {myProducts.length === 0 ? (
                  <p className="text-center text-xs text-neutral-400 py-6 font-sans italic">
                    No custom configurations published yet. Create one above!
                  </p>
                ) : (
                  myProducts.map((prod) => {
                    const retailPrice = (prod.basePrice + prod.layoutPrice + 50 + prod.resellerMargin) * 1.18;
                    return (
                      <div 
                        key={prod.id} 
                        className="p-3 border border-neutral-100 rounded-xl hover:border-rose-200/50 bg-stone-50/30 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-neutral-800 leading-tight">{prod.name}</span>
                          <span className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                            {prod.baseName} ({prod.layoutScale}) &middot; &quot;{prod.customText}&quot;
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-rose-700">₹{retailPrice.toFixed(0)}</span>
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                              ₹{prod.resellerMargin} profit
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/customizer?baseProductId=${prod.basePrice === 250 ? 1 : 2}&size=${prod.layoutScale}&margin=${prod.resellerMargin}&text=${encodeURIComponent(prod.customText)}`}
                            className="p-2 border border-neutral-200 hover:bg-white text-neutral-600 rounded-lg hover:text-rose-600"
                            title="Edit / Buy"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 border border-neutral-200 hover:bg-rose-50 text-rose-600 rounded-lg"
                            title="Delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
