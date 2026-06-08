"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Globe, Sun, Moon, Menu, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-indigo-500" />}
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", labelEn: "Home", labelSw: "Nyumbani" },
    { href: "/lessons", labelEn: "Lessons", labelSw: "Masomo" },
    { href: "/teachers", labelEn: "Teachers", labelSw: "Walimu" },
    { href: "/live", labelEn: "Live Classes", labelSw: "Vipindi vya Live" },
    { href: "/ai", labelEn: "AI Tutor", labelSw: "Msaidizi wa AI" },
    { href: "/about", labelEn: "About Us", labelSw: "Kuhusu Sisi" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.25)] group-hover:scale-105 transition duration-200">
            <Play className="size-5 fill-slate-950 stroke-none" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Elimu<span className="text-amber-500">Tube</span>
            </span>
            <span className="hidden text-[10px] block font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500 sm:inline-block sm:ml-1.5">
              Tanzania
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-amber-500 ${
                  isActive ? "text-amber-500 font-bold" : ""
                }`}
              >
                {t(link.labelEn, link.labelSw)}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-2.5 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Globe className="size-3.5 text-amber-500" />
            {language === "EN" ? "Kiswahili" : "English"}
          </button>

          <Link href="/lessons">
            <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.2)] transition active:scale-[0.98]">
              {t("Explore Library", "Vinjari Maktaba")}
            </Button>
          </Link>
        </div>

        {/* Mobile controls toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/50 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950/95 backdrop-blur-md px-4 py-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3 font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2 text-sm hover:text-amber-500 ${pathname === link.href ? "text-amber-500 font-bold" : ""}`}
              >
                {t(link.labelEn, link.labelSw)}
              </Link>
            ))}
          </nav>
          
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-slate-900">
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              <Globe className="size-4 text-amber-500" />
              {language === "EN" ? "Kiswahili" : "English"}
            </button>

            <Link href="/lessons" className="w-full">
              <Button className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 py-5">
                {t("Explore Library", "Vinjari Maktaba")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
