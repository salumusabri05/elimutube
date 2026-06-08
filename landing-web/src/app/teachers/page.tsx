"use client";

import React, { useState } from "react";
import { 
  Users, 
  DollarSign, 
  ShieldCheck, 
  Tv, 
  ArrowRight, 
  Smartphone, 
  Play,
  Award,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function TeachersMarketingPage() {
  const { t, language } = useLanguage();
  const [subscribers, setSubscribers] = useState<number>(1000);
  const [pricePerStudent, setPricePerStudent] = useState<number>(5000);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-5 text-center lg:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              {t("Teach. Inspire. Earn.", "Fundisha. Hamasisha. Pata Kipato.")}
            </h1>
            <p className="text-lg text-slate-650 dark:text-slate-400 leading-relaxed">
              {t(
                "Join ElimuTube to create your subject channel, upload video lectures, and support thousands of students across Tanzania. Set your own subscription fees and earn 70% of the revenue.",
                "Jiunge na ElimuTube kufungua chaneli ya somo lako, weka video za mafundisho na kusaidia maelfu ya wanafunzi Tanzania. Panga bei yako ya ada na upokee 70% ya mapato."
              )}
            </p>
          </div>
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 hover:scale-[1.01] transition duration-300">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-violet-500/20 opacity-70 blur-xl dark:opacity-45" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl">
              <img 
                src="/teacher_peparing_lesson.jpg" 
                alt="Teacher preparing a lesson on ElimuTube" 
                className="w-full h-auto object-cover aspect-4/3 sm:aspect-video lg:aspect-4/3"
              />
            </div>
          </div>
        </div>

        {/* WHY TEACH ON ELIMUTUBE */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white text-center">
            {t("Why Educator Partnership Works", "Kwa Nini Ushirikiano na Walimu Unafanikiwa")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
              <CardContent className="p-6 flex gap-4">
                <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <DollarSign className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t("70% Subscription Payout", "Malipo ya Asilimia 70%")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {t(
                      "You set your own subscription price. When students join your channel, 70% of the funds go straight to your wallet. We run the platform on the remaining 30%.",
                      "Unapanga ada ya somo lako mwenyewe. Mwanafunzi anapojiunga, 70% ya malipo huenda kwako moja kwa moja na 30% hutumika kuendesha mifumo ya seva."
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
              <CardContent className="p-6 flex gap-4">
                <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Smartphone className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t("Direct Mobile Money Payouts", "Malipo ya Moja kwa Moja ya Simu")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {t(
                      "Receive your earnings automatically on the 5th of every month. Payouts are made directly to your M-Pesa, Airtel Money, or Tigo Pesa wallet.",
                      "Pokea mapato yako moja kwa moja tarehe 5 ya kila mwezi. Malipo yote yanafanyika kupitia akaunti yako ya M-Pesa, Airtel Money, au Tigo Pesa."
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
              <CardContent className="p-6 flex gap-4">
                <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t("Verification & Trust", "Uhakiki na Uaminifu")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {t(
                      "We verify every teacher's ID and diploma before they can publish. This ensures students get high-quality content and teachers keep professional standards.",
                      "Tunahakiki kitambulisho na cheti cha kila mwalimu kabla ya kuruhusiwa kupakia masomo. Hii inalinda ubora wa elimu kwa wanafunzi wetu."
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-900/30">
              <CardContent className="p-6 flex gap-4">
                <div className="size-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <Tv className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t("Your Personal TV Station", "Chaneli Yako Kama TV Station")}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    {t(
                      "Think of your channel as your own private TV classroom. Upload subject playlists, host live video classes, write notes, and communicate with students.",
                      "Chaneli yako ni kama darasa lako binafsi la TV. Weka masomo kwa mtiririko mzuri, endesha madarasa ya live, andika muhtasari na wasiliana na wanafunzi."
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TEACHER EARNINGS CALCULATOR */}
        <div className="flex flex-col gap-8">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("Calculate Your Earnings Potential", "Kadiria Mapato Yako na ElimuTube")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "Adjust the sliders below to estimate your potential monthly and annual income based on subscription fees and subscriber volume.",
                "Badilisha vipimo hapa chini ili kukadiria kipato chako cha kila mwezi na mwaka kulingana na ada na idadi ya wanafunzi."
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Input Controls */}
            <div className="md:col-span-6 flex flex-col gap-6 p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 shadow-sm justify-between">
              
              {/* Subscribers Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>{t("Active Subscribers", "Wanafunzi Waliojisajili")}</span>
                  <span className="text-indigo-650 dark:text-indigo-400 font-mono text-sm">{subscribers.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={subscribers}
                  onChange={(e) => setSubscribers(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>100</span>
                  <span>5,000</span>
                  <span>10,000+</span>
                </div>
              </div>

              {/* Price Selector */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>{t("Monthly Price per Student", "Ada ya Mwezi kwa Mwanafunzi")}</span>
                  <span className="text-indigo-650 dark:text-indigo-400 font-mono text-sm">{pricePerStudent.toLocaleString()} TZS</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[2000, 5000, 10000].map((price) => (
                    <button
                      key={price}
                      onClick={() => setPricePerStudent(price)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition duration-200 cursor-pointer ${
                        pricePerStudent === price
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 hover:border-slate-350"
                      }`}
                    >
                      {price.toLocaleString()} TZS
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  {t(
                    "* Recommended price for standard secondary school syllabus subject course play lists.",
                    "* Bei inayopendekezwa kwa mada na kozi za kawaida za masomo ya sekondari."
                  )}
                </p>
              </div>

            </div>

            {/* Results Output */}
            <div className="md:col-span-6 flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 shadow-md justify-between gap-6 hover:shadow-lg transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -z-10" />
              
              <div className="flex flex-col gap-4">
                <Badge className="bg-indigo-600 text-white font-bold border-none text-[10px] self-start">
                  70% {t("Teacher Share", "Fungu la Mwalimu")}
                </Badge>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-405 dark:text-slate-400 uppercase tracking-wider">{t("Estimated Monthly Income", "Kipato cha Kila Mwezi")}</span>
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {Math.round(subscribers * pricePerStudent * 0.7).toLocaleString()} <span className="text-sm font-bold text-slate-500">TZS</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-850 pt-4">
                  <span className="text-xs font-bold text-slate-405 dark:text-slate-400 uppercase tracking-wider">{t("Estimated Annual Income", "Kipato kwa Mwaka")}</span>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                    {Math.round(subscribers * pricePerStudent * 0.7 * 12).toLocaleString()} <span className="text-sm font-bold text-slate-500">TZS</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {t(
                    "Income estimations are based on active subscriptions after mobile operator processing fees. Platform splits and payouts are issued automatically on the 5th of every month.",
                    "Ukadiriaji wa kipato unategemea usajili unaofanya kazi baada ya makato ya makampuni ya simu. Malipo yanafanyika moja kwa moja tarehe 5 kila mwezi."
                  )}
                </p>
                <button 
                  onClick={() => alert(t("Please download our mobile app, sign up as a teacher and get verified to start uploading courses!", "Tafadhali pakua app yetu ya simu, jisajili kama mwalimu na upate uhakiki ili uanze kupakia masomo!"))}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-xs transition duration-200 cursor-pointer text-center"
                >
                  {t("Become a Verified Teacher Now", "Jisajili kama Mwalimu Sasa")}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* STEP-BY-STEP PROCESS FOR TEACHERS */}
        <div className="bg-slate-100 dark:bg-slate-900/40 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-850 flex flex-col gap-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {t("How to Start Teaching & Earning", "Jinsi ya Kuanza Kufundisha na Kupata Kipato")}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t("Launch your teaching career inside the mobile app in 4 steps:", "Anza kazi yako ya ualimu ndani ya app kwa hatua 4:")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-black text-indigo-500/30">01</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Download App", "Pakua Application")}</h5>
              <p className="text-xs text-slate-500">{t("Install the ElimuTube App on your mobile phone.", "Sakinisha app ya ElimuTube kwenye simu yako.")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-black text-indigo-500/30">02</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Apply to Verify", "Omba Uhakiki")}</h5>
              <p className="text-xs text-slate-500">{t("Select 'Teacher' role and submit your ID and teaching certificates.", "Chagua akaunti ya Mwalimu na utume vyeti vyako vya taaluma.")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-black text-indigo-500/30">03</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Upload Content", "Weka Masomo")}</h5>
              <p className="text-xs text-slate-500">{t("Create subject playlists, post notes, and schedule your live classes.", "Weka video za masomo, muhtasari, na panga ratiba ya live.")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-black text-indigo-500/30">04</span>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">{t("Receive Payouts", "Pokea Malipo")}</h5>
              <p className="text-xs text-slate-500">{t("Get monthly automatic payouts to your mobile wallet on the 5th.", "Pokea mapato ya ada kwenye simu yako kila tarehe 5 ya mwezi.")}</p>
            </div>
          </div>
        </div>

        {/* CALL TO ACTION DOWNLOAD BLOCK */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {t("Empower Tanzanian Students Today", "Wasaidie Wanafunzi wa Kitanzania Leo")}
            </h3>
            <p className="text-sm font-semibold opacity-90 max-w-xl">
              {t(
                "ElimuTube is a single application with two sides. Select the Teacher role to publish and monetize your courses. Download the app to get verified.",
                "ElimuTube ni app moja yenye pande mbili. Chagua akaunti ya Mwalimu ili kuanza kufundisha na kuingiza kipato. Pakua sasa kuanza uhakiki."
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
