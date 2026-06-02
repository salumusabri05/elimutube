import 'package:flutter/material.dart';
import '../../../services/api_service.dart';
import '../../../theme/app_theme.dart';

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  List<dynamic> _myLessons = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchMyLessons();
  }

  Future<void> _fetchMyLessons() async {
    try {
      final lessons = await ApiService.get('database/tables/lesson');
      setState(() {
        _myLessons = lessons;
        _isLoading = false;
      });
    } catch (_) {
      setState(() {
        _myLessons = _getMockLessons();
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getMockLessons() {
    return [
      {'title': 'Form 4 Biology: Cells structure', 'subject': 'BIOLOGY', 'views': 284, 'rating': 4.9},
      {'title': 'Form 3 Mathematics: Trigonometry', 'subject': 'MATH', 'views': 412, 'rating': 4.7},
    ];
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const Center(child: CircularProgressIndicator(color: AppTheme.teal))
        : RefreshIndicator(
            onRefresh: _fetchMyLessons,
            color: AppTheme.teal,
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Mode Badge
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppTheme.teal.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.school, size: 16, color: AppTheme.teal),
                          SizedBox(width: 6),
                          Text(
                            'Hali ya Mwalimu / Teacher Mode',
                            style: TextStyle(
                              color: AppTheme.teal,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Analytics Grid
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.5,
                    children: [
                      _buildMetricCard('Wanafunzi / Students', '1,280', Icons.people_outline, AppTheme.teal),
                      _buildMetricCard('Masaa / Watch Time', '4,840h', Icons.timer_outlined, Colors.purple),
                      _buildMetricCard('Mapato / Income', 'Tsh 840K', Icons.account_balance_wallet_outlined, AppTheme.secondary),
                      _buildMetricCard('Ukadiriaji / Rating', '4.8★', Icons.star_outline_rounded, Colors.orange),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Chart Card
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Ukuaji wa Wanafunzi / Student Growth',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                          ),
                          const SizedBox(height: 16),
                          // Simulated Bar Chart
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: List.generate(6, (index) {
                              final heights = [40.0, 70.0, 50.0, 90.0, 110.0, 140.0];
                              final months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                              return Column(
                                children: [
                                  Container(
                                    height: heights[index],
                                    width: 16,
                                    decoration: BoxDecoration(
                                      color: index == 5 ? AppTheme.teal : AppTheme.teal.withOpacity(0.4),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(months[index], style: const TextStyle(fontSize: 10, color: Colors.grey)),
                                ],
                              );
                            }),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // My Content lists
                  const Text(
                    'Masomo Yaliyochapishwa / Published Lessons',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 12),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _myLessons.length,
                    itemBuilder: (context, index) {
                      final item = _myLessons[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppTheme.teal.withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.video_library, color: AppTheme.teal),
                          ),
                          title: Text(item['title'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('Subject: ${item['subject']} • ${item['views'] ?? 120} views'),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange[50],
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.star, color: Colors.orange, size: 14),
                                const SizedBox(width: 4),
                                Text(
                                  '${item['rating'] ?? 4.5}',
                                  style: TextStyle(color: Colors.orange[800], fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 24),
                Text(
                  value,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(color: Colors.grey[600], fontSize: 11, fontWeight: FontWeight.w500),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
