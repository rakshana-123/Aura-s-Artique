"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Upload, Sparkles, AlertCircle, 
  ArrowRight, SlidersHorizontal, Image as ImageIcon, Heart, Layout, ShoppingBag
} from "lucide-react";

// Types
interface Product {
  id: number;
  name: string;
  type: "FRAME" | "KIT" | "COLLECTION";
  basePrice: number;
  category: "acrylic" | "wood" | "pastel" | "metal" | "diy";
  colorHue: "pastel" | "wood" | "neutral" | "metallic" | "lavender" | "pink" | "mint";
  scale: "Mini" | "Square" | "Wide";
  description: string;
  gradient: string; // fallback visual representation
  rating: number;
}

// Catalog Data
const CATALOG_ITEMS: Product[] = [
  {
    id: 1,
    name: "Acrylic Floating Desktop Frame",
    type: "FRAME",
    basePrice: 250,
    category: "acrylic",
    colorHue: "neutral",
    scale: "Square",
    description: "Premium optical-grade acrylic plates with subtle magnetic fasteners and polished edges.",
    gradient: "from-sky-100 to-indigo-50 border-sky-200/40",
    rating: 4.8
  },
  {
    id: 2,
    name: "Retro Glass Brass Border Frame",
    type: "FRAME",
    basePrice: 400,
    category: "metal",
    colorHue: "metallic",
    scale: "Wide",
    description: "Vintage brass border styling with double-pane glass inserts and a sturdy matching easel back stand.",
    gradient: "from-amber-100/60 to-yellow-50 border-amber-200/40",
    rating: 4.9
  },
  {
    id: 3,
    name: "Aura's Soft Lavender Polaroid Frame",
    type: "FRAME",
    basePrice: 300,
    category: "pastel",
    colorHue: "lavender",
    scale: "Mini",
    description: " Tactile matte lavender borders with diffuse backing card for small polaroid layouts.",
    gradient: "from-indigo-100/60 to-purple-50 border-purple-200/40",
    rating: 4.7
  },
  {
    id: 4,
    name: "Pastel Pink Dream Tabletop Frame",
    type: "FRAME",
    basePrice: 300,
    category: "pastel",
    colorHue: "pink",
    scale: "Square",
    description: "Crafted for standard square snapshots. Soft pastel pink frame with dual stand mounts.",
    gradient: "from-rose-100/70 to-pink-50 border-rose-200/40",
    rating: 4.6
  },
  {
    id: 5,
    name: "Minimalist Oak Wood Block Stand",
    type: "FRAME",
    basePrice: 280,
    category: "wood",
    colorHue: "wood",
    scale: "Mini",
    description: "Natural sustainably sourced white oak wood blocks with precise angled image slot cuts.",
    gradient: "from-amber-100/40 to-stone-100/50 border-stone-200/40",
    rating: 4.8
  },
  {
    id: 6,
    name: "DIY Polaroid Crafting Starter Kit",
    type: "KIT",
    basePrice: 600,
    category: "diy",
    colorHue: "pastel",
    scale: "Square",
    description: "Includes 20 classic retro square cards, 10 mini wooden peg hangers, twine, and gold gel lettering pens.",
    gradient: "from-rose-50 to-emerald-50 border-teal-100/50",
    rating: 5.0
  },
  {
    id: 7,
    name: "Nordic Pine Photo Wall Grid Hanger",
    type: "KIT",
    basePrice: 750,
    category: "diy",
    colorHue: "neutral",
    scale: "Wide",
    description: "A large hanging wall layout featuring solid pine dowels, raw hemp ropes, and copper peg clips.",
    gradient: "from-stone-100 to-amber-50 border-amber-100/40",
    rating: 4.5
  },
  {
    id: 8,
    name: "Sage/Mint Tabletop Easel Kit",
    type: "KIT",
    basePrice: 420,
    category: "diy",
    colorHue: "mint",
    scale: "Mini",
    description: "Cute sage colored mini easel stand paired with a set of textured deckle-edge mini print mounts.",
    gradient: "from-emerald-100/50 to-teal-50 border-emerald-200/30",
    rating: 4.8
  }
];

