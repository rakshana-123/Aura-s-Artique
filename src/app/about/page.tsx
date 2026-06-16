"use client";

import React from "react";
import { Sparkles, Heart, Palette, Globe, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 flex flex-col gap-16">
      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 bg-pastel-pink/40 border border-rose-200/40 px-3.5 py-1.5 rounded-full w-fit mx-auto">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Our Story</span>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl font-black text-neutral-800 leading-tight">
          Where Art Meets Atmosphere.
        </h1>
        <p className="text-neutral-600 text-lg font-light leading-relaxed">
          Aura&apos;s Artique is more than just a store; it&apos;s a tactile indie studio dedicated to 
          turning your digital memories into physical tabletop treasures.
        </p>
      </section>

      {/* Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-diffused flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <Palette className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-800">Curation First</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Every frame, material, and kit is hand-picked for its tactile quality and aesthetic appeal. 
            We believe in objects that feel as good as they look.
          </p>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-diffused flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-800">3D Personalization</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            Our custom 3D studio allows you to visualize your memories in real-time, 
            ensuring every piece is a perfect reflection of your style.
          </p>
        </div>

        <div className="bg-white border border-black/5 rounded-2xl p-8 shadow-diffused flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-neutral-800">Creator Focused</h3>
          <p className="text-neutral-500 text-sm leading-relaxed">
            We empower independent artists and creators with transparent margins and 
            bespoke storefronts to share their vision with the world.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-neutral-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Globe className="w-64 h-64" />
        </div>
        <div className="max-w-2xl relative z-10 flex flex-col gap-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">Our Mission</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            In an increasingly digital world, we strive to bring back the warmth of physical artifacts. 
            Our goal is to build a community where creators and collectors connect through 
            beautifully crafted, personalized art.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full bg-pastel-pink/20" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-neutral-300">Joined by 2,000+ Art Enthusiasts</span>
          </div>
        </div>
      </section>
    </div>
  );
}
