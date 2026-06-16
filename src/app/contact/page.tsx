"use client";

import React from "react";
import { Mail, MessageSquare, MapPin, Send, Instagram, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-12 flex flex-col gap-16">
      {/* Header Section */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="font-serif text-5xl font-black text-neutral-800 leading-tight">
          Get in Touch.
        </h1>
        <p className="text-neutral-600 text-lg font-light leading-relaxed">
          Have a question about a custom order or want to collaborate? 
          We&apos;d love to hear from you. Drop us a message below.
        </p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-diffused">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Name</label>
                <input 
                  type="text" 
                  placeholder="Your name"
                  className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 transition-colors"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Subject</label>
              <select className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 transition-colors cursor-pointer">
                <option>General Inquiry</option>
                <option>Order Support</option>
                <option>Custom Collaboration</option>
                <option>Creator Portal Help</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Message</label>
              <textarea 
                rows={5}
                placeholder="How can we help?"
                className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-300 transition-colors resize-none"
              />
            </div>

            <button className="bg-neutral-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

        {/* Info & Socials */}
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-rose-50/50 border border-rose-100/50 rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-rose-500 shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-neutral-800">Email us</h4>
              <p className="text-neutral-500 text-sm">hello@aurasartique.com</p>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-neutral-800">Live Chat</h4>
              <p className="text-neutral-500 text-sm">Mon-Fri, 9am-6pm IST</p>
            </div>
          </div>

          <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-diffused flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-800">Studio Location</h4>
                <p className="text-neutral-500 text-sm leading-relaxed mt-1">
                  123 Artique Way, Creative District<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <h4 className="font-bold text-neutral-800 mb-4">Follow our journey</h4>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Linkedin, label: "LinkedIn" }
                ].map((social) => (
                  <button key={social.label} className="w-12 h-12 rounded-xl border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-rose-500 hover:border-rose-200 transition-all">
                    <social.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
