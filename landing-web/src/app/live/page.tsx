"use client";

import React from "react";
import { 
  Tv, 
  MessageCircle, 
  Clock, 
  Radio, 
  Smartphone, 
  Play,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function LiveMarketingPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {t("Virtual Classrooms in Real Time", "Darasa la Live Kiganjani Mwako")}
            </h1>
            <p className="text-lg text-slate-650 dark:text-slate-400 leading-relaxed">
              {t(
                "Join scheduled virtual classrooms, chat live with educators, and clear your doubts instantly. All live sessions are optimized for local networks to ensure data-saving, high-definition streaming.",
                "Jiunge na madarasa ya live yaliyopangwa, chat na mwalimu papo kwa papo na uondoe mashaka yako yote. Vipindi vimeboreshwa ili kutumia MB chache za internet."
              )}
            </p>
          </div>
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 hover:scale-[1.01] transition duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 opacity-70 blur-xl dark:opacity-45" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
              <img 
                src="/live.jpg" 
                alt="Live Classes on ElimuTube" 
                className="w-full h-auto object-cover aspect-4/3 sm:aspect-video lg:aspect-4/3"
              />
            </div>
          </div>
        </div>

        {/* KEY LIVE FEATURES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Radio className="size-6 text-amber-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("Real-Time Video", "Video ya Papo kwa Papo")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "High-definition video lectures streamed directly from your teacher. Optimized dynamic bitrate ensures streaming works even on 3G connections.",
                  "Video za masomo zenye ubora wa juu kutoka kwa mwalimu wako. Teknolojia yetu inahakikisha video inacheza vizuri hata kwenye mtandao wa 3G."
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <MessageCircle className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("In-Class Live Chat", "Chat na Mwalimu")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "Ask questions, participate in polls, and discuss concepts with classmates during the active video feed. Get immediate clarification from the teacher.",
                  "Uliza maswali, shiriki kwenye kura, na jadiliana na wanafunzi wenzako wakati somo likiendelea. Mwalimu atajibu maswali yako live."
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Clock className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("Recorded Replays", "Kurudia Masomo yaliyopita")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t(
                  "Missed a live session? No problem. Every live class is automatically recorded and uploaded as a replay under the subject playlist for later review.",
                  "Ulikosa darasa la live? Usijali. Kila kipindi cha live kinarekodiwa na kupakiwa moja kwa moja kwenye playlist ili uweze kukiangalia baadaye."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* DETAILS FOR STUDENT AND TEACHERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {t("For Students: How to Join Live Rooms", "Kwa Wanafunzi: Jinsi ya Kujiunga")}
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-500 font-bold text-[10px]">1</span>
                <span>{t("Receive instant push notifications when your subscribed teacher goes live.", "Pata taarifa (notification) mwalimu wako anapoanza kipindi.")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-500 font-bold text-[10px]">2</span>
                <span>{t("Tap the notification or click 'Live' button inside the mobile app.", "Bofya taarifa hiyo au bonyeza kitufe cha 'Live' kwenye app.")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-500 font-bold text-[10px]">3</span>
                <span>{t("Type questions into the chat bar and check notes uploaded alongside the stream.", "Andika maswali kwenye chat na uone maelezo ya somo pembeni.")}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
              {t("For Teachers: How to Stream Live Lectures", "Kwa Walimu: Jinsi ya Kuanzisha Kipindi")}
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-500 font-bold text-[10px]">1</span>
                <span>{t("Schedule a classroom session inside the creator panel in the app.", "Panga ratiba ya somo la live kupitia sehemu ya mwalimu.")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-500 font-bold text-[10px]">2</span>
                <span>{t("Tap 'Start Live' to broadcast using your smartphone camera.", "Bonyeza 'Start Live' kurusha video kwa kutumia kamera ya simu.")}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-500 font-bold text-[10px]">3</span>
                <span>{t("Read incoming student comments live and explain answers in real time.", "Soma maswali ya wanafunzi yanayoingia na uwajibu moja kwa moja.")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CALL TO ACTION DOWNLOAD BLOCK */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {t("Watch & Participate on the Go", "Tazama na Shiriki Ukiwa Safarini")}
            </h3>
            <p className="text-sm font-semibold opacity-90 max-w-xl">
              {t(
                "ElimuTube is a single application with two sides. Select your role when you sign up. Live streaming features are fully optimized inside our mobile app.",
                "ElimuTube ni app moja yenye pande mbili. Chagua akaunti yako ukijisajili. Madarasa yote ya live yanaendeshwa ndani ya app ya simu."
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
