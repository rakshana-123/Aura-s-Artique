"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Image as ImageIcon, ShoppingBag } from "lucide-react";

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

export default function CreatorStorefront() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const [products, setProducts] = useState<CreatorProduct[]>([]);

  useEffect(() => {
    // Attempt to load published products from localStorage
    const savedProducts = localStorage.getItem("creator_products");
    const activeHandle = localStorage.getItem("creator_handle");
    
    if (savedProducts && activeHandle === handle) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse creator products", e);
      }
    } else {
      // Return fallback templates if handle doesn't match the current browser session creator
      setProducts([
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
        },
        {
          id: "cp-3",
          name: "Aura's Warm Matte Frame",
          baseName: "Acrylic Desktop Panel",
          basePrice: 250,
          layoutScale: "Square",
          layoutPrice: 80,
          resellerMargin: 120,
          customText: "Cozy Memories"
        }
      ]);
    }
  }, [handle]);

  return (
    <div className="py-6 flex flex-col gap-10">
      {/* Return link */}
      <div>
        <Link 
          href="/"
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Main Storefront
        </Link>
      </div>

      {/* Creator Profile Banner */}
      <section className="bg-white border border-black/5 rounded-2xl p-8 shadow-diffused flex flex-col items-center text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-pastel-pink/40 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-soft-lavender/40 rounded-full blur-xl"></div>
        
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-100 to-indigo-100 border border-white flex items-center justify-center font-serif text-3xl font-black text-rose-700 shadow-md relative z-10">
          {handle ? handle.charAt(0).toUpperCase() : "C"}
        </div>
        
        <h2 className="font-serif text-3xl font-bold text-neutral-800 mt-4 relative z-10">
          @{handle || "creator"}&apos;s Boutique Studio
        </h2>
        
        <p className="text-neutral-500 font-sans text-sm mt-1 max-w-md relative z-10">
          Curated selection of physical polaroid frames and layout prints. Select a design below to personalize with your own image and checkout.
        </p>

        <div className="inline-flex items-center gap-2 mt-4 bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Verified Creator Page</span>
        </div>
      </section>

      {/* Products list grid */}
      <section className="flex flex-col gap-6">
        <h3 className="font-serif text-2xl font-bold text-neutral-800">
          Designs by @{handle}
        </h3>
        
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white/20 rounded-2xl border border-dashed border-neutral-300">
            <ImageIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-sans italic">
              This creator storefront hasn&apos;t published any custom layouts yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((prod) => {
              // Formula: customer = (base + custom + margin) * 1.18
              const basePrice = prod.basePrice + prod.layoutPrice;
              const unitCostExclTax = basePrice + 50 + prod.resellerMargin;
              const customerPrice = unitCostExclTax * 1.18;
              
              // Frame gradient background representation
              const gradientStr = prod.basePrice === 250 
                ? "from-sky-50 to-indigo-50/50 border-sky-100" 
                : "from-amber-50 to-yellow-50/50 border-amber-100";

              return (
                <div 
                  key={prod.id}
                  className="bg-white border border-black/5 rounded-2xl p-4 shadow-diffused flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 min-h-[380px]"
                >
                  <div className="flex flex-col gap-4">
                    {/* Visual box representation */}
                    <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-tr ${gradientStr} border flex items-center justify-center p-3 relative shadow-inner overflow-hidden`}>
                      <div className="w-[85px] aspect-[4/5] bg-white border border-neutral-200/50 rounded p-1.5 shadow-md transform rotate-[-3deg]">
                        <div className="w-full aspect-square bg-stone-100 rounded flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-neutral-300" />
                        </div>
                        <div className="h-4 bg-stone-100/60 mt-1.5 w-10 mx-auto rounded-sm"></div>
                      </div>
                      
                      {/* Floating Badge */}
                      <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-neutral-100 text-neutral-600">
                        {prod.layoutScale}
                      </span>
                    </div>

                    {/* Metadata details */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400">Custom Template</span>
                      <h4 className="font-serif text-base font-bold text-neutral-800 leading-tight">
                        {prod.name}
                      </h4>
                      <p className="text-neutral-500 text-xs font-light leading-relaxed">
                        Features the {prod.baseName} base material with a dynamic {prod.layoutScale} ratio layout. Default text: &quot;{prod.customText}&quot;.
                      </p>
                    </div>
                  </div>

                  {/* Buy / Customize action row */}
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-4">
                    <div className="flex flex-col font-sans">
                      <span className="text-[9px] uppercase text-neutral-400 font-semibold">Total Price</span>
                      <span className="text-base font-extrabold text-neutral-800">₹{customerPrice.toFixed(0)}</span>
                    </div>

                    <button
                      onClick={() => {
                        // Preload all settings to customizer
                        sessionStorage.setItem("editor_base_product_id", prod.basePrice === 250 ? "1" : "2");
                        sessionStorage.setItem("editor_preview_text", prod.customText);
                        sessionStorage.setItem("editor_preview_size", prod.layoutScale);
                        // Route to customizer
                        router.push(`/customizer?margin=${prod.resellerMargin}`);
                      }}
                      className="py-2.5 px-4 bg-pastel-pink hover:bg-rose-100 text-rose-700 border border-rose-200/50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Customize & Buy</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
