"use client";

import React, { useState } from "react";
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
  const [inspectorLevel, setInspectorLevel] = useState<"form1" | "form2" | "form3" | "form4">("form4");

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

        {/* CONCEPTUAL CURRICULUM INSPECTOR */}
        <div className="flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("Explore the NECTA Syllabus Roadmap", "Kagua Mtaala wa NECTA Hatua kwa Hatua")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "Click on a class level below to see how our video playlists are structured topic-by-topic to ensure 100% exam coverage.",
                "Bonyeza kidato husika hapa chini kuona jinsi video zetu zilivyopangwa mada kwa mada ili kufunika mtaala mzima wa mitihani."
              )}
            </p>
          </div>

          {/* Level Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl max-w-lg mx-auto w-full grid grid-cols-4 gap-1">
            {(["form1", "form2", "form3", "form4"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setInspectorLevel(level)}
                className={`py-2 px-1 text-center font-bold text-xs rounded-xl transition duration-200 cursor-pointer ${
                  inspectorLevel === level
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {level === "form1" && "Form 1"}
                {level === "form2" && "Form 2"}
                {level === "form3" && "Form 3"}
                {level === "form4" && "Form 4"}
              </button>
            ))}
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Subject: Mathematics */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-xl -z-10" />
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500">MATH</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t("Mathematics", "Hisabati")}</h4>
              </div>
              <div className="flex flex-col gap-3">
                {(inspectorLevel === "form1" ? [
                  ["Numbers & Fractions", "Namba na Sehemu"],
                  ["Algebra & Equations", "Algebra na Milinganyo"],
                  ["Geometry Basics", "Misingi ya Jometri"],
                  ["Ratios & Percentages", "Uwiano na Asilimia"],
                ] : inspectorLevel === "form2" ? [
                  ["Exponents & Radicals", "Kipeo na Kipeuo"],
                  ["Geometrical Construction", "Ujenzi wa Jometri"],
                  ["Statistics & Probability", "Takwimu na Uwezekano"],
                  ["Quadratic Equations", "Milinganyo ya Quadratic"],
                ] : inspectorLevel === "form3" ? [
                  ["Quadratic Functions", "Kazi za Quadratic"],
                  ["Soil & Circle Geometry", "Jometri ya Duara"],
                  ["Trigonometry Basics", "Misingi ya Trigonometria"],
                  ["Linear Programming", "Linear Programming"],
                ] : [
                  ["Coordinate Geometry", "Jometri ya Kuratibu"],
                  ["Vectors in 2D", "Vekta za 2D"],
                  ["Matrices & Transform", "Matrisi na Ubadilishaji"],
                  ["Probability Theory", "Nadharia ya Uwezekano"],
                ]).map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative group">
                    {idx < 3 && (
                      <div className="absolute left-[9px] top-5 bottom-[-18px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                    )}
                    <span className="size-[20px] rounded-full border border-blue-500 text-blue-500 flex items-center justify-center font-bold text-[10px] shrink-0 bg-white dark:bg-slate-950">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-tight">
                      {language === "SW" ? topic[1] : topic[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject: Physics */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl -z-10" />
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500">PHYS</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t("Physics", "Fizikia")}</h4>
              </div>
              <div className="flex flex-col gap-3">
                {(inspectorLevel === "form1" ? [
                  ["Intro to Physics", "Utangulizi wa Fizikia"],
                  ["Measurement & Force", "Vipimo na Nguvu"],
                  ["Density & Pressure", "Uzito na Shinikizo"],
                  ["Work & Energy", "Kazi na Nishati"],
                ] : inspectorLevel === "form2" ? [
                  ["Static Electricity", "Umeme Tuli"],
                  ["Magnetism & Poles", "Usumaku na Ncha"],
                  ["Simple Machines", "Mashine Rahisi"],
                  ["Newton's Laws", "Sheria za Newton"],
                ] : inspectorLevel === "form3" ? [
                  ["Applications of Vectors", "Matumizi ya Vekta"],
                  ["Friction & Resistance", "Msuguano na Upinzani"],
                  ["Light & Lenses", "Mwanga na Lensi"],
                  ["Electromagnetism", "Usumaku-umeme"],
                ] : [
                  ["Waves & Propagation", "Mawimbi na Usafiri"],
                  ["Electromagnetic Ind.", "Uingizaji Usumaku-umeme"],
                  ["Radioactivity & Decay", "Mionzi na Uozo"],
                  ["Electronics Basics", "Misingi ya Elektroniki"],
                ]).map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative group">
                    {idx < 3 && (
                      <div className="absolute left-[9px] top-5 bottom-[-18px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                    )}
                    <span className="size-[20px] rounded-full border border-amber-500 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0 bg-white dark:bg-slate-950">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-tight">
                      {language === "SW" ? topic[1] : topic[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject: Chemistry */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl -z-10" />
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500">CHEM</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t("Chemistry", "Kemia")}</h4>
              </div>
              <div className="flex flex-col gap-3">
                {(inspectorLevel === "form1" ? [
                  ["Intro to Chemistry", "Utangulizi wa Kemia"],
                  ["Laboratory Safety", "Usalama wa Lab"],
                  ["Matter & Elements", "Mada na Elementi"],
                  ["Air & Combustion", "Hewa na Mlipuko"],
                ] : inspectorLevel === "form2" ? [
                  ["Oxygen & Hydrogen", "Oksijeni na Hidrojeni"],
                  ["Water & Solutions", "Maji na Mivurugo"],
                  ["Atomic Structure", "Muundo wa Atomu"],
                  ["Periodic Table", "Jedwali la Kipindi"],
                ] : inspectorLevel === "form3" ? [
                  ["Chemical Equations", "Milinganyo ya Kemia"],
                  ["Hardness of Water", "Ugumu wa Maji"],
                  ["Acids, Bases & Salts", "Asidi, Besi na Chumvi"],
                  ["Volumetric Analysis", "Uchambuzi wa Kiasi"],
                ] : [
                  ["Organic Chemistry", "Kemia Hai"],
                  ["Non-Metals & Comp.", "Zisizo za Metali"],
                  ["Qualitative Analysis", "Uchambuzi wa Ubora"],
                  ["Energy Changes", "Mabadiliko ya Nishati"],
                ]).map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative group">
                    {idx < 3 && (
                      <div className="absolute left-[9px] top-5 bottom-[-18px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                    )}
                    <span className="size-[20px] rounded-full border border-emerald-500 text-emerald-500 flex items-center justify-center font-bold text-[10px] shrink-0 bg-white dark:bg-slate-950">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-tight">
                      {language === "SW" ? topic[1] : topic[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject: Biology */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/20 border border-slate-200 dark:border-slate-850 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-xl -z-10" />
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-red-500/10 text-red-500">BIOL</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{t("Biology", "Biolojia")}</h4>
              </div>
              <div className="flex flex-col gap-3">
                {(inspectorLevel === "form1" ? [
                  ["Intro to Biology", "Utangulizi wa Biolojia"],
                  ["Safety & First Aid", "Usalama na Huduma ya Kwanza"],
                  ["Cell Structure", "Muundo wa Selula"],
                  ["Classification I", "Uainishaji wa Kwanza"],
                ] : inspectorLevel === "form2" ? [
                  ["Human Respiration", "Kupumua kwa Binadamu"],
                  ["Gaseous Exchange", "Mabadilishano ya Hewa"],
                  ["Transport Systems", "Mifumo ya Usafirishaji"],
                  ["Excretory System", "Mfumo wa Utoaji Uchafu"],
                ] : inspectorLevel === "form3" ? [
                  ["Classification II", "Uainishaji wa Pili"],
                  ["Coordination Systems", "Mifumo ya Uratibu"],
                  ["Movement & Support", "Mwendo na Usaidizi"],
                  ["Internal Regulation", "Udhibiti wa Ndani"],
                ] : [
                  ["Principles of Genetics", "Misingi ya Jenetiki"],
                  ["Evolution Theories", "Nadharia za Mageuzi"],
                  ["Human Ecology", "Ekolojia ya Binadamu"],
                  ["Receptors & Sense", "Vipokezi na Hisia"],
                ]).map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative group">
                    {idx < 3 && (
                      <div className="absolute left-[9px] top-5 bottom-[-18px] w-0.5 bg-slate-200 dark:bg-slate-800" />
                    )}
                    <span className="size-[20px] rounded-full border border-red-500 text-red-500 flex items-center justify-center font-bold text-[10px] shrink-0 bg-white dark:bg-slate-950">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-tight">
                      {language === "SW" ? topic[1] : topic[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

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

        {/* INTERACTIVE MICRO-QUIZ */}
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {t("Try It Now", "Jaribu Sasa")}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("Test Your Knowledge", "Pima Uwezo Wako")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "Answer this sample NECTA-style question to experience how our interactive learning works inside the app.",
                "Jibu swali hili la mfano la mtihani wa NECTA ili uone jinsi masomo yetu ya maingiliano yanavyofanya kazi ndani ya app."
              )}
            </p>
          </div>

          <div className="max-w-2xl mx-auto w-full p-6 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-850 flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold">BIOL</span>
              <span>{t("Form 4 Biology", "Kidato cha 4 — Biolojia")}</span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
              {t(
                "Which organelle is primarily responsible for the production of ATP through aerobic respiration?",
                "Ni kiini-chembwe (organelle) gani kinachohusika zaidi na uzalishaji wa ATP kupitia upumuaji wa oksijeni?"
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: "A", en: "Ribosome", sw: "Raibosomi", correct: false },
                { label: "B", en: "Mitochondria", sw: "Maitokondria", correct: true },
                { label: "C", en: "Golgi apparatus", sw: "Golgi Aparatasi", correct: false },
                { label: "D", en: "Endoplasmic Reticulum", sw: "Endoplazimiki Retikulum", correct: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={(e) => {
                    const allBtns = e.currentTarget.parentElement?.querySelectorAll("button");
                    allBtns?.forEach((btn) => {
                      btn.classList.remove("ring-2", "ring-emerald-500", "bg-emerald-50", "dark:bg-emerald-950/20", "ring-red-500", "bg-red-50", "dark:bg-red-950/20");
                      btn.classList.add("opacity-60");
                    });
                    e.currentTarget.classList.remove("opacity-60");
                    if (opt.correct) {
                      e.currentTarget.classList.add("ring-2", "ring-emerald-500", "bg-emerald-50", "dark:bg-emerald-950/20");
                    } else {
                      e.currentTarget.classList.add("ring-2", "ring-red-500", "bg-red-50", "dark:bg-red-950/20");
                    }
                    // Show the explanation
                    const explainer = document.getElementById("quiz-explainer");
                    if (explainer) explainer.classList.remove("hidden");
                  }}
                  className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700 transition duration-200 cursor-pointer"
                >
                  <span className="font-black text-slate-400 mr-2">{opt.label}.</span>
                  {language === "SW" ? opt.sw : opt.en}
                </button>
              ))}
            </div>

            <div id="quiz-explainer" className="hidden p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                {t("Correct Answer: B — Mitochondria", "Jibu Sahihi: B — Maitokondria")}
              </span>
              {t(
                "Mitochondria are known as the 'powerhouses' of the cell. They produce most of the cell's ATP through aerobic respiration via the Krebs cycle and electron transport chain. This is a common NECTA question in Form 4 Biology.",
                "Maitokondria yanajulikana kama 'vyanzo vya nishati' vya seli. Yanazalisha ATP nyingi kupitia upumuaji wa oksijeni kwa mzunguko wa Krebs na msururu wa usafirishaji wa elektroni. Hili ni swali la kawaida la NECTA katika Biolojia ya Kidato cha 4."
              )}
            </div>
          </div>
        </div>

        {/* DATA SAVER & OFFLINE MODE */}
        <div className="flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t("Save Your Internet Data", "Okoa Data Yako ya Mtandao")}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("Download Once, Study Offline Forever", "Pakua Mara Moja, Soma Offline Milele")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "We understand internet bundles are expensive. Here's how to study without wasting any MB.",
                "Tunaelewa vifurushi vya internet ni ghali. Hivi ndivyo unavyoweza kusoma bila kupoteza MB yoyote."
              )}
            </p>
          </div>

          <div className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/20 flex flex-col gap-3 hover:-translate-y-1 transition duration-300">
              <span className="text-2xl font-black text-emerald-500/30">01</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Connect to Wi-Fi", "Unganisha na Wi-Fi")}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  "Use your school Wi-Fi, an internet cafe, or cheap night bundles (e.g., Vodacom Midnight 1GB for 500 TZS) to download videos.",
                  "Tumia Wi-Fi ya shule, internet cafe, au vifurushi vya usiku (mf. Vodacom Midnight 1GB kwa 500 TZS) kupakua masomo."
                )}
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/20 flex flex-col gap-3 hover:-translate-y-1 transition duration-300">
              <span className="text-2xl font-black text-emerald-500/30">02</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Tap Download on Playlist", "Bonyeza Pakua kwenye Orodha")}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  "Open any subject playlist and tap the download icon. The entire playlist saves to your phone's storage automatically.",
                  "Fungua orodha ya masomo na ubonyeze alama ya kupakua. Masomo yote yatahifadhiwa kwenye kumbukumbu ya simu yako."
                )}
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/20 flex flex-col gap-3 hover:-translate-y-1 transition duration-300">
              <span className="text-2xl font-black text-emerald-500/30">03</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Study Anywhere Offline", "Soma Popote Bila Mtandao")}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t(
                  "Turn off mobile data completely. Open ElimuTube, go to your Downloads tab, and study your saved videos with zero internet usage.",
                  "Zima data ya simu kabisa. Fungua ElimuTube, nenda kwenye sehemu ya Vipakuzi, na usome masomo uliyohifadhi bila kutumia internet yoyote."
                )}
              </p>
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
