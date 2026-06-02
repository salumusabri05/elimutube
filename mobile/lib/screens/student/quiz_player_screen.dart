import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../theme/app_theme.dart';
import '../../services/api_service.dart';

class QuizPlayerScreen extends StatefulWidget {
  final String lessonId;
  const QuizPlayerScreen({super.key, required this.lessonId});

  @override
  State<QuizPlayerScreen> createState() => _QuizPlayerScreenState();
}

class _QuizPlayerScreenState extends State<QuizPlayerScreen> {
  bool _isLoading = true;
  List<Map<String, dynamic>> _questions = [];
  int _currentQuestionIndex = 0;
  int _score = 0;

  // MCQ state
  int? _selectedAnswerIndex;

  // Text state
  final TextEditingController _textController = TextEditingController();

  // Photo state
  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();

  bool _answered = false;

  @override
  void initState() {
    super.initState();
    _loadQuiz();
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _loadQuiz() async {
    try {
      final quizzes = await ApiService.get('quizzes');
      final lessonQuiz = quizzes.firstWhere(
        (q) => q['lesson_id'] == widget.lessonId,
        orElse: () => null,
      );

      if (lessonQuiz != null && lessonQuiz['questions'] != null && (lessonQuiz['questions'] as List).isNotEmpty) {
        final List<Map<String, dynamic>> formatted = [];
        for (var q in lessonQuiz['questions']) {
          final optionsList = q['options'] as List?;
          final List<String> options = [];
          if (optionsList != null) {
            for (var o in optionsList) {
              options.add(o['option_text']?.toString() ?? '');
            }
          }

          formatted.add({
            'question': q['question_text_en'] ?? '',
            'question_sw': q['question_text_sw'],
            'type': q['question_type'] ?? 'MULTIPLE_CHOICE',
            'options': options,
            'correctIndex': q['correct_answer_index'],
            'correctText': q['correct_answer_text'],
          });
        }
        setState(() {
          _questions = formatted;
          _isLoading = false;
        });
      } else {
        _useFallback();
      }
    } catch (err) {
      print('Error fetching quiz: $err');
      _useFallback();
    }
  }

  void _useFallback() {
    setState(() {
      _questions = [
        {
          'question': 'What is 15% of 200?',
          'question_sw': 'Ni lipi tokeo la 15% ya 200?',
          'type': 'MULTIPLE_CHOICE',
          'options': ['20', '30', '40', '15'],
          'correctIndex': 1,
        },
        {
          'question': 'Which organelle produces energy?',
          'question_sw': 'Ni kiungo gani cha seli kinachozalisha nishati?',
          'type': 'MULTIPLE_CHOICE',
          'options': ['Mitochondria', 'Nucleus', 'Ribosome', 'Vacuole'],
          'correctIndex': 0,
        },
        {
          'question': 'What is Earth\'s gravity acceleration?',
          'question_sw': 'Nguvu ya uvutano duniani inakadiriwa kuwa ngapi?',
          'type': 'MULTIPLE_CHOICE',
          'options': ['5.5 m/s²', '9.8 m/s²', '12.0 m/s²', '1.6 m/s²'],
          'correctIndex': 1,
        },
      ];
      _isLoading = false;
    });
  }

  void _submitMCQ(int index, int correctIndex) {
    if (_answered) return;
    setState(() {
      _selectedAnswerIndex = index;
      _answered = true;
      if (index == correctIndex) {
        _score++;
      }
    });
  }

  void _submitText(String text, String? correctText) {
    if (_answered) return;
    if (text.trim().isEmpty) return;
    setState(() {
      _answered = true;
      final answer = text.trim().toLowerCase();
      final expected = (correctText ?? '').trim().toLowerCase();
      if (answer == expected || expected.isEmpty) {
        _score++;
      }
    });
  }

  void _submitPhoto() {
    if (_answered) return;
    if (_selectedImage == null) return;
    setState(() {
      _answered = true;
      _score++;
    });
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await _picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
        });
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  void _nextQuestion() {
    if (_currentQuestionIndex < _questions.length - 1) {
      setState(() {
        _currentQuestionIndex++;
        _selectedAnswerIndex = null;
        _selectedImage = null;
        _textController.clear();
        _answered = false;
      });
    } else {
      _showResultsDialog();
    }
  }

