"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-slate-950/80 py-12 text-slate-500 text-xs transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-900/60 pb-6 text-center md:text-left">
          {/* Column 1: Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black">
                E
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                Elimu<span className="text-amber-500">Tube</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-600">
              &copy; {new Date().getFullYear()} ElimuTube. {t("All rights reserved.", "Haki zote zimehifadhiwa.")}
            </p>
            
            {/* Social Media Logos */}
            <div className="flex items-center gap-2 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/facebook.jpg" alt="Facebook" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/ig.jpg" alt="Instagram" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/X(twitter).jpg" alt="X / Twitter" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/linkend.jpg" alt="LinkedIn" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/youtube.jpg" alt="YouTube" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/tiktok.jpg" alt="TikTok" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition active:scale-95">
                <img src="/whatsapp.jpg" alt="WhatsApp" className="size-6 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.1)]" />
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="flex justify-center gap-6 text-slate-650 dark:text-slate-400 font-semibold text-sm">
            <Link href="/" className="hover:text-amber-500 transition">{t("Home", "Nyumbani")}</Link>
            <Link href="/lessons" className="hover:text-amber-500 transition">{t("Lessons", "Masomo")}</Link>
            <Link href="/teachers" className="hover:text-amber-500 transition">{t("Teachers", "Walimu")}</Link>
            <Link href="/live" className="hover:text-amber-500 transition">{t("Live", "Live")}</Link>
            <Link href="/ai" className="hover:text-amber-500 transition">{t("AI", "AI")}</Link>
            <Link href="/about" className="hover:text-amber-500 transition">{t("About", "Kuhusu Sisi")}</Link>
          </div>

          {/* Column 3: App Store / Google Play Logos */}
          <div className="flex items-center justify-center md:justify-end gap-3">
            <button 
              onClick={() => alert(t("Google Play download simulation!", "Kupakua kutoka Google Play kumesimuliwa!"))}
              className="hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <img 
                src="/GetItOnGooglePlay_Badge_Web_color_English.png" 
                alt="Get it on Google Play" 
                className="h-8 w-auto rounded shadow-sm"
              />
            </button>
            <button 
              onClick={() => alert(t("App Store download simulation!", "Kupakua kutoka App Store kumesimuliwa!"))}
              className="hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <img 
                src="/appstore.jpg" 
                alt="Download on the App Store" 
                className="h-8 w-auto rounded shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Disclaimer / Non-affiliation notice */}
        <div className="border-t border-slate-200 dark:border-slate-900/60 pt-6 text-center text-slate-400 dark:text-slate-600 text-[10px] leading-relaxed max-w-3xl mx-auto">
          <p>
            {t(
              "Notice: ElimuTube utilizes standard video streaming web players and mobile wallets of local network providers. We are not associated with any mobile payment gateway or streaming providers. All product and company names are trademarks of their respective holders.",
              "Taarifa: ElimuTube inatumia mifumo ya kawaida ya kucheza video mtandaoni na malipo ya kawaida kupitia mitandao ya simu za mkononi. Hatuna uhusiano rasmi na makampuni ya huduma za malipo au watoa huduma za video. Majina yote ya bidhaa na makampuni ni mali ya wamiliki wao."
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
