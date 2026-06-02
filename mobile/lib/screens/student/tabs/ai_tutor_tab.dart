import 'package:flutter/material.dart';
import '../../../theme/app_theme.dart';

class AiTutorTab extends StatefulWidget {
  const AiTutorTab({super.key});

  @override
  State<AiTutorTab> createState() => _AiTutorTabState();
}

class _AiTutorTabState extends State<AiTutorTab> {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'role': 'ai',
      'text': 'Mambo! Mimi ni Mwalimu AI. Niulize swali lolote kuhusu masomo yako ya Hisabati au Sayansi!'
    },
  ];

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'role': 'user',
        'text': _messageController.text.trim(),
      });
      _messageController.clear();
    });

    // Mock AI streaming response animation feel
    Future.delayed(const Duration(seconds: 1), () {
      if (!mounted) return;
      setState(() {
        _messages.add({
          'role': 'ai',
          'text': 'Asante kwa swali lako. Kulingana na silabi ya Tanzania, hii inafafanuliwa kama hitaji la msingi la kufaulu mtihani wako wa taifa. Je, ungependa mifano zaidi ya hatua kwa hatua?'
        });
      });
    });
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // AI disclaimer
        Container(
          color: Colors.amber[100],
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: const Row(
            children: [
              Icon(Icons.warning_amber_rounded, size: 16, color: Colors.orange),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'AI inaweza kukosea. Hakiki na mwalimu wako. / AI may make mistakes.',
                  style: TextStyle(fontSize: 11, color: Colors.brown, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
        
        // Chat area
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: _messages.length,
            itemBuilder: (context, index) {
              final msg = _messages[index];
              final isAi = msg['role'] == 'ai';

              return Align(
                alignment: isAi ? Alignment.centerLeft : Alignment.centerRight,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isAi ? Colors.blue[50] : AppTheme.skyBlue,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(12),
                      topRight: const Radius.circular(12),
                      bottomLeft: Radius.circular(isAi ? 4 : 12),
                      bottomRight: Radius.circular(isAi ? 12 : 4),
                    ),
                  ),
                  constraints: BoxConstraints(
                    maxWidth: MediaQuery.of(context).size.width * 0.75,
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (isAi) ...[
                        const Icon(Icons.android_rounded, size: 18, color: AppTheme.primary),
                        const SizedBox(width: 8),
                      ],
                      Expanded(
                        child: Text(
                          msg['text'],
                          style: TextStyle(
                            color: isAi ? Colors.black87 : Colors.white,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),

        // Message input bar
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _messageController,
                  decoration: InputDecoration(
                    hintText: 'Andika swali lako hapa... / Ask a question...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.send),
                color: AppTheme.skyBlue,
                onPressed: _sendMessage,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
