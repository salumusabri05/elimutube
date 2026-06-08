"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Play, 
  Pause,
  Volume2, 
  VolumeX, 
  Target, 
  Compass, 
  Users, 
  Award, 
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Carousel Slide State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/ElimuTube_The_Boundless_Classroom/Slide1.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide2.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide3.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide4.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide5.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide6.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide7.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide8.JPG",
    "/ElimuTube_The_Boundless_Classroom/Slide9.JPG",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Play/pause the explainer video automatically based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial mute programmatically to ensure compliance with browser autoplay guidelines
    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.log("Autoplay on scroll was prevented by browser policy:", err);
              setIsPlaying(false);
            });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 transition-colors duration-200 overflow-x-hidden pt-24 pb-16">
      
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 dark:from-amber-600/5 dark:to-indigo-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 dark:from-indigo-600/5 dark:to-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Badge className="w-fit mx-auto px-3.5 py-1 bg-amber-500/10 text-amber-650 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
            {t("Who We Are", "Sisi ni Nani")}
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("Empowering Tanzanian Students", "Kuwamwezesha Wanafunzi wa Tanzania")}
          </h1>
          <p className="text-lg text-slate-650 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t(
              "ElimuTube is a dynamic mobile platform that delivers standard, high-quality video tutorials, bilingual notes, and smart AI tutor support matching the national NECTA syllabus.",
              "ElimuTube ni mfumo thabiti wa simu unaotoa mafunzo ya video ya kiwango cha juu, muhtasari wa lugha mbili, na msaidizi wa AI kulingana na mtaala wa kitaifa wa NECTA."
            )}
          </p>
        </div>

        {/* EXPLAINER VIDEO SECTION */}
        <div className="max-w-4xl mx-auto mb-20 animate-in fade-in duration-700 delay-205">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t("Watch Our Story & Platform Concept", "Tazama Historia na Lengo la Mfumo Wetu")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "Scroll to watch this quick 1-minute video overview explaining ElimuTube's vision and how it helps students excel.",
                "Shuka chini kutazama video hii fupi ya dakika 1 ikieleza maono ya ElimuTube na jinsi inavyosaidia wanafunzi kufaulu."
              )}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-850 shadow-2xl group bg-black">
            {/* Explainer video tag */}
            <video
              ref={videoRef}
              src="/ElimuTube__Access_Unlocked.mp4"
              autoPlay
              loop
              muted={true}
              preload="auto"
              playsInline
              className="w-full aspect-video object-cover mx-auto"
            />

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-between p-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play()
                          .then(() => setIsPlaying(true))
                          .catch((err) => console.error(err));
                      } else {
                        videoRef.current.pause();
                        setIsPlaying(false);
                      }
                    }
                  }}
                  className="size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="size-4 fill-white" />
                  ) : (
                    <Play className="size-4 fill-white" />
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setIsMuted(videoRef.current.muted);
                  }
                }}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 backdrop-blur-md transition active:scale-95 cursor-pointer text-xs font-bold"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="size-4" />
                    {t("Unmute", "Washa Sauti")}
                  </>
                ) : (
                  <>
                    <Volume2 className="size-4" />
                    {t("Mute", "Zima Sauti")}
                  </>
                )}
              </button>
            </div>

            {/* Quick Floating Sound indicator on bottom-right when overlay is hidden */}
            <div className="absolute bottom-4 right-4 z-10 group-hover:hidden flex gap-2">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !videoRef.current.muted;
                    setIsMuted(videoRef.current.muted);
                  }
                }}
                className="size-9 rounded-full bg-black/65 hover:bg-black/80 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* PITCH DECK SLIDESHOW CAROUSEL */}
        <div className="max-w-4xl mx-auto mb-20 animate-in fade-in duration-700">
          <div className="text-center mb-8">
            <Badge className="px-3.5 py-1 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              {t("Pitch Presentation", "Wasilisho la ElimuTube")}
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              {t("The Boundless Classroom", "Darasa Lisilo na Mipaka")}
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400">
              {t(
                "Click through our official platform presentation to learn about ElimuTube's mission, ecosystem, and future impact.",
                "Bofya kupitia wasilisho letu rasmi ili kujifunza kuhusu malengo, mfumo, na athari za baadaye za ElimuTube."
              )}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 group aspect-[4/3] sm:aspect-[16/9]">
            {/* Active Slide Image */}
            <div className="w-full h-full relative flex items-center justify-center">
              <img
                src={slides[currentSlide]}
                alt={`ElimuTube Presentation Slide ${currentSlide + 1}`}
                className="max-w-full max-h-full object-contain mx-auto transition duration-300"
              />
            </div>

            {/* Left navigation arrow */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition active:scale-90 cursor-pointer z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition active:scale-90 cursor-pointer z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="size-6" />
            </button>

            {/* Floating Index indicator (top-right) */}
            <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`size-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === index 
                    ? "bg-amber-500 w-6" 
                    : "bg-slate-300 dark:bg-slate-800 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 flex flex-col gap-5">
              <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center">
                <Target className="size-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("Our Mission", "Lengo Letu Kuu")}
              </h3>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-sm">
                {t(
                  "To democratize access to top-tier secondary education in Tanzania. We partner with the best classroom teachers to record video lectures, prepare dual-language study materials, and build intelligent AI learning assistants, ensuring every student has equal opportunities to succeed in national exams.",
                  "Kusawazisha fursa za kupata elimu bora ya sekondari nchini Tanzania. Tunashirikiana na walimu bingwa darasani kurekodi masomo ya video, kuandaa muhtasari wa lugha mbili, na kujenga wasaidizi werevu wa AI, kuhakikisha kila mwanafunzi anapata fursa sawa za kufanya vizuri katika mitihani ya kitaifa."
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 flex flex-col gap-5">
              <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-650 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center">
                <Compass className="size-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("Our Vision", "Maono Yetu")}
              </h3>
              <p className="text-slate-650 dark:text-slate-400 leading-relaxed text-sm">
                {t(
                  "To be the premier digital education partner for secondary school students in Tanzania and across East Africa, building a future where premium revision tools, personal tutoring, and exam preparation are affordable, convenient, and accessible on every smartphone.",
                  "Kuwa mshirika mkuu wa elimu ya kidijitali kwa wanafunzi wa shule za sekondari nchini Tanzania na Afrika Mashariki nzima, tukijenga mustakabali ambapo zana bora za marudio, mafunzo binafsi, na maandalizi ya mitihani ni nafuu na yanapatikana kwenye kila simu ya mkononi."
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CORE VALUES */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
              {t("Guiding Principles", "Misingi Yetu")}
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("What Drives ElimuTube", "Kinachotusukuma ElimuTube")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-1 transition duration-350">
              <Sparkles className="size-8 text-amber-500 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t("High Quality Teachers", "Walimu Bingwa")}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t(
                  "Every lesson is recorded by seasoned teachers with proven track records of delivering outstanding academic results.",
                  "Kila somo linarekodiwa na walimu wenye uzoefu wa miaka mingi na historia ya kuleta matokeo bora ya kitaaluma."
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-1 transition duration-350">
              <BookOpen className="size-8 text-amber-500 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t("Bilingual Focus", "Lugha Mbili (Dual-Language)")}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t(
                  "We bridge Swahili and English study guides to help students transition smoothly and fully grasp hard science and arts concepts.",
                  "Tunaunganisha masomo ya Kiswahili na Kiingereza kusaidia wanafunzi kuelewa vyema dhana ngumu za sayansi na sanaa."
                )}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:-translate-y-1 transition duration-350">
              <Award className="size-8 text-amber-500 mb-4" />
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {t("100% NECTA Syllabus Alignment", "Kufuata Mtaala wa NECTA 100%")}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t(
                  "Our platform is built specifically around the Tanzania national curriculum, ensuring relevance for Form 1 to Form 4 reviews.",
                  "Mfumo wetu umejengwa maalum kulingana na mtaala wa taifa wa Tanzania, kuhakikisha unakusaidia kuanzia Kidato cha Kwanza hadi cha Nne."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* LEADERSHIP TEAM */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12 flex flex-col gap-3">
            <Badge className="w-fit mx-auto px-3.5 py-1 bg-amber-500/10 text-amber-650 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
              {t("Our Leaders", "Viongozi Wetu")}
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("Meet the Team Behind ElimuTube", "Kutana na Timu ya ElimuTube")}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t(
                "Driving innovation in digital education across Tanzania.",
                "Tukiongoza uvumbuzi katika elimu ya kidijitali nchini Tanzania."
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* CEO Card */}
            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="size-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 text-2xl font-extrabold shadow-md">
                  SS
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Sabri Salumu</h4>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500 mt-1">
                    {t("CEO & Founder", "Mkurugenzi Mtendaji na Mwanzilishi")}
                  </p>
                </div>
                <p className="text-sm text-slate-550 dark:text-slate-400">
                  {t(
                    "Leading the vision to transform secondary school revision tools into accessible, high-yield digital media.",
                    "Akiongoza maono ya kubadilisha zana za marudio za sekondari kuwa maudhui ya kidijitali yanayofikika kwa urahisi."
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Manager Card */}
            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="size-20 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
                  KS
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">Khalid Singano</h4>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 mt-1">
                    {t("Manager", "Meneja")}
                  </p>
                </div>
                <p className="text-sm text-slate-550 dark:text-slate-400">
                  {t(
                    "Directing operations, teacher partnerships, and curriculum alignment to ensure elite quality learning material.",
                    "Akisimamia uendeshaji, ushirikiano na walimu, na kulinganisha mtaala ili kuhakikisha vifaa vya kiwango cha juu vya kujifunzia."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA BOTTOM SECTION */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200/85 dark:border-slate-850 p-8 sm:p-12 text-center bg-gradient-to-br from-amber-600 to-amber-500 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
          
          <div className="max-w-2xl mx-auto flex flex-col gap-6 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {t("Ready to Transform Your Grades?", "Uko Tayari Kuboresha Alama Zako?")}
            </h2>
            <p className="text-white/90 text-sm max-w-lg mx-auto">
              {t(
                "Download the ElimuTube app now to get unlimited access to top lectures, bilingual study summaries, and custom AI tutor assistance.",
                "Pakua app ya ElimuTube sasa ili kupata masomo yote, muhtasari wa lugha mbili, na msaidizi wa AI."
              )}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <Link href="/">
                <Button size="lg" className="bg-slate-950 text-amber-500 hover:bg-slate-900 border border-slate-900 rounded-full font-bold px-8 py-6 active:scale-95 transition cursor-pointer flex items-center justify-center">
                  {t("Get Started", "Anza Sasa")}
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
