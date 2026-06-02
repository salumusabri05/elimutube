import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../shared/profile_settings_screen.dart';
import 'tabs/home_feed_tab.dart';
import 'tabs/discover_tab.dart';
import 'tabs/progress_tab.dart';
import 'tabs/ai_tutor_tab.dart';

class StudentHomeScreen extends StatefulWidget {
  const StudentHomeScreen({super.key});

  @override
  State<StudentHomeScreen> createState() => _StudentHomeScreenState();
}

class _StudentHomeScreenState extends State<StudentHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const HomeFeedTab(),
    const DiscoverTab(),
    const ProgressTab(),
    const AiTutorTab(),
    const ProfileSettingsScreen(showAppBar: false),
  ];

  @override
  Widget build(BuildContext context) {
    final titles = [
      'ElimuTube',
      'Gundua / Discover',
      'Maendeleo Yangu / Progress',
      'Mwalimu AI / AI Tutor',
      'Mipangilio / Settings',
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_currentIndex], style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: _tabs[_currentIndex],
      bottomNavigationBar: Container(
        margin: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(30),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            selectedItemColor: AppTheme.skyBlue,
            unselectedItemColor: Colors.grey,
            type: BottomNavigationBarType.fixed,
            elevation: 0,
            backgroundColor: Colors.transparent,
            onTap: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            items: const [
              BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Nyumbani'),
              BottomNavigationBarItem(icon: Icon(Icons.explore), label: 'Gundua'),
              BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: 'Maendeleo'),
              BottomNavigationBarItem(icon: Icon(Icons.android), label: 'AI Tutor'),
              BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Akaunti'),
            ],
          ),
        ),
      ),
    );
  }
}
