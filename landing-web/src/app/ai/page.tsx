"use client";

import React, { useState } from "react";
import { Sparkles, Brain, Cpu, MessageSquare, Play, RefreshCw, Star, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AIPage() {
  const { t } = useLanguage();
  const [activeTopic, setActiveTopic] = useState<"biology" | "chemistry" | "math">("biology");
  const [chatLang, setChatLang] = useState<"EN" | "SW">("EN");

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-24 border-b border-slate-200/80 dark:border-slate-900 bg-linear-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/40">
        <div className="absolute top-0 right-1/4 -z-10 size-[350px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-20 left-1/4 -z-10 size-[350px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5 text-center lg:text-left">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
              {t(
                "Top Teachers Powered by Smart AI Support",
                "Walimu Bingwa Wakiwezeshwa na Nguvu ya AI"
              )}
            </h1>
            <p className="text-base sm:text-lg text-slate-650 dark:text-slate-400 leading-relaxed">
              {t(
                "We believe AI should not replace human teachers. Instead, on ElimuTube, teachers teach the syllabus and our AI tutor explains, translates, and designs quizzes to clarify doubts instantly.",
                "Tunaamini AI haipaswi kuchukua nafasi ya mwalimu wa kibinadamu. Badala yake, kwenye ElimuTube, walimu wanafundisha mada na msaidizi wa AI anakusaidia kuelewa, kutafsiri, na kukupa maswali ya kufanya mazoezi."
              )}
            </p>
          </div>
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 hover:scale-[1.01] transition duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 opacity-70 blur-xl dark:opacity-45" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
              <img 
                src="/studentwithaitutor.png" 
                alt="Student studying with ElimuTube AI Tutor" 
                className="w-full h-auto object-cover aspect-4/3 sm:aspect-video lg:aspect-4/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Interactive Cards Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl tracking-tight">
            {t("How AI and Teachers Collaborate", "Jinsi AI na Walimu Wanavyoshirikiana")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t(
              "Hover over or tap the cards below to see how our hybrid educational pipeline keeps you engaged and learning faster.",
              "Vuta kipanya chako au gusa kadi hapa chini kuona jinsi ushirikiano huu unavyorahisisha masomo yako ya kila siku."
            )}
          </p>
        </div>

        {/* 4 Floating Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Card 1: Float Slow */}
          <Card className="animate-float-slow border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-500">
                <Play className="size-6 fill-amber-500/20" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("Step 1: Core Teacher Video", "Hatua 1: Video za Kufundisha za Mwalimu")}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">
                  {t("HUMAN LED • CURRICULUM ALIGNED", "WALIMU WAZOEFU • MTAALA RASMI")}
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  "Students watch high-definition video playlists taught by Tanzania's best teachers. These lessons explain syllabus concepts step-by-step with practical examples and Swahili context.",
                  "Wanafunzi wanaanza kwa kuangalia video za masomo zilizofundishwa na walimu bora nchini. Masomo haya yanafuata mtaala wa NECTA na kueleza dhana ngumu kwa lugha rahisi na mifano ya kawaida."
                )}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Float Medium */}
          <Card className="animate-float-medium border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-500">
                <Brain className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("Step 2: Bilingual AI Summaries", "Hatua 2: Muhtasari wa Lugha Mbili wa AI")}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">
                  {t("AI POWERED • MULTILINGUAL HELP", "MICHAKATO YA AI • LUGHA MBILI")}
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  "Right next to the video, our AI instantly summarizes key terms, builds memory tricks, and answers student questions in both Swahili and English, matching the teacher's vocabulary.",
                  "Kando kabisa ya video, msaidizi wa AI anakupa muhtasari wa mada, maneno magumu, na kujibu maswali yako yote kwa Kiswahili au Kiingereza ili kuondoa utata wa msamiati."
                )}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Float Fast */}
          <Card className="animate-float-fast border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:border-pink-500/40 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-500">
                <Cpu className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("Step 3: Instant Self-Assessment", "Hatua 3: Upimaji wa Papo kwa Papo")}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">
                  {t("AI GENERATED • CHAPTER SPECIFIC", "KUTATHMINI KISASA • KILA MADA")}
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  "AI designs chapter-specific self-test quizzes based on the exact lessons the student watched. The student receives immediate feedback and recommendations on what parts to re-watch.",
                  "Mfumo wetu wa AI unatengeneza chemsha bongo (quizzes) kulingana na yale uliyojifunza kwenye video. Wanafunzi wanapata matokeo yao mara moja na ushauri wa maeneo ya kurudia."
                )}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Float Slow */}
          <Card className="animate-float-slow border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                <RefreshCw className="size-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("Step 4: Smart Teacher Feedback", "Hatua 4: Taarifa kwa Mwalimu")}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-1">
                  {t("HYBRID INSIGHTS • CONTINUOUS IMPROVEMENT", "MAONI YA KISASA • UBORESHAJI")}
                </p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(
                  "Common mistakes and misunderstood concepts are automatically aggregated and reported to the teacher, allowing them to focus their next live classrooms on those exact problem areas.",
                  "Makosa ya mara kwa mara na mada zinazowapa shida wanafunzi hukusanywa na kutumwa kwa mwalimu. Hii inamsaidia mwalimu kuandaa vipindi vifuatavyo vya live akilenga kutatua matatizo hayo."
                )}
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* INTERACTIVE AI CHAT SIMULATOR */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-900 bg-linear-to-b from-slate-50 to-white dark:from-slate-900/20 dark:to-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
          
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 animate-in fade-in duration-500">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("Try Our Bilingual AI Tutor", "Jaribu Msaidizi wa AI wa Lugha Mbili")}
            </h2>
            <p className="text-sm text-slate-650 dark:text-slate-400">
              {t(
                "Select a subject below and switch languages to experience how the AI explains complex syllabus concepts instantly in both English and Swahili.",
                "Chagua somo hapa chini na ubadilishe lugha uone jinsi AI inavyofafanua dhana ngumu za masomo kwa Kiingereza na Kiswahili papo hapo."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Topic Selectors */}
            <div className="md:col-span-4 flex flex-col gap-3 justify-center">
              <button
                onClick={() => setActiveTopic("biology")}
                className={`p-4 rounded-xl border text-left transition duration-250 cursor-pointer flex items-center gap-3 ${
                  activeTopic === "biology"
                    ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-500 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.08)]"
                    : "bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span className="size-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-500 flex items-center justify-center font-bold text-xs shrink-0">BIO</span>
                <div>
                  <h4 className="text-sm font-bold">{t("Biology", "Biolojia")}</h4>
                  <p className="text-[10px] opacity-80">{t("Osmosis Process", "Mchakato wa Osmosis")}</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTopic("chemistry")}
                className={`p-4 rounded-xl border text-left transition duration-250 cursor-pointer flex items-center gap-3 ${
                  activeTopic === "chemistry"
                    ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-550 font-bold shadow-[0_4px_12px_rgba(99,102,241,0.08)]"
                    : "bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span className="size-8 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-550 flex items-center justify-center font-bold text-xs shrink-0">CHE</span>
                <div>
                  <h4 className="text-sm font-bold">{t("Chemistry", "Kemia")}</h4>
                  <p className="text-[10px] opacity-80">{t("Acids vs Bases", "Asidi dhidi ya Besi")}</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTopic("math")}
                className={`p-4 rounded-xl border text-left transition duration-250 cursor-pointer flex items-center gap-3 ${
                  activeTopic === "math"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-550 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.08)]"
                    : "bg-white dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-350 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span className="size-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-550 flex items-center justify-center font-bold text-xs shrink-0">MAT</span>
                <div>
                  <h4 className="text-sm font-bold">{t("Mathematics", "Hisabati")}</h4>
                  <p className="text-[10px] opacity-80">{t("Quadratic Equations", "Fomula ya Quadratic")}</p>
                </div>
              </button>
            </div>

            {/* Simulated Chat Interface */}
            <div className="md:col-span-8 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/40 shadow-xl overflow-hidden min-h-[380px] hover:shadow-2xl transition duration-300">
              
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black relative shrink-0">
                    AI
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-950 dark:text-white flex items-center gap-1.5">
                      ElimuTube AI Tutor
                    </h5>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t("Active Now", "Inafanya kazi sasa")}</p>
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    onClick={() => setChatLang("EN")}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      chatLang === "EN"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setChatLang("SW")}
                    className={`px-3 py-1 rounded-md transition cursor-pointer ${
                      chatLang === "SW"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"
                    }`}
                  >
                    Kiswahili
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-5 flex-1 flex flex-col gap-4 bg-slate-50/30 dark:bg-slate-950/20 overflow-y-auto">
                
                {/* Student Bubble */}
                <div className="flex flex-col gap-1 items-end max-w-[85%] self-end">
                  <span className="text-[9px] text-slate-400 font-medium px-2">{t("You • Student", "Wewe • Mwanafunzi")}</span>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-none bg-indigo-600 text-white text-xs leading-relaxed shadow-sm font-semibold">
                    {activeTopic === "biology" && (
                      chatLang === "EN" ? "Explain the concept of osmosis in simple terms." : "Nieleze kuhusu osmosis kwa mifano rahisi."
                    )}
                    {activeTopic === "chemistry" && (
                      chatLang === "EN" ? "What is the difference between an acid and a base?" : "Kuna tofauti gani kati ya asidi (acid) na besi (base)?"
                    )}
                    {activeTopic === "math" && (
                      chatLang === "EN" ? "How do I solve a quadratic equation?" : "Ninasolu vipi equation ya quadratic?"
                    )}
                  </div>
                </div>

                {/* AI Bubble */}
                <div className="flex flex-col gap-1 items-start max-w-[85%] self-start">
                  <span className="text-[9px] text-slate-400 font-medium px-2">ElimuTube AI Tutor</span>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-850 dark:text-slate-200 text-xs leading-relaxed shadow-sm flex flex-col gap-2">
                    {activeTopic === "biology" && (
                      chatLang === "EN" ? (
                        <>
                          <p><strong>Osmosis</strong> is the movement of water molecules from a region of higher water concentration to a region of lower water concentration through a semi-permeable membrane.</p>
                          <p className="bg-amber-500/5 border-l-2 border-amber-500 p-2 rounded text-[11px] text-slate-650 dark:text-slate-300">
                            💡 <strong>Easy Analogy:</strong> Think of putting dried raisins in water—they swell up because water enters them via osmosis!
                          </p>
                        </>
                      ) : (
                        <>
                          <p><strong>Osmosis</strong> ni mwendo wa molekuli za maji kutoka sehemu yenye maji mengi kwenda sehemu yenye maji machache kupitia utando nyembamba unaochuja (semi-permeable membrane).</p>
                          <p className="bg-amber-500/5 border-l-2 border-amber-500 p-2 rounded text-[11px] text-slate-650 dark:text-slate-300">
                            💡 <strong>Mfano Rahisi:</strong> Ukiloweka zabibu kavu kwenye maji, hufura kwa sababu maji huingia ndani kwa osmosis!
                          </p>
                        </>
                      )
                    )}

                    {activeTopic === "chemistry" && (
                      chatLang === "EN" ? (
                        <>
                          <p>Here is the main difference between acids and bases:</p>
                          <ul className="list-disc pl-4 flex flex-col gap-1 text-[11px] text-slate-650 dark:text-slate-300">
                            <li><strong>Acids:</strong> Have a pH less than 7, taste sour, and turn blue litmus paper red (e.g., lemon juice).</li>
                            <li><strong>Bases:</strong> Have a pH greater than 7, feel slippery, and turn red litmus paper blue (e.g., soap solution).</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>Hapa kuna tofauti kuu kati ya asidi na besi:</p>
                          <ul className="list-disc pl-4 flex flex-col gap-1 text-[11px] text-slate-650 dark:text-slate-300">
                            <li><strong>Asidi (Acids):</strong> Zina pH chini ya 7, zina ladha ya uchachu, na hugeuza karatasi ya litmus ya bluu kuwa nyekundu (mfano: juisi ya limao).</li>
                            <li><strong>Besi (Bases):</strong> Zina pH zaidi ya 7, huteleza, na hugeuza karatasi ya litmus nyekundu kuwa bluu (mfano: sabuni).</li>
                          </ul>
                        </>
                      )
                    )}

                    {activeTopic === "math" && (
                      chatLang === "EN" ? (
                        <>
                          <p>To solve a quadratic equation of the form <strong>ax² + bx + c = 0</strong>, use the quadratic formula:</p>
                          <p className="font-mono text-center my-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 rounded text-amber-600 dark:text-amber-500 font-bold">
                            x = [-b ± √(b² - 4ac)] / 2a
                          </p>
                          <p>Just identify the coefficients <em>a</em>, <em>b</em>, and <em>c</em> from your equation and substitute them into the formula.</p>
                        </>
                      ) : (
                        <>
                          <p>Ili kutatua quadratic equation ya mfumo wa <strong>ax² + bx + c = 0</strong>, tumia fomula ya quadratic:</p>
                          <p className="font-mono text-center my-1.5 p-1.5 bg-slate-100 dark:bg-slate-950 rounded text-amber-600 dark:text-amber-500 font-bold">
                            x = [-b ± √(b² - 4ac)] / 2a
                          </p>
                          <p>Tambua tu viambatanisho (coefficients) <em>a</em>, <em>b</em>, na <em>c</em> kwenye equation yako na uviweke kwenye fomula hii kupata x.</p>
                        </>
                      )
                    )}
                  </div>
                </div>

              </div>

              {/* Chat Input Placeholder */}
              <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900/60 flex items-center gap-3">
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 text-slate-450 dark:text-slate-500 text-xs px-4 py-2.5 rounded-xl select-none">
                  {t("Ask AI Tutor a question...", "Uliza swali lolote...")}
                </div>
                <button className="bg-amber-500 text-slate-950 size-9 rounded-xl flex items-center justify-center shadow-xs shrink-0 cursor-not-allowed opacity-80">
                  <Sparkles className="size-4 fill-slate-950 stroke-none" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Why This Hybrid Approach Works */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-900 bg-slate-100/20 dark:bg-slate-950/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-8">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("Why Hybrid Education Leads to Higher Grades", "Kwa Nini Mfumo Shirikishi Unaleta Alama Bora")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-850">
              <GraduationCap className="size-8 text-amber-500 mb-3" />
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                {t("NECTA Aligned Pedagogy", "Syllabus Kamili ya Kitaifa")}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t("Lessons are strictly aligned with school syllabus guidelines. No random off-topic content.", "Maudhui yote yanapangwa kufuata miongozo na mada rasmi za masomo nchini Tanzania.")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-850">
              <MessageSquare className="size-8 text-indigo-500 mb-3" />
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                {t("No Language Barriers", "Hakuna Kikwazo cha Lugha")}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t("AI toggles translation instantly, clarifying English syllabus definitions with Swahili context.", "Msaidizi wa AI anakupa ufafanuzi kwa lugha mbili ili kuhakikisha hukwami kwenye maneno ya kiingereza.")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/40 dark:border-slate-850">
              <Star className="size-8 text-pink-500 mb-3 fill-pink-500/10" />
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                {t("Confidence Boost", "Kujiamini Katika Mitihani")}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t("Continuous practice with immediate explanations ensures students are fully prepared before NECTA exams.", "Mazoezi ya mara kwa mara pamoja na maelezo ya msaidizi wa AI yanamjengea mwanafunzi uwezo mkubwa wa kufanya vizuri.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section (CTAs) */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-900 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("Experience the Hybrid Power in Our App", "Jifunze Kupitia Mfumo huu Kwenye App Yetu")}
          </h2>
          <p className="max-w-2xl text-slate-550 dark:text-slate-400 leading-relaxed text-sm">
            {t(
              "Both video lectures and AI interactive summaries are fully integrated inside our official mobile app. Download it now to start learning smart.",
              "Video zote za walimu pamoja na muhtasari wa kujiuliza kwa AI vipo ndani ya app yetu ya simu ya mkononi. Pakua sasa ili uanze kusoma kwa ufanisi zaidi."
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 justify-center">
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
      </section>

    </div>
  );
}
