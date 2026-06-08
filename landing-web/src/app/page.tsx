"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  Sparkles, 
  BookOpen, 
  Users, 
  Check, 
  DollarSign, 
  Tv, 
  Download, 
  Smartphone, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Shield, 
  Star, 
  Award,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

interface Stats {
  teachers: number;
  students: number;
  lessons: number;
  totalVolume: number;
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    teachers: 0,
    students: 0,
    lessons: 0,
    totalVolume: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);

  // Fetch real-time dashboard statistics from Railway backend
  useEffect(() => {
    fetch("https://elimutube-production.up.railway.app/dashboard/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setStats({
            teachers: data.teachers || 0,
            students: data.students || 0,
            lessons: data.lessons || 0,
            totalVolume: data.totalVolume || 0
          });
        }
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching statistics:", err);
        setStatsLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-200 overflow-x-hidden">
      
      {/* Background radial gradients for layout aesthetics */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary),transparent_50%)] opacity-5 dark:opacity-10" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.06),transparent_50%)]" />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Hero left text content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
              {language === "SW" ? (
                <>
                  Soma na <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Walimu Bingwa</span> wa Tanzania
                </>
              ) : (
                <>
                  Learn from <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Tanzania's Top</span> Educators
                </>
              )}
            </h1>

            <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                "Access NECTA curriculum-aligned video courses, bilingual study guides, and real-time virtual rooms. Support local teachers directly—your subscription supports their work directly.",
                "Pata masomo ya video ya mtaala wa NECTA, muhtasari wa lugha mbili, na vyumba vya madarasa ya live. Saidia walimu wa hapa nyumbani moja kwa moja—ada yako ya kujiunga inakwenda kuwasaidia."
              )}
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start mt-2">
              <a href="#download">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base px-8 py-6 rounded-xl shadow-[0_10px_20px_rgba(245,158,11,0.2)] transition active:scale-[0.98] cursor-pointer flex items-center justify-center"
                >
                  {t("Download Mobile App", "Pakua App ya Simu")}
                  <Smartphone className="ml-2 size-5" />
                </Button>
              </a>
              <Link href="/lessons">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 px-8 py-6 rounded-xl transition cursor-pointer flex items-center justify-center"
                >
                  {t("Explore Syllabus Catalog", "Vinjari Masomo")}
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/ai" className="w-full sm:w-auto">
                <Button 
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-slate-600 dark:text-slate-400 hover:text-amber-500 transition cursor-pointer flex items-center justify-center font-semibold"
                >
                  <Sparkles className="mr-2 size-4 text-amber-500 fill-amber-500/10" />
                  {t("Bilingual AI Tutor", "Tuta wa AI")}
                </Button>
              </Link>
            </div>

            {/* Live statistics fetched from Backend */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-900 pt-8 mt-4 text-left max-w-md mx-auto lg:mx-0">
              <div className="hover:translate-y-[-2px] transition duration-200">
                <span className="block text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                  {statsLoading ? "..." : stats.students >= 1000 ? `${(stats.students / 1000).toFixed(0)}k+` : stats.students}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-bold">
                  {t("Students", "Wanafunzi")}
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-900 pl-4 hover:translate-y-[-2px] transition duration-200">
                <span className="block text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                  {statsLoading ? "..." : stats.teachers}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-bold">
                  {t("Educators", "Walimu Bingwa")}
                </span>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-900 pl-4 hover:translate-y-[-2px] transition duration-200">
                <span className="block text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                  {statsLoading ? "..." : stats.lessons}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider font-bold">
                  {t("Video Lessons", "Masomo ya Video")}
                </span>
              </div>
            </div>
          </div>

          {/* Hero right visual asset card */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 hover:scale-[1.01] transition duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 opacity-70 blur-xl dark:opacity-45" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
              <img 
                src="/students.jpg" 
                alt="Students studying on ElimuTube" 
                className="w-full h-auto object-cover aspect-4/3 sm:aspect-video lg:aspect-4/3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (STUDY & TEACH WISE) */}
      <section className="py-20 border-t border-slate-200/80 dark:border-slate-900 bg-slate-100/30 dark:bg-slate-950/50 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4 animate-in fade-in duration-500">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
              {t("How it Works", "Jinsi Inavyofanya Kazi")}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t("How ElimuTube Works", "Jinsi ElimuTube Inavyofanya Kazi")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t(
                "ElimuTube is a single mobile app offering a complete educational system. Learn how it works study-wise for both students and teachers.",
                "ElimuTube ni app moja inayotoa mfumo kamili wa elimu. Angalia jinsi inavyofanya kazi kimasomo kwa wanafunzi na walimu."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Left Column: Student Path */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <BookOpen className="size-5" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {t("For Students: The Study Journey", "Kwa Wanafunzi: Safari ya Kujifunza")}
                </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Step 1 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold text-sm">
                    01
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
                      {t("Select Class & Syllabus Topics", "Chagua Darasa na Mada za Masomo")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Browse high-quality playlists mapped to secondary school subjects, covering Form 1 to Form 6 based on the official curriculum.",
                        "Vinjari mada za masomo ya sekondari kuanzia Kidato cha 1 hadi cha 6 yaliyopangwa kwa kufuata mtaala rasmi wa taifa."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold text-sm">
                    02
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
                      {t("Download Video Lectures Offline", "Pakua Video na Usome Offline")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Download the best educators' video lessons directly to your smartphone. Watch them offline anytime without spending extra mobile data bundles.",
                        "Pakua video za mafundisho kutoka kwa walimu unaowapenda moja kwa moja kwenye simu yako na uziangalie bila kuhitaji internet ya ziada."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold text-sm">
                    03
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
                      {t("Chat with AI Study Assistant", "Uliza Msaidizi wa Kujifunza wa AI")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Ask curriculum-related questions in English or Swahili. Receive immediate explanations and study summaries to clear your doubts instantly.",
                        "Uliza maswali ya masomo kwa lugha mbili (Kiingereza/Kiswahili) na upokee maelezo mafupi na rahisi ya kukusaidia kuelewa haraka."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 font-bold text-sm">
                    04
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
                      {t("Practice Quizzes & Grade Checks", "Pima Uelewa kwa Chemsha Bongo")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Take self-assessment quizzes after each chapter. Get real-time grading and review notes to identify topics where you need improvement.",
                        "Fanya mazoezi na chemsha bongo baada ya kumaliza mada. Pata alama zako papo hapo kuona mada zinazohitaji nguvu zaidi."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Teacher Path */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Users className="size-5" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {t("For Teachers: The Teaching Journey", "Kwa Walimu: Safari ya Kufundisha")}
                </h3>
              </div>

              <div className="flex flex-col gap-4">
                {/* Step 1 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 font-bold text-sm">
                    01
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">
                      {t("Apply & Verify Professional Credentials", "Omba na Uhakiki Vyeti")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Submit your identification card and degree or teaching credentials to join our verified panel of national educators.",
                        "Wasilisha kitambulisho na vyeti vyako vya kitaaluma vya ualimu ili kupata uhakiki na idhini ya kufundisha kwenye mtandao wetu."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 font-bold text-sm">
                    02
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">
                      {t("Publish Custom Course Playlists", "Weka Playlist za Masomo")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Structure video classes and upload PDF study notes to guide students through complicated physics, mathematics, chemistry, and other subjects.",
                        "Weka na upange video zako pamoja na muhtasari (notes) kusaidia wanafunzi kuelewa masomo ya sayansi, sanaa na biashara."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 font-bold text-sm">
                    03
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">
                      {t("Stream Interactive Live Lectures", "Rusha Vipindi vya Live")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "Schedule interactive live video classrooms, read incoming chat messages, and answer students' questions in real time.",
                        "Panga ratiba ya masomo ya live na uwasiliane na wanafunzi papo kwa papo kupitia sehemu ya chat ya video yetu ya live."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="group flex gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-850 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out cursor-pointer">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 font-bold text-sm">
                    04
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-indigo-500 transition-colors">
                      {t("Track Performance & Support Students", "Fuatilia Uelewa wa Wanafunzi")}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {t(
                        "View student participation metrics, analyze common quiz mistakes, and adjust your teaching playlists accordingly to boost grades.",
                        "Pata tathmini ya mahudhurio ya wanafunzi, kagua maswali yanayowapa ugumu katika quizzes na uwaongoze kwa ufanisi zaidi."
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DOWNLOAD APPS SECTION */}
      <section id="download" className="py-20 border-t border-slate-200/80 dark:border-slate-900 bg-white dark:bg-slate-950 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header & Single App Download Action */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-6 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
              {t("Get the Application", "Pakua Application Yetu")}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t("One App. Two Sides.", "App Moja. Pande Mbili.")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t(
                "ElimuTube is a single mobile app designed for both students and teachers. Choose your role when you sign up. Download it today for Android and iOS devices.",
                "ElimuTube ni app moja ya simu iliyoundwa kwa ajili ya wanafunzi na walimu. Chagua nafasi yako unaposajiliwa. Pakua leo kwenye Android na iOS."
              )}
            </p>

            {/* Combined App Store & Play Store download links */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
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

          {/* Cards for the Two Sides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Student Side Card */}
            <Card className="border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:border-amber-500/40 transition duration-350">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                    <BookOpen className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {t("The Student Side", "Upande wa Mwanafunzi")}
                    </h3>
                    <p className="text-xs text-slate-500">{t("Learn & Excel", "Soma & Faulu")}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  {t(
                    "Learn at your own pace from Tanzania's best teachers. Download lessons to watch offline, take auto-graded quizzes, join live classes, and chat with your personal AI study buddy.",
                    "Soma kwa kasi yako ukitumia walimu bingwa wa Tanzania. Pakua video ili uziangalie bila internet, fanya chemsha bongo (quizzes) na chat na msaidizi wa AI."
                  )}
                </p>

                <ul className="flex flex-col gap-2.5 mt-4 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-amber-500 shrink-0" />
                    <span>{t("NECTA syllabus-aligned video subjects", "Video za masomo kulingana na mtaala wa NECTA")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-amber-500 shrink-0" />
                    <span>{t("Offline Download Mode to save internet MBs", "Njia ya offline ili kuokoa MB zako za internet")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-amber-500 shrink-0" />
                    <span>{t("24/7 AI tutor assistant in Swahili & English", "Msaidizi wa AI saa 24 kwa Kiswahili na Kiingereza")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-amber-500 shrink-0" />
                    <span>{t("Instant subscription via M-Pesa, Airtel, Tigo", "Lipia haraka kupitia M-Pesa, Airtel Money, Tigo Pesa")}</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Teacher Side Card */}
            <Card className="border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition duration-350">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Users className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {t("The Teacher Side", "Upande wa Mwalimu")}
                    </h3>
                    <p className="text-xs text-indigo-500 font-semibold">{t("Teach & Earn", "Fundisha & Nufaika")}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  {t(
                    "Turn your expertise into earnings. Set up your channel, upload lectures, auto-generate student study guides, host live interactive sessions, and earn direct mobile money payouts.",
                    "Badilisha ujuzi wako kuwa kipato. Fungua chaneli yako, weka masomo na muhtasari, endesha madarasa ya live na upate pesa moja kwa moja kwenye simu yako."
                  )}
                </p>

                <ul className="flex flex-col gap-2.5 mt-4 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500 shrink-0" />
                    <span>{t("Set your own custom subscription fee", "Panga bei yako ya ada kila mwezi")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500 shrink-0" />
                    <span>{t("Keep 70% of subscription revenue", "Baki na 70% ya mapato yote ya ada")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500 shrink-0" />
                    <span>{t("Direct automatic M-Pesa payouts on the 5th", "Malipo ya moja kwa moja ya M-Pesa tarehe 5")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-indigo-500 shrink-0" />
                    <span>{t("Simple ID and degree verification system", "Mfumo rahisi wa uhakiki wa vyeti na kitambulisho")}</span>
                  </li>
                </ul>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* MOCK VIDEO DEMO DIALOG */}
      <Dialog open={demoVideoOpen} onOpenChange={setDemoVideoOpen}>
        <DialogContent className="bg-slate-950 border-slate-800 max-w-3xl p-2 rounded-2xl overflow-hidden aspect-video">
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <iframe 
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="ElimuTube Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
            <Badge className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-bold border-none text-xs">
              Mwalimu Halima's Demo: Biology
            </Badge>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
