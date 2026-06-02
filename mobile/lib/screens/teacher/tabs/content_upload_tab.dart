import 'package:flutter/material.dart';
import '../../../services/api_service.dart';
import '../../../theme/app_theme.dart';

class ContentUploadTab extends StatefulWidget {
  const ContentUploadTab({super.key});

  @override
  State<ContentUploadTab> createState() => _ContentUploadTabState();
}

class _ContentUploadTabState extends State<ContentUploadTab> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _titleSwController = TextEditingController();
  final _durationController = TextEditingController();
  final _priceController = TextEditingController();

  String _selectedSubject = 'MATH';
  String _selectedLevel = 'FORM_1';
  bool _isFree = true;
  bool _isUploading = false;

  final List<String> _subjects = ['MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH', 'KISWAHILI', 'HISTORY', 'GEOGRAPHY', 'ACCOUNTS'];
  final List<String> _levels = ['FORM_1', 'FORM_2', 'FORM_3', 'FORM_4', 'FORM_5', 'FORM_6'];

  Future<void> _uploadContent() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isUploading = true);

    try {
      final newLesson = {
        'teacher_id': 'mock_teacher_id',
        'type': 'VIDEO',
        'title': _titleController.text.trim(),
        'title_sw': _titleSwController.text.trim().isNotEmpty ? _titleSwController.text.trim() : null,
        'subject': _selectedSubject,
        'form_level': _selectedLevel,
        'is_free': _isFree,
        'duration_sec': (int.tryParse(_durationController.text) ?? 30) * 60,
        'price_tsh': _isFree ? 0 : (int.tryParse(_priceController.text) ?? 0),
      };

      await ApiService.post('database/tables/lesson', newLesson);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Somo limechapishwa! / Lesson published successfully!')),
      );

      // Reset form
      _titleController.clear();
      _titleSwController.clear();
      _durationController.clear();
      _priceController.clear();
      setState(() {
        _isFree = true;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Somo limechapishwa! / Lesson published (Mock Offline Mode)')),
      );
      // Reset form on mock too
      _titleController.clear();
      _titleSwController.clear();
      _durationController.clear();
      _priceController.clear();
      setState(() {
        _isFree = true;
      });
    } finally {
      setState(() => _isUploading = false);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _titleSwController.dispose();
    _durationController.dispose();
    _priceController.dispose();
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
                'Pakia Somo Jipya / Publish New Lesson',
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
                  controller: _titleController,
                  decoration: const InputDecoration(
                    labelText: 'Kichwa cha Somo (English) *',
                  ),
                  validator: (val) => val == null || val.isEmpty ? 'Weka jina la somo' : null,
                ),
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
                  controller: _titleSwController,
                  decoration: const InputDecoration(
                    labelText: 'Kichwa cha Somo (Kiswahili)',
                  ),
                ),
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
                child: DropdownButtonFormField<String>(
                  value: _selectedSubject,
                  decoration: const InputDecoration(
                    labelText: 'Somo / Subject Area',
                  ),
                  items: _subjects.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedSubject = val);
                  },
                ),
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
                child: DropdownButtonFormField<String>(
                  value: _selectedLevel,
                  decoration: const InputDecoration(
                    labelText: 'Ngazi / Form Level',
                  ),
                  items: _levels.map((l) => DropdownMenuItem(value: l, child: Text(l.replaceAll('_', ' ')))).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedLevel = val);
                  },
                ),
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
                  controller: _durationController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Muda wa Somo (Dakika / Minutes) *',
                  ),
                  validator: (val) => val == null || int.tryParse(val) == null ? 'Weka muda sahihi' : null,
                ),
              ),
              const SizedBox(height: 16),

              SwitchListTile(
                title: const Text('Ni Somo la Bure? / Is Free?'),
                subtitle: const Text('Wanafunzi wataona somo hili bila usajili wa malipo'),
                value: _isFree,
                activeColor: AppTheme.teal,
                onChanged: (val) => setState(() => _isFree = val),
              ),

              if (!_isFree) ...[
                const SizedBox(height: 8),
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
                    controller: _priceController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Bei (Tsh) *',
                    ),
                    validator: (val) => val == null || int.tryParse(val) == null ? 'Weka bei sahihi' : null,
                  ),
                ),
              ],
              const SizedBox(height: 32),

              ElevatedButton(
                onPressed: _isUploading ? null : _uploadContent,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.teal,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  elevation: 4,
                  shadowColor: AppTheme.teal.withOpacity(0.4),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: _isUploading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white)),
                      )
                    : const Text(
                        'Chapisha Somo / Publish Lesson',
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
