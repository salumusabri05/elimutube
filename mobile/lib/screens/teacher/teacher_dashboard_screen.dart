import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../shared/profile_settings_screen.dart';
import 'tabs/dashboard_tab.dart';
import 'tabs/content_upload_tab.dart';
import 'tabs/quiz_builder_tab.dart';
import 'tabs/earnings_payout_tab.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const DashboardTab(),
    const ContentUploadTab(),
    const QuizBuilderTab(),
    const EarningsPayoutTab(),
    const ProfileSettingsScreen(showAppBar: false),
  ];

  @override
  Widget build(BuildContext context) {
    final titles = [
      'ElimuTube - Mwalimu',
      'Pakia Somo / Content Upload',
      'Tengeneza Jaribio / Quiz Builder',
      'Mapato & Malipo / Earnings',
      'Mipangilio / Settings',
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(titles[_currentIndex], style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.teal,
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
            selectedItemColor: AppTheme.teal,
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
              BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dhibiti'),
              BottomNavigationBarItem(icon: Icon(Icons.video_call), label: 'Pakia'),
              BottomNavigationBarItem(icon: Icon(Icons.quiz), label: 'Maswali'),
              BottomNavigationBarItem(icon: Icon(Icons.payments), label: 'Mapato'),
              BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Akaunti'),
            ],
          ),
        ),
      ),
    );
  }
}
