import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../theme/page_transitions.dart';
import 'quiz_player_screen.dart';

class VideoPlayerScreen extends StatefulWidget {
  final String lessonId;
  final dynamic lesson;

  const VideoPlayerScreen({super.key, required this.lessonId, required this.lesson});

  @override
  State<VideoPlayerScreen> createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isPlaying = false;
  double _sliderValue = 0.0;
  bool _subtitlesEnabled = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lesson = widget.lesson;
    final title = lesson['title'] ?? 'Lesson';
    final titleSw = lesson['title_sw'] ?? 'Somo';
    final subject = lesson['subject'] ?? 'SUBJECT';
    final formLevel = lesson['form_level']?.toString().replaceAll('_', ' ') ?? 'FORM';

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Simulated 16:9 Video Player
          AspectRatio(
            aspectRatio: 16 / 9,
            child: Container(
              color: Colors.black,
              child: Stack(
                children: [
                  Center(
                    child: IconButton(
                      iconSize: 64,
                      icon: Icon(
                        _isPlaying ? Icons.pause_circle_filled : Icons.play_circle_filled,
                        color: Colors.white,
                      ),
                      onPressed: () {
                        setState(() => _isPlaying = !_isPlaying);
                      },
                    ),
                  ),
                  // Video controls overlay
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.transparent, Colors.black87],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Row(
                        children: [
                          Text(
                            _formatDuration((_sliderValue * 1800).round()),
                            style: const TextStyle(color: Colors.white, fontSize: 12),
                          ),
                          Expanded(
                            child: Slider(
                              value: _sliderValue,
                              activeColor: AppTheme.skyBlue,
                              inactiveColor: Colors.white24,
                              onChanged: (val) {
                                setState(() => _sliderValue = val);
                              },
                            ),
                          ),
                          Text(
                            _formatDuration(1800),
                            style: const TextStyle(color: Colors.white, fontSize: 12),
                          ),
                          IconButton(
                            icon: Icon(
                              _subtitlesEnabled ? Icons.subtitles : Icons.subtitles_off,
                              color: Colors.white,
                              size: 20,
                            ),
                            onPressed: () {
                              setState(() => _subtitlesEnabled = !_subtitlesEnabled);
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Metadata section
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.skyBlue.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        subject,
                        style: const TextStyle(color: AppTheme.skyBlue, fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        formLevel,
                        style: TextStyle(color: Colors.grey[700], fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(titleSw, style: TextStyle(fontSize: 14, color: Colors.grey[600], fontStyle: FontStyle.italic)),
              ],
            ),
          ),

          // Tabs
          TabBar(
            controller: _tabController,
            labelColor: AppTheme.skyBlue,
            unselectedLabelColor: Colors.grey,
            indicatorColor: AppTheme.skyBlue,
            tabs: const [
              Tab(text: 'Muhtasari'),
              Tab(text: 'Quiz'),
              Tab(text: 'AI Tutor'),
              Tab(text: 'Notes'),
            ],
          ),

          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                // Summary tab
                SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.android_rounded, color: Colors.orange, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            '🤖 AI — Muhtasari wa Somo / Summary',
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange[800]),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Katika somo hili, tumejadili mada muhimu sana ya silabi ya Tanzania. Tumeangalia fasili, misingi, na jinsi ya kutatua matatizo katika mitihani ya Necta.',
                        style: TextStyle(fontSize: 14, height: 1.5),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'In this lesson we covered major concepts required for standard exams. Make sure to download the PDF attachment and check the mock quiz.',
                        style: TextStyle(fontSize: 14, height: 1.5, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                // Quiz tab
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.quiz_rounded, size: 64, color: AppTheme.skyBlue),
                      const SizedBox(height: 16),
                      const Text(
                        'Pima Ufahamu Wako! / Quiz Time!',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Jibu maswali 5 kujaribu uwezo wako baada ya somo hili.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            SlidePageRoute(child: QuizPlayerScreen(lessonId: widget.lessonId)),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.accent,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        ),
                        child: const Text('Anza Maswali / Start Quiz', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                ),
                // AI Tutor tab
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.android, size: 54, color: AppTheme.primary),
                      const SizedBox(height: 12),
                      const Text(
                        'Unahitaji msaada wa karibu? / Need help?',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Uliza AI yetu maswali yoyote ya ziada kuhusu mada hii.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          _tabController.animateTo(0); // Dummy redirect / action
                        },
                        child: const Text('Uliza Mwalimu AI'),
                      ),
                    ],
                  ),
                ),
                // Notes tab
                SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Muhtasari na PDF Notes / Attachments',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 12),
                      ListTile(
                        leading: const Icon(Icons.picture_as_pdf, color: Colors.red, size: 36),
                        title: const Text('Silabi Notes & Formula.pdf'),
                        subtitle: const Text('2.4 MB • English & Swahili'),
                        trailing: IconButton(
                          icon: const Icon(Icons.download),
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Downloading notes... / Inapakua faili...')),
                            );
                          },
                        ),
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

  String _formatDuration(int seconds) {
    final min = seconds ~/ 60;
    final sec = seconds % 60;
    return "$min:${sec.toString().padLeft(2, '0')}";
  }
}
