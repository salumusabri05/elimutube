import 'package:flutter/material.dart';
import '../../../theme/app_theme.dart';

class ProgressTab extends StatelessWidget {
  const ProgressTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Streak Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.secondary, Color(0xFFE67E22)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              children: [
                Icon(Icons.local_fire_department_rounded, size: 54, color: Colors.white),
                SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Mfululizo: Siku 7! / 7-Day Streak!',
                        style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Unafanya vizuri sana! Endelea kusoma kila siku.',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Subscribed Teachers status
          const Text(
            'Usajili Wako / Subscriptions',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: const Padding(
              padding: EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _StatItem(value: '3', label: 'Walimu'),
                  _StatItem(value: '5', label: 'Masomo Leo'),
                  _StatItem(value: '82%', label: 'Kamilisha'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Completion status list
          const Text(
            'Maendeleo kwa Masomo / Subject Progress',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 12),

          _SubjectProgressItem(
            title: 'Hisabati / Mathematics',
            percent: 0.75,
            color: AppTheme.skyBlue,
            completedLessons: 12,
            totalLessons: 16,
          ),
          _SubjectProgressItem(
            title: 'Fizikia / Physics',
            percent: 0.40,
            color: Colors.orange,
            completedLessons: 6,
            totalLessons: 15,
          ),
          _SubjectProgressItem(
            title: 'Kemia / Chemistry',
            percent: 0.90,
            color: AppTheme.teal,
            completedLessons: 9,
            totalLessons: 10,
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;

  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
      ],
    );
  }
}

class _SubjectProgressItem extends StatelessWidget {
  final String title;
  final double percent;
  final Color color;
  final int completedLessons;
  final int totalLessons;

  const _SubjectProgressItem({
    required this.title,
    required this.percent,
    required this.color,
    required this.completedLessons,
    required this.totalLessons,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(
                  '${(percent * 100).round()}%',
                  style: TextStyle(fontWeight: FontWeight.bold, color: color),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: percent,
                backgroundColor: Colors.grey[200],
                valueColor: AlwaysStoppedAnimation<Color>(color),
                minHeight: 8,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '$completedLessons/$totalLessons yamekamilika / lessons completed',
              style: const TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