export default function Storefront() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload/Mockup States
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resolutionError, setResolutionError] = useState<string | null>(null);
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [mockupText, setMockupText] = useState("My Summer Trip");
  const [mockupSize, setMockupSize] = useState<"Mini" | "Square" | "Wide">("Square");

  // Asynchronous Catalog Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedScale, setSelectedScale] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setResolutionError(null);
    setIsDeveloping(false);

    // Read file dimensions
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        if (width < 1200 || height < 1200) {
          setResolutionError(
            `Insufficient resolution: ${width}x${height}px. Core printing requires a minimum of 1200x1200px to ensure premium print outputs without pixelation.`
          );
          setImagePreview(null);
        } else {
          setImagePreview(event.target?.result as string);
          setIsDeveloping(true);
          setTimeout(() => {
            setIsDeveloping(false);
          }, 3500);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Async Catalog Filtering logic
  const filteredProducts = CATALOG_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory || (selectedCategory === "frame" && item.type === "FRAME") || (selectedCategory === "kit" && item.type === "KIT");
    const matchesColor = selectedColor === "all" || item.colorHue === selectedColor;
    const matchesScale = selectedScale === "all" || item.scale === selectedScale;
    const matchesPrice = item.basePrice <= maxPrice;
    return matchesCategory && matchesColor && matchesScale && matchesPrice;
  });

  const trigger3DStudioWithImage = () => {
    if (imagePreview) {
      sessionStorage.setItem("editor_preview_img", imagePreview);
      sessionStorage.setItem("editor_preview_text", mockupText);
      sessionStorage.setItem("editor_preview_size", mockupSize);
      router.push("/customizer");
    }
  };

  return (
    <div className="flex flex-col gap-24 py-12">
      {/* 2.1 Enhanced Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden rounded-[3rem] bg-gradient-to-b from-rose-50/50 to-white border border-black/5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pastel-pink/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-soft-lavender/20 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8 items-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-200/40 px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-rose-700">The New Standard of Tactile Art</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-black text-neutral-800 leading-[1] tracking-tight">
            Physical memories, <br />
            <span className="bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">reimagined.</span>
          </h1>

          <p className="text-neutral-600 font-sans text-xl font-light leading-relaxed max-w-2xl">
            Aura&apos;s Artique blends indie craftsmanship with 3D technology. 
            Upload your moments, customize your aesthetic, and own a piece of physical art.
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            <Link 
              href="/customizer"
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-10 py-5 rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.02] shadow-xl hover:shadow-neutral-200"
            >
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#catalog"
              className="bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-bold px-10 py-5 rounded-2xl transition-all hover:scale-[1.02] shadow-sm"
            >
              Browse Shop
            </a>
          </div>
        </div>

        <div className="mt-20 relative w-full max-w-5xl mx-auto hidden lg:block">
           <div className="flex justify-center gap-8 perspective-1000">
              <div className="w-48 aspect-[4/5] bg-white rounded-xl shadow-2xl border border-neutral-100 p-2 transform -rotate-12 translate-y-8 hover:rotate-0 transition-transform duration-500">
                <div className="w-full aspect-square bg-rose-50 rounded-lg"></div>
                <div className="mt-4 h-4 w-2/3 bg-neutral-100 rounded mx-auto"></div>
              </div>
              <div className="w-56 aspect-[4/5] bg-white rounded-xl shadow-2xl border border-neutral-100 p-2 z-10 hover:scale-110 transition-transform duration-500">
                <div className="w-full aspect-square bg-indigo-50 rounded-lg"></div>
                <div className="mt-4 h-4 w-2/3 bg-neutral-100 rounded mx-auto"></div>
              </div>
              <div className="w-48 aspect-[4/5] bg-white rounded-xl shadow-2xl border border-neutral-100 p-2 transform rotate-12 translate-y-8 hover:rotate-0 transition-transform duration-500">
                <div className="w-full aspect-square bg-emerald-50 rounded-lg"></div>
                <div className="mt-4 h-4 w-2/3 bg-neutral-100 rounded mx-auto"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Acrylic Series", desc: "Crystal clear floating frames", color: "bg-sky-50", icon: ImageIcon },
            { title: "Wood Craft", desc: "Hand-finished oak & pine", color: "bg-amber-50", icon: Layout },
            { title: "DIY Kits", desc: "Everything you need to create", color: "bg-emerald-50", icon: Sparkles },
            { title: "Creator Picks", desc: "Curated by our community", color: "bg-rose-50", icon: Heart },
          ].map((cat, i) => (
            <div key={i} className={`${cat.color} p-8 rounded-3xl border border-black/5 flex flex-col gap-4 hover:scale-[1.02] transition-transform cursor-pointer group`}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-neutral-800 shadow-sm group-hover:shadow-md transition-shadow">
                <cat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-800">{cat.title}</h3>
                <p className="text-neutral-500 text-sm mt-1">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload & Preview Zone */}
      <section className="max-w-6xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-neutral-800 leading-tight">
            See your vision <br /> come to life.
          </h2>
          <p className="text-neutral-500 text-lg font-light leading-relaxed">
            Our interactive workspace allows you to preview your photos in our signature polaroid-style formats before you even start the 3D process.
          </p>
          <ul className="flex flex-col gap-4">
            {[
              "High-resolution print validation",
              "Real-time text & layout preview",
              "Instant 3D studio synchronization"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-600">
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <Sparkles className="w-3 h-3" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`w-full aspect-[4/5] bg-stone-50 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-between p-8 relative transition-all duration-300 ${
            dragActive ? "border-rose-400 bg-rose-50/20 scale-[1.02]" : "border-neutral-200 hover:border-neutral-300"
          } ${imagePreview ? "border-solid border-neutral-100 bg-white shadow-diffused" : "shadow-sm"}`}
        >
          {resolutionError && (
            <div className="absolute inset-x-4 top-4 z-10 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 shadow-md">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-rose-800">Print Quality Warning</h4>
                <p className="text-[11px] text-rose-700 leading-normal mt-0.5">{resolutionError}</p>
              </div>
            </div>
          )}

          {!imagePreview ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-pastel-pink/50 flex items-center justify-center text-rose-600">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="font-serif text-lg font-bold text-neutral-800 hover:underline block"
                >
                  Drop image or Browse
                </button>
                <p className="text-xs text-neutral-400 mt-1">Accepts JPG, PNG. Min 1200x1200px</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col justify-between py-2 relative">
              <div className="polaroid-tape"></div>
              <div className={`w-full aspect-square bg-neutral-900 border border-neutral-100/50 rounded overflow-hidden relative ${
                mockupSize === "Mini" ? "scale-90" : mockupSize === "Wide" ? "scale-x-110" : ""
              }`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Mockup preview" 
                  className={`w-full h-full object-cover transition-all duration-[3500ms] ease-out ${
                    isDeveloping ? "filter grayscale sepia opacity-20 blur-sm" : "filter-none opacity-100 blur-0"
                  }`}
                />
                {isDeveloping && (
                  <div className="absolute inset-0 bg-neutral-950/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                    <Sparkles className="w-8 h-8 animate-spin text-pastel-pink mb-2" />
                    <span className="text-xs uppercase tracking-widest font-semibold text-pastel-pink animate-pulse">
                      Developing Print...
                    </span>
                  </div>
                )}
              </div>
              <div className="pt-6 pb-2 text-center h-[60px] flex items-center justify-center">
                {isDeveloping ? (
                  <span className="h-6 w-32 bg-stone-100 animate-pulse rounded"></span>
                ) : (
                  <span className="font-cursive text-2xl text-neutral-700 handwriting-font">
                    {mockupText}
                  </span>
                )}
              </div>
            </div>
          )}

          {imagePreview && !isDeveloping && (
            <div className="w-full flex flex-col gap-3 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={mockupText}
                  onChange={(e) => setMockupText(e.target.value)}
                  placeholder="Add text script..." 
                  className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs font-sans focus:outline-none focus:border-rose-400"
                />
                <select 
                  value={mockupSize}
                  onChange={(e) => setMockupSize(e.target.value as "Mini" | "Square" | "Wide")}
                  className="px-2 py-1.5 border border-neutral-200 rounded-lg text-xs font-sans focus:outline-none"
                >
                  <option value="Mini">Mini</option>
                  <option value="Square">Square</option>
                  <option value="Wide">Wide</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={trigger3DStudioWithImage}
                  className="flex-1 bg-pastel-pink text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Open in 3D Studio
                </button>
                <button 
                  onClick={() => setImagePreview(null)}
                  className="px-3 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-500 rounded-lg text-xs"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2.2 Catalog Masonry Feed */}
      <section id="catalog" className="flex flex-col gap-8 scroll-mt-24 px-4 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-6">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800">
              Browse Artistry Collections
            </h2>
            <p className="text-neutral-500 font-sans text-sm mt-1">
              Select base frames, layouts, and curated DIY print kits.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-white/60 border border-neutral-200/50 px-3 py-2 rounded-xl w-fit">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
            <span>Asynchronous Realtime Filters</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 bg-white/40 backdrop-blur-sm p-4 border border-black/5 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-neutral-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-300 cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="frame">Frames Only</option>
              <option value="kit">DIY Kits Only</option>
              <option value="acrylic">Acrylic</option>
              <option value="wood">Wood Blocks</option>
              <option value="pastel">Pastel Tinted</option>
              <option value="metal">Metallic Frames</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Color Hue</span>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="bg-white border border-neutral-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-300 cursor-pointer"
            >
              <option value="all">All Hues</option>
              <option value="pastel">Pastel Mix</option>
              <option value="pink">Blush Pink</option>
              <option value="lavender">Lavender</option>
              <option value="mint">Sage Mint</option>
              <option value="wood">Natural Wood</option>
              <option value="metallic">Antique Metallic</option>
              <option value="neutral">Clear Neutral</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">Layout Size</span>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="bg-white border border-neutral-200 px-3 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-300 cursor-pointer"
            >
              <option value="all">All Layouts</option>
              <option value="Mini">Mini (Film)</option>
              <option value="Square">Square (1:1)</option>
              <option value="Wide">Wide (Landscape)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
              <span>Max Price</span>
              <span className="font-sans text-neutral-700 font-bold">₹{maxPrice}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="150"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="flex-1 accent-rose-400 cursor-ew-resize h-1.5 rounded-lg bg-neutral-200"
              />
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white/30 rounded-2xl border border-dashed border-neutral-300 flex flex-col items-center gap-3">
            <ImageIcon className="w-10 h-10 text-neutral-400" />
            <h3 className="font-serif text-lg font-bold">No items match your filters</h3>
            <button 
              onClick={() => {
                setSelectedCategory("all");
                setSelectedColor("all");
                setSelectedScale("all");
                setMaxPrice(1000);
              }}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {filteredProducts.map((item, index) => {
              const heightClass = index % 3 === 0 ? "min-h-[360px]" : index % 2 === 0 ? "min-h-[420px]" : "min-h-[390px]";
              
              return (
                <div 
                  key={item.id} 
                  className={`bg-white border border-black/5 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 shadow-diffused ${heightClass}`}
                >
                  <div className="flex flex-col gap-4">
                    <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center p-3 relative overflow-hidden shadow-inner`}>
                      <div className="w-[85px] aspect-[4/5] bg-white border border-neutral-200/40 rounded p-1.5 shadow-md transform rotate-[-4deg] group-hover:rotate-[2deg] transition-transform duration-300">
                        <div className="w-full aspect-square bg-stone-100 rounded overflow-hidden flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-neutral-300" />
                        </div>
                        <div className="h-4 bg-stone-100/60 mt-1.5 w-10 mx-auto rounded-sm"></div>
                      </div>
                      <span className="absolute top-2.5 right-2.5 text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-neutral-600 border border-neutral-100">
                        {item.scale}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                          <span className="fill-amber-400">★</span>
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-serif text-base font-bold leading-tight text-neutral-800">
                        {item.name}
                      </h3>
                      <p className="text-neutral-500 text-xs font-light leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold">Base Price</span>
                      <span className="font-sans text-base font-extrabold text-neutral-800">₹{item.basePrice}</span>
                    </div>
                    
                    <button 
                      onClick={() => {
                        sessionStorage.setItem("editor_base_product_id", item.id.toString());
                        router.push("/customizer");
                      }}
                      className="p-2.5 rounded-xl bg-pastel-pink text-rose-700 hover:bg-rose-100 border border-rose-200/50 flex items-center gap-1 text-xs font-bold transition-all duration-200 hover:scale-[1.05]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer Banner */}
      <footer className="w-full border-t border-black/5 pt-12 pb-6 flex flex-col items-center justify-between gap-6 md:flex-row mt-12 px-4 max-w-6xl mx-auto">
        <p className="text-xs text-neutral-400 font-sans">
          &copy; 2026 Aura&apos;s Artique. Indie Craft Desktop Workspace.
        </p>
        <div className="flex items-center gap-4 text-xs font-semibold text-neutral-400">
          <Link href="/customizer" className="hover:text-rose-500">3D Studio</Link>
          <span>&middot;</span>
          <Link href="/creator" className="hover:text-rose-500">Reseller Dashboard</Link>
          <span>&middot;</span>
          <Link href="/cart" className="hover:text-rose-500">Cart</Link>
        </div>
      </footer>
    </div>
  );
}
