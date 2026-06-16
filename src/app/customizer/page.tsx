"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { 
  Upload, AlertCircle, CheckCircle2, 
  ShoppingBag, Plus, Minus 
} from "lucide-react";

// Dynamically import Three.js scene wrapper to avoid Next.js SSR document exceptions
const StudioCanvas = dynamic(() => import("@/components/StudioCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-neutral-900 rounded-2xl flex items-center justify-center text-white/50">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs uppercase tracking-widest animate-pulse font-sans">Initializing 3D Renderer...</span>
      </div>
    </div>
  )
});

// Color options
const COLOR_TINTS = [
  { name: "Warm White", hex: "#FAF9F6", label: "Classic Matte White" },
  { name: "Pastel Pink", hex: "#FFD1DC", label: "Blush Pink Accent" },
  { name: "Soft Lavender", hex: "#E6E6FA", label: "Dream Lavender" },
  { name: "Sage Green", hex: "#D4EDDA", label: "Mint Sage Accent" },
  { name: "Charcoal Matte", hex: "#2b2b2a", label: "Deep Editorial Grey" }
];

// Film templates details
const FILM_LAYOUTS = [
  { id: 101, name: "Retro Mini Frame", scale: "Mini", price: 50, desc: "Classic credit card footprint" },
  { id: 102, name: "Classic Square Frame", scale: "Square", price: 50, desc: "Ideal symmetrical 1:1 format" },
  { id: 103, name: "Retro Wide Frame", scale: "Wide", price: 90, desc: "Breathtaking landscape coverage" }
];

// Base items details
const BASE_PRODUCTS = [
  { id: 1, name: "Acrylic Desktop Panel", price: 250, desc: "Reflective floating border" },
  { id: 2, name: "Retro Glass Frame", price: 400, desc: "Dual panes with vintage border" }
];

