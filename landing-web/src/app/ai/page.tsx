"use client";

import React from "react";
import { Sparkles, Brain, Cpu, MessageSquare, Play, RefreshCw, Star, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AIPage() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-24 border-b border-slate-200/80 dark:border-slate-900 bg-linear-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/40">
        <div className="absolute top-0 right-1/4 -z-10 size-[350px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-20 left-1/4 -z-10 size-[350px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center flex flex-col gap-6">
          
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            {t(
              "Top Teachers Powered by Smart AI Support",
              "Walimu Bingwa Wakiwezeshwa na Nguvu ya AI"
            )}
          </h1>
          
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t(
              "We believe AI should not replace human teachers. Instead, on ElimuTube, teachers teach the syllabus and our AI tutor explains, translates, and designs quizzes to clarify doubts instantly.",
              "Tunaamini AI haipaswi kuchukua nafasi ya mwalimu wa kibinadamu. Badala yake, kwenye ElimuTube, walimu wanafundisha mada na msaidizi wa AI anakusaidia kuelewa, kutafsiri, na kukupa maswali ya kufanya mazoezi."
            )}
          </p>
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
