import 'package:flutter/material.dart';
import '../../../services/api_service.dart';
import '../../../theme/app_theme.dart';
import '../../../theme/page_transitions.dart';
import '../video_player_screen.dart';

class DiscoverTab extends StatefulWidget {
  const DiscoverTab({super.key});

  @override
  State<DiscoverTab> createState() => _DiscoverTabState();
}

class _DiscoverTabState extends State<DiscoverTab> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> _lessons = [];
  List<dynamic> _teachers = [];
  bool _isLoading = true;
  String _selectedLevel = 'ALL';

  final List<String> _levels = ['ALL', 'FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6'];

  @override
  void initState() {
    super.initState();
    _fetchDiscoverData();
  }

  Future<void> _fetchDiscoverData() async {
    try {
      final lessons = await ApiService.get('database/tables/lesson');
      final users = await ApiService.get('database/tables/user');
      
      setState(() {
        _lessons = lessons;
        _teachers = (users as List).where((u) => (u['roles'] as List).contains('TEACHER')).toList();
        _isLoading = false;
      });
    } catch (_) {
      setState(() {
        _lessons = _getMockLessons();
        _teachers = _getMockTeachers();
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getMockLessons() {
    return [
      {
        'id': '1',
        'title': 'Chemical Bonding & Reactions',
        'title_sw': 'Muunganiko wa Kikemia na Matendo',
        'subject': 'CHEMISTRY',
        'form_level': 'FORM_2',
        'duration_sec': 2100,
        'is_free': true,
        'teacher': {'display_name': 'Mwl. Peter', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=peter'}
      },
      {
        'id': '2',
        'title': 'Plant Photosynthesis Process',
        'title_sw': 'Utengenezaji Chakula Kwenye Mimea',
        'subject': 'BIOLOGY',
        'form_level': 'FORM_1',
        'duration_sec': 1400,
        'is_free': false,
        'teacher': {'display_name': 'Mwl. Halima', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=halima'}
      }
    ];
  }

  List<dynamic> _getMockTeachers() {
    return [
      {'display_name': 'Mwl. Juma', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=juma', 'subject': 'MATH'},
      {'display_name': 'Mwl. Halima', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=halima', 'subject': 'BIOLOGY'},
      {'display_name': 'Mwl. Peter', 'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=peter', 'subject': 'CHEMISTRY'},
    ];
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _searchController.text.toLowerCase();
    final filteredLessons = _lessons.where((l) {
      final matchesQuery = l['title'].toString().toLowerCase().contains(query) ||
          (l['title_sw']?.toString().toLowerCase().contains(query) ?? false);
      final matchesLevel = _selectedLevel == 'ALL' || l['form_level'] == _selectedLevel;
      return matchesQuery && matchesLevel;
    }).toList();

    return _isLoading
        ? const Center(child: CircularProgressIndicator(color: AppTheme.skyBlue))
        : SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Search field
                TextField(
                  controller: _searchController,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Tafuta masomo au walimu... / Search lessons...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
                const SizedBox(height: 20),

                // Grade / Form selector
                const Text(
                  'Ngazi ya Kidato / Form Level',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 36,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _levels.length,
                    itemBuilder: (context, index) {
                      final level = _levels[index];
                      final isSelected = _selectedLevel == level;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(level.replaceAll('_', ' ')),
                          selected: isSelected,
                          selectedColor: AppTheme.skyBlue,
                          onSelected: (selected) {
                            setState(() {
                              _selectedLevel = selected ? level : 'ALL';
                            });
                          },
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 24),

                // Teachers Carousel
                if (_teachers.isNotEmpty) ...[
                  const Text(
                    'Walimu Maarufu / Popular Teachers',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 110,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _teachers.length,
                      itemBuilder: (context, index) {
                        final teacher = _teachers[index];
                        return Container(
                          width: 100,
                          margin: const EdgeInsets.only(right: 12),
                          child: Column(
                            children: [
                              CircleAvatar(
                                radius: 28,
                                backgroundImage: NetworkImage(teacher['avatar_url'] ?? ''),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                teacher['display_name'] ?? 'Mwalimu',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                              ),
                              Text(
                                teacher['subject'] ?? 'Elimu',
                                style: const TextStyle(color: Colors.grey, fontSize: 10),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                ],

                // Grid of results
                const Text(
                  'Matokeo / Explore Lessons',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 12),

                filteredLessons.isEmpty
                    ? const Padding(
                        padding: EdgeInsets.symmetric(vertical: 40.0),
                        child: Text(
                          'Hakuna masomo yaliyopatikana / No lessons found',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey),
                        ),
                      )
                    : GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                          childAspectRatio: 0.8,
                        ),
                        itemCount: filteredLessons.length,
                        itemBuilder: (context, index) {
                          final lesson = filteredLessons[index];
                          final teacher = lesson['teacher'] ?? {'display_name': 'Mwalimu'};

                          return Card(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            child: InkWell(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  SlidePageRoute(child: VideoPlayerScreen(lessonId: lesson['id'], lesson: lesson)),
                                );
                              },
                              borderRadius: BorderRadius.circular(12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Expanded(
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                                      ),
                                      child: const Center(
                                        child: Icon(Icons.play_arrow, color: AppTheme.skyBlue, size: 36),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          lesson['title'] ?? '',
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          teacher['display_name'] ?? 'Mwalimu',
                                          style: TextStyle(color: Colors.grey[600], fontSize: 11),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ],
            ),
          );
  }
}
