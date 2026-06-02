import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../theme/page_transitions.dart';
import '../main.dart';
import 'login_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingData> _slides = [
    OnboardingData(
      titleEn: 'Learn from Tanzania\'s Best Teachers',
      titleSw: 'Jifunze kutoka kwa Walimu Bora',
      descriptionEn: 'Access high-quality video lessons mapped directly to the NECTA curriculum.',
      descriptionSw: 'Pata masomo ya video yenye ubora wa juu yaliyoundwa kwa mtaala wa NECTA.',
      icon: Icons.video_library_rounded,
      gradient: [AppTheme.primary, AppTheme.skyBlue],
    ),
    OnboardingData(
      titleEn: 'Interactive Quizzes & AI Summaries',
      titleSw: 'Mazoezi ya Kuingiliana na Muhtasari wa AI',
      descriptionEn: 'Test your understanding with localized quizzes and get instant summaries from our AI Tutor.',
      descriptionSw: 'Pima uelewa wako kwa majaribio na upate muhtasari wa papo hapo kutoka kwa Mwalimu wetu wa AI.',
      icon: Icons.psychology_rounded,
      gradient: [AppTheme.skyBlue, AppTheme.teal],
    ),
    OnboardingData(
      titleEn: 'Empowering Teachers & Creators',
      titleSw: 'Kuwezesha Walimu na Waandishi',
      descriptionEn: 'Publish lessons, build quizzes, track earnings, and request instant mobile payouts.',
      descriptionSw: 'Chapisha masomo, tengeneza majaribio, fuatilia mapato, na uombe malipo ya simu ya mkononi.',
      icon: Icons.payments_rounded,
      gradient: [AppTheme.teal, AppTheme.secondary],
    ),
  ];

  void _finishOnboarding() {
    Navigator.pushReplacement(
      context,
      FadePageRoute(child: const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsProvider>();
    final isSwahili = settings.locale.languageCode == 'sw';

    return Scaffold(
      body: Stack(
        children: [
          // Slides
          PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentPage = index;
              });
            },
            itemCount: _slides.length,
            itemBuilder: (context, index) {
              final slide = _slides[index];
              return Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: slide.gradient,
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 64),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Glowing Icon Container
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 30,
                            spreadRadius: 10,
                          ),
                        ],
                      ),
                      child: Icon(
                        slide.icon,
                        size: 100,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 48),
                    Text(
                      isSwahili ? slide.titleSw : slide.titleEn,
                      style: const TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1.2,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      isSwahili ? slide.descriptionSw : slide.descriptionEn,
                      style: const TextStyle(
                        fontSize: 16,
                        color: Colors.white70,
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              );
            },
          ),

          // Top Header (Language Toggle)
          Positioned(
            top: 50,
            right: 16,
            child: TextButton(
              onPressed: () => settings.toggleLanguage(),
              style: TextButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.black12,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: Text(isSwahili ? 'English' : 'Kiswahili', style: const TextStyle(fontWeight: FontWeight.bold)),
            ),
          ),

          // Bottom Navigation
          Positioned(
            bottom: 48,
            left: 24,
            right: 24,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Skip Button or empty placeholder
                _currentPage < _slides.length - 1
                    ? TextButton(
                        onPressed: _finishOnboarding,
                        child: Text(
                          isSwahili ? 'Ruka' : 'Skip',
                          style: const TextStyle(color: Colors.white70, fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                      )
                    : const SizedBox(width: 60),

                // Indicators
                Row(
                  children: List.generate(
                    _slides.length,
                    (index) => AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      height: 8,
                      width: _currentPage == index ? 24 : 8,
                      decoration: BoxDecoration(
                        color: _currentPage == index ? Colors.white : Colors.white60,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),

                // Next or Get Started Floating Pill Button
                ElevatedButton(
                  onPressed: () {
                    if (_currentPage < _slides.length - 1) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeInOut,
                      );
                    } else {
                      _finishOnboarding();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: _slides[_currentPage].gradient.last,
                    elevation: 8,
                    shadowColor: Colors.black.withOpacity(0.3),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _currentPage == _slides.length - 1
                            ? (isSwahili ? 'Anza' : 'Get Started')
                            : (isSwahili ? 'Mbele' : 'Next'),
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 6),
                      Icon(
                        _currentPage == _slides.length - 1 ? Icons.done : Icons.arrow_forward,
                        size: 18,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class OnboardingData {
  final String titleEn;
  final String titleSw;
  final String descriptionEn;
  final String descriptionSw;
  final IconData icon;
  final List<Color> gradient;

  OnboardingData({
    required this.titleEn,
    required this.titleSw,
    required this.descriptionEn,
    required this.descriptionSw,
    required this.icon,
    required this.gradient,
  });
}
