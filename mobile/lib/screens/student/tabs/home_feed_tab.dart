import 'package:flutter/material.dart';
import '../../../services/api_service.dart';
import '../../../theme/app_theme.dart';
import '../../../theme/page_transitions.dart';
import '../video_player_screen.dart';

class HomeFeedTab extends StatefulWidget {
  const HomeFeedTab({super.key});

  @override
  State<HomeFeedTab> createState() => _HomeFeedTabState();
}

class _HomeFeedTabState extends State<HomeFeedTab> {
  List<dynamic> _lessons = [];
  bool _isLoading = true;
  String _selectedSubject = 'ALL';

  final List<String> _subjects = ['ALL', 'MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH', 'KISWAHILI'];

  @override
  void initState() {
    super.initState();
    _fetchLessons();
  }

  Future<void> _fetchLessons() async {
    try {
      final data = await ApiService.get('database/tables/lesson');
      setState(() {
        _lessons = data;
        _isLoading = false;
      });
    } catch (_) {
      // Fallback stub data if backend is offline/empty
      setState(() {
        _lessons = _getMockLessons();
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getMockLessons() {
    return [
      {
        'id': '1',
        'title': 'Advanced Calculus & Limits',
        'title_sw': 'Kalkulasi ya Juu na Mipaka',
        'subject': 'MATH',
        'form_level': 'FORM_4',
        'duration_sec': 2720,
        'is_free': false,
        'price_tsh': 5000,
        'teacher': {'display_name': 'Mwl. Juma', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=juma'}
      },
      {
        'id': '2',
        'title': 'Newtonian Mechanics & Forces',
        'title_sw': 'Makanika ya Newton na Nguvu',
        'subject': 'PHYSICS',
        'form_level': 'FORM_3',
        'duration_sec': 1800,
        'is_free': true,
        'price_tsh': 0,
        'teacher': {'display_name': 'Mwl. Halima', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=halima'}
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    final filteredLessons = _selectedSubject == 'ALL'
        ? _lessons
        : _lessons.where((l) => l['subject'] == _selectedSubject).toList();

    return _isLoading
        ? const Center(child: CircularProgressIndicator(color: AppTheme.skyBlue))
        : RefreshIndicator(
            onRefresh: _fetchLessons,
            color: AppTheme.skyBlue,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Mode chip
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.skyBlue.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.school, size: 16, color: AppTheme.skyBlue),
                          SizedBox(width: 6),
                          Text(
                            'Hali ya Mwanafunzi / Student Mode',
                            style: TextStyle(
                              color: AppTheme.skyBlue,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Hero Banner
                  Container(
                    height: 140,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppTheme.primary, AppTheme.skyBlue],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primary.withOpacity(0.3),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                'Darasani Leo',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 6),
                              Text(
                                'Jifunze Hisabati, Sayansi na Lugha na walimu bora wa Tanzania.',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.play_circle_fill, size: 36, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Subject selector chips
                  SizedBox(
                    height: 40,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _subjects.length,
                      itemBuilder: (context, index) {
                        final subject = _subjects[index];
                        final isSelected = _selectedSubject == subject;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: ChoiceChip(
                            label: Text(
                              subject,
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isSelected ? Colors.white : Colors.grey[700],
                              ),
                            ),
                            selected: isSelected,
                            selectedColor: AppTheme.skyBlue,
                            onSelected: (selected) {
                              setState(() {
                                _selectedSubject = selected ? subject : 'ALL';
                              });
                            },
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Lessons Feed
                  Text(
                    'Masomo ya Leo / Today\'s Lessons',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 12),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: filteredLessons.length,
                    itemBuilder: (context, index) {
                      final lesson = filteredLessons[index];
                      final teacher = lesson['teacher'] ?? {'display_name': 'Mwl. Elimu', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=elimu'};
                      final isFree = lesson['is_free'] ?? false;
                      final durationMin = ((lesson['duration_sec'] ?? 1800) / 60).round();

                      return Card(
                        margin: const EdgeInsets.only(bottom: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 1.5,
                        child: InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              SlidePageRoute(child: VideoPlayerScreen(lessonId: lesson['id'], lesson: lesson)),
                            );
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Image Placeholder
                              Container(
                                height: 160,
                                decoration: BoxDecoration(
                                  color: Colors.grey[300],
                                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFFE2E8F0), Color(0xFFCBD5E1)],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                ),
                                child: Stack(
                                  children: [
                                    const Center(
                                      child: Icon(Icons.play_arrow_rounded, size: 54, color: AppTheme.skyBlue),
                                    ),
                                    // Duration badge
                                    Positioned(
                                      bottom: 10,
                                      right: 10,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: Colors.black87,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          '$durationMin min',
                                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ),
                                    if (isFree)
                                      Positioned(
                                        top: 10,
                                        left: 10,
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: AppTheme.accent,
                                            borderRadius: BorderRadius.circular(6),
                                          ),
                                          child: const Text(
                                            'BURE / FREE',
                                            style: TextStyle(color: AppTheme.primary, fontSize: 10, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 12,
                                          backgroundImage: NetworkImage(teacher['avatar_url'] ?? ''),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(
                                          teacher['display_name'] ?? 'Mwalimu',
                                          style: TextStyle(color: Colors.grey[700], fontSize: 12, fontWeight: FontWeight.w600),
                                        ),
                                        const Spacer(),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: Colors.blue[50],
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            lesson['form_level']?.toString().replaceAll('_', ' ') ?? 'FORM 1',
                                            style: const TextStyle(color: AppTheme.skyBlue, fontSize: 10, fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      lesson['title'] ?? 'Untitled Lesson',
                                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                    ),
                                    if (lesson['title_sw'] != null) ...[
                                      const SizedBox(height: 2),
                                      Text(
                                        lesson['title_sw']!,
                                        style: TextStyle(fontSize: 13, color: Colors.grey[600], fontStyle: FontStyle.italic),
                                      ),
                                    ],
                                  ],
                                ),
                              )
                            ],
                          ),
                        ),
                      );
                    },
                  )
                ],
              ),
            ),
          );
  }
}
