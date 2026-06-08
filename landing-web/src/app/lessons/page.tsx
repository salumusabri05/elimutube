"use client";

import React from "react";
import { 
  Play, 
  Sparkles, 
  BookOpen, 
  Download, 
  Smartphone, 
  BookMarked,
  CheckCircle,
  Clock,
  HelpCircle,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function LessonsMarketingPage() {
  const { t, language } = useLanguage();

  const subjects = [
    { id: "MATH", name: "Mathematics", nameSw: "Hisabati", color: "from-blue-500 to-indigo-500", desc: "Form 1 to 6 comprehensive arithmetic, algebra, and calculus.", descSw: "Hisabati ya Kidato cha 1 hadi cha 6, algebra na calculus." },
    { id: "PHYS", name: "Physics", nameSw: "Fizikia", color: "from-amber-500 to-orange-500", desc: "Mechanics, thermodynamics, and electromagnetism simplified.", descSw: "Makanika, joto, na umeme vilivyorahisishwa." },
    { id: "CHEM", name: "Chemistry", nameSw: "Kemia", color: "from-emerald-500 to-teal-500", desc: "Organic, inorganic chemistry and practical experiment guides.", descSw: "Kemia hai na isiyo hai pamoja na miongozo ya vitendo." },
    { id: "BIOL", name: "Biology", nameSw: "Biolojia", color: "from-red-500 to-rose-500", desc: "Human anatomy, plant biology, and ecological studies.", descSw: "Anatomia ya binadamu, biolojia ya mimea na ikolojia." },
    { id: "GEOG", name: "Geography", nameSw: "Jiografia", color: "from-cyan-500 to-blue-600", desc: "Physical geography, map reading, and environmental science.", descSw: "Jiografia ya asili, kusoma ramani na sayansi ya mazingira." },
    { id: "HIST", name: "History", nameSw: "Historia", color: "from-amber-700 to-yellow-600", desc: "African history, global dynamics, and national heritage.", descSw: "Historia ya Afrika, maendeleo ya kimataifa na urithi wetu." },
    { id: "ENGL", name: "English Language", nameSw: "Kiingereza", color: "from-violet-500 to-purple-600", desc: "Grammar, literature, and active writing practices.", descSw: "Sarufi, fasihi, na mazoezi ya kuandika kwa ufasaha." },
    { id: "KISW", name: "Kiswahili", nameSw: "Kiswahili", color: "from-pink-500 to-rose-600", desc: "Sarufi, fasihi ya Kiswahili, na uchambuzi wa vitabu.", descSw: "Sarufi, fasihi ya Kiswahili, na uchambuzi wa vitabu vya mtaala." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {t("Learn at Your Own Pace", "Soma kwa Kasi Yako Mwenyewe")}
            </h1>
            <p className="text-lg text-slate-650 dark:text-slate-400 leading-relaxed">
              {t(
                "ElimuTube brings Tanzania's top secondary school educators straight to your screen. Browse high-quality video courses structured precisely according to the NECTA syllabus.",
                "ElimuTube inaleta walimu bingwa wa sekondari nchini Tanzania moja kwa moja kwenye simu yako. Masomo yote yamepangwa kulingana na mtaala wa NECTA."
              )}
            </p>
          </div>
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 hover:scale-[1.01] transition duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 opacity-70 blur-xl dark:opacity-45" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
              <img 
                src="/lessons.jpg" 
                alt="Lessons on ElimuTube" 
                className="w-full h-auto object-cover aspect-4/3 sm:aspect-video lg:aspect-4/3"
              />
            </div>
          </div>
        </div>

        {/* FEATURE HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30 hover:translate-y-[-2px] transition duration-200">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Play className="size-6 fill-amber-500 stroke-none" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("NECTA Aligned Videos", "Video za Mtaala wa NECTA")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "Every class follows the standard national syllabus. No off-topic discussions, just focused learning for Form 1 through Form 6.",
                  "Kila somo linafuata mtaala rasmi wa taifa. Hakuna masomo yasiyo ya lazima, ni elimu iliyokusudiwa kuanzia Kidato cha 1 hadi cha 6."
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30 hover:translate-y-[-2px] transition duration-200">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Download className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("Offline Download Mode", "Njia ya Nje ya Mtandao (Offline)")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "Save internet costs! Download video lectures over Wi-Fi or when you have bundles, and watch them anytime without an active internet connection.",
                  "Okoa gharama za internet! Pakua video za masomo ukiwa na vifurushi, na kisha uziangalie wakati wowote bila kuhitaji internet ya ziada."
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30 hover:translate-y-[-2px] transition duration-200">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Sparkles className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("Bilingual AI Assistant", "Msaidizi wa AI kwa Lugha Mbili")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "Ask questions in English or Swahili and get instant, curriculum-based answers. It's like having a personal tutor available 24/7 in your pocket.",
                  "Uliza maswali kwa Kiingereza au Kiswahili na upate majibu papo hapo kulingana na mtaala. Ni sawa na kuwa na mwalimu wa ziada saa 24."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SUBJECTS DIRECTORY SHOWCASE */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t("Explore Subjects Covered", "Mada na Masomo Tunayofundisha")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "Find comprehensive video tutorials and study guides in these primary and advanced level subjects:",
                "Pata miongozo ya masomo na video za mafundisho kwa masomo yafuatayo ya sekondari:"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subj) => (
              <div 
                key={subj.id}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-900 hover:border-slate-350 dark:hover:border-slate-800 transition duration-250 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${subj.color} flex items-center justify-center text-white font-bold text-xs`}>
                    {subj.id}
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                    {language === "SW" ? subj.nameSw : subj.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === "SW" ? subj.descSw : subj.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW TO START STUDYING */}
        <div className="bg-slate-100 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-850 flex flex-col gap-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {t("How to Start Studying on ElimuTube", "Jinsi ya Kuanza Kusoma na ElimuTube")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t("Follow these simple steps to access all lessons:", "Fuata hatua hizi rahisi kuanza:")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2 relative">
              <span className="text-3xl font-black text-amber-500/30">01</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Download App", "Pakua Application")}</h5>
              <p className="text-xs text-slate-500">{t("Install the ElimuTube App on your Android or iOS phone.", "Sakinisha app ya ElimuTube kwenye simu yako.")}</p>
            </div>
            <div className="flex flex-col gap-2 relative">
              <span className="text-3xl font-black text-amber-500/30">02</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Choose Student Role", "Jisajili kama Mwanafunzi")}</h5>
              <p className="text-xs text-slate-500">{t("Select the student account type during the registration process.", "Chagua akaunti ya mwanafunzi wakati wa kusajiliwa.")}</p>
            </div>
            <div className="flex flex-col gap-2 relative">
              <span className="text-3xl font-black text-amber-500/30">03</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Subscribe to a Class", "Jiunge na Darasa")}</h5>
              <p className="text-xs text-slate-500">{t("Choose your subject and teacher. Pay securely via mobile money wallet.", "Chagua somo na mwalimu wako. Lipia salama kwa simu.")}</p>
            </div>
            <div className="flex flex-col gap-2 relative">
              <span className="text-3xl font-black text-amber-500/30">04</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Study Unlimited", "Soma Bila Kikomo")}</h5>
              <p className="text-xs text-slate-500">{t("Watch videos, ask the AI, write notes, and check your performance.", "Tazama masomo, uliza AI, andika muhtasari na pima uwezo wako.")}</p>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION DOWLOAD BLOCK */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {t("Ready to boost your grades?", "Upo tayari kuongeza ufaulu wako?")}
            </h3>
            <p className="text-sm font-semibold opacity-90 max-w-xl">
              {t(
                "All lessons, interactive quizzes, and offline notes are hosted inside the mobile app. Scan the QR code or tap the buttons to download.",
                "Masomo yote, chemsha bongo (quizzes) na muhtasari wa offline vipo ndani ya app ya simu. Pakua sasa kuanza."
              )}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0 justify-center">
            {/* Google Play Button */}
            <button 
              onClick={() => alert(t("Google Play download simulation!", "Kupakua kutoka Google Play kumesimuliwa!"))}
              className="hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <img 
                src="/GetItOnGooglePlay_Badge_Web_color_English.png" 
                alt="Get it on Google Play" 
                className="h-12 w-auto shadow-md rounded-lg"
              />
            </button>

            {/* App Store Button */}
            <button 
              onClick={() => alert(t("App Store download simulation!", "Kupakua kutoka App Store kumesimuliwa!"))}
              className="hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              <img 
                src="/appstore.jpg" 
                alt="Download on the App Store" 
                className="h-12 w-auto shadow-md rounded-lg"
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