export default function CustomizerStudio() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  // Customizer Configuration States
  const [selectedBase, setSelectedBase] = useState(BASE_PRODUCTS[0]);
  const [selectedLayout, setSelectedLayout] = useState(FILM_LAYOUTS[1]); // Default Square
  const [frameColor, setFrameColor] = useState(COLOR_TINTS[0]);
  const [materialType, setMaterialType] = useState<"acrylic" | "wood" | "matte">("matte");
  const [customText, setCustomText] = useState("Handwritten Text");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Resolution validation status
  const [resolutionCheck, setResolutionCheck] = useState<{
    status: "idle" | "validating" | "success" | "error";
    message: string;
    resolution: string;
  }>({ status: "idle", message: "", resolution: "" });

  const [quantity, setQuantity] = useState(1);
  const [resellerMargin, setResellerMargin] = useState(120); // Default Creator Margin

  // Check SessionStorage for preloaded values from storefront
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const preloadedImg = sessionStorage.getItem("editor_preview_img");
    const preloadedText = sessionStorage.getItem("editor_preview_text");
    const preloadedSize = sessionStorage.getItem("editor_preview_size");
    const preloadedBaseId = sessionStorage.getItem("editor_base_product_id");
    const queryMargin = search.get("margin");
    const queryText = search.get("text");
    const querySize = search.get("size");
    const queryBaseId = search.get("baseProductId");

    if (preloadedImg) {
      setImagePreview(preloadedImg);
      setResolutionCheck({
        status: "success",
        message: "High-resolution preloaded verification completed.",
        resolution: "Pre-validated (>= 1200x1200px)"
      });
      sessionStorage.removeItem("editor_preview_img");
    }
    if (preloadedText) {
      setCustomText(preloadedText);
      sessionStorage.removeItem("editor_preview_text");
    } else if (queryText) {
      setCustomText(queryText);
    }
    if (preloadedSize || querySize) {
      const match = FILM_LAYOUTS.find(l => l.scale === (preloadedSize || querySize));
      if (match) setSelectedLayout(match);
      sessionStorage.removeItem("editor_preview_size");
    }
    if (preloadedBaseId || queryBaseId) {
      const match = BASE_PRODUCTS.find(p => p.id === parseInt(preloadedBaseId || queryBaseId || ""));
      if (match) setSelectedBase(match);
      sessionStorage.removeItem("editor_base_product_id");
    }
    if (queryMargin) {
      const parsedMargin = Number(queryMargin);
      if (!Number.isNaN(parsedMargin)) {
        setResellerMargin(Math.max(0, Math.min(300, parsedMargin)));
      }
    }
  }, []);

  // Handle Photo uploading and dimension checks (FR-1.1)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResolutionCheck({ status: "validating", message: "Checking image quality variables...", resolution: "" });

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          const resolutionStr = `${w}x${h}px`;

          if (w < 1200 || h < 1200) {
            setResolutionCheck({
              status: "error",
              message: `Insufficient resolution (${resolutionStr}). Standard manufacturing requires at least 1200x1200px to ensure sharpness on prints. Please select a higher quality image.`,
              resolution: resolutionStr
            });
            setImagePreview(null);
          } else {
            setResolutionCheck({
              status: "success",
              message: `Image verified successfully! High fidelity print output guaranteed.`,
              resolution: resolutionStr
            });
            setImagePreview(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Pricing calculations (FR-3.2 Matrix)
  const pBase = selectedBase.price + selectedLayout.price;
  const pCustomization = imagePreview ? 50.0 : 0.0; // custom processing fee
  const marginAmt = resellerMargin;
  const unitCostExclTax = pBase + pCustomization + marginAmt;
  const gstAmt = unitCostExclTax * 0.18;
  const finalPricePerUnit = unitCostExclTax * 1.18;
  const totalCost = finalPricePerUnit * quantity;
  const apiPayload = {
    baseProduct: selectedBase.name,
    filmLayout: selectedLayout.name,
    customText,
    resellerMargin,
    quantity,
    gstRate: 0.18,
    orderState: "PENDING_PAYMENT",
    customizationHash: `${selectedBase.id}-${selectedLayout.id}-${frameColor.hex}-${customText || "no-text"}`,
    frameColorTint: frameColor.hex,
    frameSizeLayout: selectedLayout.scale,
    imageResolution: resolutionCheck.resolution || null,
    creatorHandle: "creator_handle"
  };

  // Add customized item to cart
  const handleAddToCart = () => {
    if (!imagePreview) {
      alert("Please upload a high-resolution snapshot to customize your print frame.");
      return;
    }

    const cartPayload = {
      baseProductId: selectedBase.id,
      baseProductName: selectedBase.name,
      baseProductPrice: selectedBase.price,
      filmLayoutId: selectedLayout.id,
      filmLayoutName: selectedLayout.name,
      filmLayoutPrice: selectedLayout.price,
      resellerMargin: resellerMargin,
      customText: customText,
      customImageUrl: imagePreview,
      customImageResolution: resolutionCheck.resolution,
      frameColorTint: frameColor.hex,
      frameSizeLayout: selectedLayout.scale
    };

    addToCart(cartPayload, quantity);
    router.push("/cart");
  };

  return (
    <div className="py-4">
      {/* Editorial Header */}
      <div className="mb-8 border-b border-black/5 pb-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-rose-500">Epic 1 Customizer Studio</span>
        <h1 className="font-serif text-4xl font-extrabold text-neutral-800 mt-1">3D Customizer Studio</h1>
        <p className="text-neutral-500 text-sm font-sans mt-0.5">
          Configure border shades, physical textures, custom text script strings, and see updates instantly in 3D.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Viewport (Three Fiber 3D Stage) */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl relative">
            <StudioCanvas 
              imageUrl={imagePreview}
              frameColor={frameColor.hex}
              layoutSize={selectedLayout.scale as "Mini" | "Square" | "Wide"}
              customText={customText}
              materialType={materialType}
            />
          </div>

          {/* Resolution Validation Panel */}
          <div className={`p-4 rounded-xl border font-sans text-xs ${
            resolutionCheck.status === "success" 
              ? "bg-emerald-50/70 border-emerald-100 text-emerald-800"
              : resolutionCheck.status === "error"
              ? "bg-rose-50/70 border-rose-100 text-rose-800"
              : "bg-white border-neutral-100 text-neutral-500"
          } transition-all duration-300`}>
            <div className="flex items-start gap-2.5">
              {resolutionCheck.status === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
              ) : resolutionCheck.status === "error" ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <Upload className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-center font-semibold text-neutral-700">
                  <span>Photo Print Resolution Status</span>
                  {resolutionCheck.resolution && (
                    <span className="bg-white px-2 py-0.5 rounded border text-[10px] uppercase">
                      {resolutionCheck.resolution}
                    </span>
                  )}
                </div>
                <p className="mt-1 leading-relaxed text-[11px]">
                  {resolutionCheck.status === "idle" 
                    ? "Standard verification required. Drop or browse a picture to analyze printing parameters." 
                    : resolutionCheck.message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Scrollable Configuration Drawer */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-white/50 border border-black/5 p-6 rounded-2xl shadow-sm">
          {/* Section 1: Base & Size Selection */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400">1. Select Frame Material</h3>
            <div className="grid grid-cols-2 gap-3">
              {BASE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedBase(prod)}
                  className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                    selectedBase.id === prod.id
                      ? "border-rose-300 bg-rose-50/20 ring-2 ring-rose-100"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <span className="font-bold text-xs text-neutral-800">{prod.name}</span>
                  <span className="text-[11px] text-neutral-500 line-clamp-1">{prod.desc}</span>
                  <span className="text-xs font-bold text-rose-700 mt-1">₹{prod.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Size & Layout Swap */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400">2. Layout Format Swap (FR-1.3)</h3>
            <div className="flex flex-col gap-2.5">
              {FILM_LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout)}
                  className={`p-3 rounded-xl border text-left flex justify-between items-center transition-all ${
                    selectedLayout.id === layout.id
                      ? "border-rose-300 bg-rose-50/20 ring-2 ring-rose-100"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-neutral-800 block">
                      {layout.name} <span className="text-[9px] uppercase font-bold bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500 ml-1.5">{layout.scale}</span>
                    </span>
                    <span className="text-[11px] text-neutral-500">{layout.desc}</span>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-800">+ ₹{layout.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Texture & Color Tint properties */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400">3. Finish & Color Tint (FR-1.2)</h3>
            
            {/* Texture Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">Finish Texture</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "matte", label: "Matte Paper" },
                  { id: "acrylic", label: "Glossy Acrylic" },
                  { id: "wood", label: "Oak Wood" }
                ].map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterialType(mat.id as "acrylic" | "wood" | "matte")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      materialType === mat.id
                        ? "bg-neutral-800 text-white border-neutral-800 shadow"
                        : "bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600"
                    }`}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tint colors */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">Border Color Tint</span>
              <div className="flex flex-wrap gap-2.5">
                {COLOR_TINTS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setFrameColor(color)}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                    className={`w-9 h-9 rounded-full border shadow-inner transition-all flex items-center justify-center ${
                      frameColor.hex === color.hex
                        ? "ring-2 ring-rose-400 border-white scale-110"
                        : "border-black/10 hover:scale-105"
                    }`}
                  >
                    {frameColor.hex === color.hex && (
                      <span className={`text-[10px] font-bold ${
                        color.hex === "#2b2b2a" ? "text-white" : "text-neutral-700"
                      }`}>✓</span>
                    )}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-neutral-400 italic font-sans">{frameColor.label} selected.</span>
            </div>
          </div>

          {/* Section 4: Picture Upload & Cursive Overlay */}
          <div className="flex flex-col gap-3.5 border-t border-black/5 pt-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400">4. Upload Photo & Text overlay</h3>
            
            {/* Upload Selector */}
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border border-neutral-200 hover:border-rose-300 hover:bg-rose-50/5 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all bg-white shadow-sm"
              >
                <Upload className="w-4 h-4 text-neutral-500" />
                Upload Snapshot Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Text Overlay script string */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">Custom Text script Overlay</span>
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your message script..."
                maxLength={40}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-sans focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 bg-white"
              />
            </div>
          </div>

          {/* Section 5: Creator Margin Allocator */}
          <div className="flex flex-col gap-3 border-t border-black/5 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400">5. Reseller Commission Margin (FR-3.1)</h3>
              <span className="font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">
                ₹{resellerMargin} added
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-sans leading-normal">
              Adjust your creator profit mark-up using the slider below to test margin structures:
            </p>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={resellerMargin}
              onChange={(e) => setResellerMargin(parseInt(e.target.value))}
              className="w-full accent-rose-400 cursor-ew-resize h-1.5 rounded-lg bg-neutral-200 mt-1"
            />
          </div>

          {/* Section 6: Checkout Calculations & Quantity */}
          <div className="flex flex-col gap-4 border-t border-black/5 pt-4 bg-stone-50/50 -mx-6 px-6 pb-6 rounded-b-2xl">
            {/* Quantity Stepper */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs font-semibold text-neutral-600 font-sans">Order Units Count</span>
              <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-neutral-800 w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => Math.min(20, prev + 1))}
                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Matrix Pricing calculations breakdown (FR-3.2) */}
            <div className="flex flex-col gap-1.5 text-xs text-neutral-500 font-sans mt-2">
              <div className="flex justify-between">
                <span>Base Materials (pBase)</span>
                <span>₹{pBase}</span>
              </div>
              <div className="flex justify-between">
                <span>Customization Processing (pCust)</span>
                <span>₹{pCustomization}</span>
              </div>
              <div className="flex justify-between">
                <span>Reseller Markup margin (M_reseller)</span>
                <span>₹{marginAmt}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-neutral-200 pt-1 text-neutral-600 font-medium">
                <span>Subtotal (Cost excl. GST)</span>
                <span>₹{unitCostExclTax}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Goods & Services Tax (GST at 18%)</span>
                <span>₹{gstAmt.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-800 border-t border-neutral-200 pt-1.5">
                <span>Customer Retail Price / Unit</span>
                <span className="text-rose-700">₹{finalPricePerUnit.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl p-3 font-sans">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  Backend API JSON Payload
                </span>
                <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Spring Boot Ready
                </span>
              </div>
              <pre className="max-h-44 overflow-auto whitespace-pre-wrap rounded-lg bg-neutral-950 p-3 text-[10px] leading-relaxed text-rose-50">
                {JSON.stringify(apiPayload, null, 2)}
              </pre>
            </div>

            {/* Cart trigger button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4.5 px-4 font-sans text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 transition-transform duration-200 shadow-md ${
                imagePreview 
                  ? "bg-rose-600 hover:bg-rose-700 hover:scale-[1.01]" 
                  : "bg-neutral-300 cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add customized print to cart</span>
              <span className="font-sans font-extrabold text-white/90 ml-1.5 border-l border-white/20 pl-2">
                ₹{totalCost.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
