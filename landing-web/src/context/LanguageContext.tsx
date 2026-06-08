"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "EN" | "SW";

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (en: string, sw: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("SW");

  useEffect(() => {
    const saved = localStorage.getItem("elimu_lang") as Language;
    if (saved === "EN" || saved === "SW") {
      setLanguage(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = language === "EN" ? "SW" : "EN";
    setLanguage(next);
    localStorage.setItem("elimu_lang", next);
  };

  const t = (en: string, sw: string) => {
    return language === "EN" ? en : sw;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a fallback so it doesn't crash if rendered outside provider in SSR
    return {
      language: "SW" as Language,
      toggleLanguage: () => {},
      t: (en: string, sw: string) => sw,
    };
  }
  return context;
}