  void _showResultsDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) {
        final percent = (_score / _questions.length * 100).round();
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Hongera sana! / Quiz Complete!', textAlign: TextAlign.center),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.stars_rounded, size: 72, color: Colors.amber),
              const SizedBox(height: 16),
              Text(
                'Alama Zako / Score: $_score / ${_questions.length}',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Ufaulu: $percent%',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: percent >= 70 ? Colors.green : Colors.red,
                ),
              ),
            ],
          ),
          actions: [
            Center(
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context); // close dialog
                  Navigator.pop(context); // return to video player
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.skyBlue,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Kamilisha / Finish', style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Jaribio la Somo / Quiz'),
          backgroundColor: AppTheme.primary,
          foregroundColor: Colors.white,
        ),
        body: const Center(
          child: CircularProgressIndicator(color: AppTheme.skyBlue),
        ),
      );
    }

    final currentQuestion = _questions[_currentQuestionIndex];
    final progress = (_currentQuestionIndex + 1) / _questions.length;
    final type = currentQuestion['type'] ?? 'MULTIPLE_CHOICE';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Jaribio la Somo / Quiz'),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Progress indicator
              Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.grey[200],
                      valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.skyBlue),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    '${_currentQuestionIndex + 1}/${_questions.length}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Question Card
              Card(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                color: AppTheme.primary.withOpacity(0.04),
                elevation: 0,
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            type == 'PHOTO_UPLOAD'
                                ? Icons.add_a_photo_rounded
                                : type == 'TEXT_ANSWER'
                                    ? Icons.edit_note_rounded
                                    : Icons.quiz_rounded,
                            color: AppTheme.skyBlue,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            type == 'PHOTO_UPLOAD'
                                ? 'PIGA PICHA / PHOTO RESPONSE'
                                : type == 'TEXT_ANSWER'
                                    ? 'ANDIKA JIBU / TEXT RESPONSE'
                                    : 'CHAGUA JIBU / MULTIPLE CHOICE',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.skyBlue,
                              letterSpacing: 1.1,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        currentQuestion['question'] ?? '',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, height: 1.4),
                      ),
                      if (currentQuestion['question_sw'] != null && currentQuestion['question_sw'].toString().isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(
                          currentQuestion['question_sw'],
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[600],
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Form inputs based on Question Type
              if (type == 'MULTIPLE_CHOICE') ...[
                ...List.generate(
                  (currentQuestion['options'] as List).length,
                  (index) {
                    final optionText = currentQuestion['options'][index];
                    final isCorrect = index == currentQuestion['correctIndex'];
                    final isSelected = index == _selectedAnswerIndex;

                    Color optionColor = Colors.white;
                    Color textColor = Colors.black87;
                    BorderSide borderSide = BorderSide(color: Colors.grey[300]!);

                    if (_answered) {
                      if (isCorrect) {
                        optionColor = Colors.green[50]!;
                        textColor = Colors.green[800]!;
                        borderSide = const BorderSide(color: Colors.green, width: 1.5);
                      } else if (isSelected) {
                        optionColor = Colors.red[50]!;
                        textColor = Colors.red[800]!;
                        borderSide = const BorderSide(color: Colors.red, width: 1.5);
                      }
                    } else if (isSelected) {
                      optionColor = AppTheme.skyBlue.withOpacity(0.1);
                      textColor = AppTheme.skyBlue;
                      borderSide = const BorderSide(color: AppTheme.skyBlue, width: 1.5);
                    }

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12.0),
                      child: Material(
                        color: optionColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: borderSide,
                        ),
                        child: InkWell(
                          onTap: () => _submitMCQ(index, currentQuestion['correctIndex'] ?? 0),
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            child: Row(
                              children: [
                                Text(
                                  String.fromCharCode(65 + index), // A, B, C, D
                                  style: TextStyle(fontWeight: FontWeight.bold, color: textColor),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Text(
                                    optionText,
                                    style: TextStyle(fontWeight: FontWeight.w500, color: textColor),
                                  ),
                                ),
                                if (_answered && isCorrect)
                                  const Icon(Icons.check_circle, color: Colors.green)
                                else if (_answered && isSelected)
                                  const Icon(Icons.cancel, color: Colors.red),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ] else if (type == 'TEXT_ANSWER') ...[
                TextField(
                  controller: _textController,
                  enabled: !_answered,
                  maxLines: 3,
                  decoration: InputDecoration(
                    hintText: 'Andika jibu lako hapa... / Type your answer here...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: AppTheme.skyBlue, width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                if (!_answered)
                  ElevatedButton(
                    onPressed: () => _submitText(_textController.text, currentQuestion['correctText']),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.skyBlue,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text(
                      'Tuma Jibu / Submit Answer',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  )
                else ...[
                  Card(
                    color: Colors.emerald[50],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: const BorderSide(color: Colors.green, width: 0.5),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.check_circle, color: Colors.green, size: 18),
                              SizedBox(width: 8),
                              Text(
                                'Jibu Limepokelewa / Answer Submitted',
                                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                              ),
                            ],
                          ),
                          if (currentQuestion['correctText'] != null &&
                              currentQuestion['correctText'].toString().isNotEmpty) ...[
                            const SizedBox(height: 8),
                            Text(
                              'Jibu Sahihi: ${currentQuestion['correctText']}',
                              style: TextStyle(color: Colors.grey[800], fontSize: 13),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ] else if (type == 'PHOTO_UPLOAD') ...[
                if (_selectedImage == null) ...[
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _answered ? null : () => _pickImage(ImageSource.camera),
                          icon: const Icon(Icons.camera_alt, color: Colors.white),
                          label: const Text('Piga Picha / Camera', style: TextStyle(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primary,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _answered ? null : () => _pickImage(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library, color: Colors.white),
                          label: const Text('Pakia / Gallery', style: TextStyle(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.skyBlue,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ] else ...[
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Image.file(
                      _selectedImage!,
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (!_answered)
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _selectedImage = null;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text('Futa / Reset'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _submitPhoto,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.skyBlue,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text(
                              'Tuma Picha / Submit Photo',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    )
                  else ...[
                    Card(
                      color: Colors.amber[50],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: Colors.amber, width: 0.5),
                      ),
                      child: const Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            Icon(Icons.cloud_done_rounded, color: Colors.amber, size: 18),
                            SizedBox(width: 8),
                            Text(
                              'Picha Imetumwa / Photo Uploaded',
                              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.amber),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ],

              const SizedBox(height: 32),

              // Next action button
              if (_answered)
                ElevatedButton(
                  onPressed: _nextQuestion,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                  ),
                  child: Text(
                    _currentQuestionIndex == _questions.length - 1
                        ? 'Maliza / Complete'
                        : 'Swali Linalofuata / Next',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
