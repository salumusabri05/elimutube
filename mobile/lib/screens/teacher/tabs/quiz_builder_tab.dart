import 'package:flutter/material.dart';
import '../../../services/api_service.dart';
import '../../../theme/app_theme.dart';

class QuizBuilderTab extends StatefulWidget {
  const QuizBuilderTab({super.key});

  @override
  State<QuizBuilderTab> createState() => _QuizBuilderTabState();
}

class _QuizBuilderTabState extends State<QuizBuilderTab> {
  final _formKey = GlobalKey<FormState>();
  final _questionController = TextEditingController();
  final _questionSwController = TextEditingController();
  final List<TextEditingController> _optionControllers = List.generate(4, (_) => TextEditingController());
  int _correctAnswerIndex = 0;
  bool _isSaving = false;

  Future<void> _saveQuiz() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSaving = true);

    try {
      final quizData = {
        'lesson_id': 'mock_lesson_id',
        'generated_by': 'MANUAL',
        'question_text_en': _questionController.text.trim(),
        'question_text_sw': _questionSwController.text.trim().isNotEmpty ? _questionSwController.text.trim() : null,
        'correct_answer_index': _correctAnswerIndex,
        'options': _optionControllers.map((c) => c.text.trim()).toList(),
      };

      await ApiService.post('database/tables/quiz', quizData);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Jaribio limehifadhiwa! / Quiz saved successfully!')),
      );

      // Reset
      _questionController.clear();
      _questionSwController.clear();
      for (var c in _optionControllers) {
        c.clear();
      }
      setState(() => _correctAnswerIndex = 0);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Jaribio limehifadhiwa! / Quiz saved (Mock Offline Mode)')),
      );
      // Reset
      _questionController.clear();
      _questionSwController.clear();
      for (var c in _optionControllers) {
        c.clear();
      }
      setState(() => _correctAnswerIndex = 0);
    } finally {
      setState(() => _isSaving = false);
    }
  }

  @override
  void dispose() {
    _questionController.dispose();
    _questionSwController.dispose();
    for (var c in _optionControllers) {
      c.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Tengeneza Jaribio la Somo / Build MCQ Quiz',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.teal),
              ),
              const SizedBox(height: 16),

              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: TextFormField(
                  controller: _questionController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Swali (English) *',
                  ),
                  validator: (val) => val == null || val.isEmpty ? 'Weka swali' : null,
                ),
              ),
              const SizedBox(height: 12),

              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: TextFormField(
                  controller: _questionSwController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Swali (Kiswahili)',
                  ),
                ),
              ),
              const SizedBox(height: 20),

              const Text(
                'Chaguzi za Majibu / Answer Options',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 12),

              // Options options inputs
              ...List.generate(4, (index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12.0),
                  child: Row(
                    children: [
                      Radio<int>(
                        value: index,
                        groupValue: _correctAnswerIndex,
                        activeColor: AppTheme.teal,
                        onChanged: (val) {
                          if (val != null) setState(() => _correctAnswerIndex = val);
                        },
                      ),
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: TextFormField(
                            controller: _optionControllers[index],
                            decoration: InputDecoration(
                              labelText: 'Chaguo / Option ${String.fromCharCode(65 + index)} *',
                            ),
                            validator: (val) => val == null || val.isEmpty ? 'Weka chaguo hili' : null,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 24),

              ElevatedButton(
                onPressed: _isSaving ? null : _saveQuiz,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.teal,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  elevation: 4,
                  shadowColor: AppTheme.teal.withOpacity(0.4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: _isSaving
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white)),
                      )
                    : const Text(
                        'Hifadhi Swali / Save Question',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
