import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../theme/app_theme.dart';
import '../theme/page_transitions.dart';
import '../main.dart';
import 'student/student_home_screen.dart';
import 'teacher/teacher_dashboard_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = 'STUDENT';
  bool _obscurePassword = true;
  String? _errorMessage;

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _errorMessage = null);

    try {
      final auth = context.read<AuthProvider>();
      await auth.register(
        name: _nameController.text.trim(),
        phone: '+255${_phoneController.text.trim()}',
        email: _emailController.text.trim(),
        password: _passwordController.text,
        initialRole: _selectedRole,
      );

      if (!mounted) return;
      if (auth.isTeacher) {
        Navigator.pushAndRemoveUntil(
          context,
          FadePageRoute(child: const TeacherDashboardScreen()),
          (route) => false,
        );
      } else {
        Navigator.pushAndRemoveUntil(
          context,
          FadePageRoute(child: const StudentHomeScreen()),
          (route) => false,
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsProvider>();
    final auth = context.watch<AuthProvider>();
    final isSwahili = settings.locale.languageCode == 'sw';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppTheme.primary),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          isSwahili ? 'Jiandikishe' : 'Register',
          style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    isSwahili ? 'Fungua Akaunti' : 'Create Account',
                    style: Theme.of(context).textTheme.displayLarge?.copyWith(
                      color: AppTheme.primary,
                      fontSize: 24,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    isSwahili ? 'Jiunge na jamii ya wajifunzaji' : 'Join our community of learners',
                    style: TextStyle(color: Colors.grey[600]),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  if (_errorMessage != null)
                    Container(
                      padding: const EdgeInsets.all(12),
                      margin: const EdgeInsets.only(bottom: 16),
                      decoration: BoxDecoration(
                        color: Colors.red[50],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.error.withOpacity(0.3)),
                      ),
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: AppTheme.error, fontSize: 13),
                      ),
                    ),
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
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: isSwahili ? 'Jina Kamili' : 'Full Name',
                        prefixIcon: const Icon(Icons.person_outline),
                      ),
                      validator: (value) => value == null || value.isEmpty
                          ? (isSwahili ? 'Weka jina lako' : 'Enter your name')
                          : null,
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
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: isSwahili ? 'Nambari ya Simu' : 'Phone Number',
                        prefixText: '+255 ',
                        prefixIcon: const Icon(Icons.phone_outlined),
                      ),
                      validator: (value) => value == null || value.length < 9
                          ? (isSwahili ? 'Weka nambari sahihi ya simu' : 'Enter valid phone number')
                          : null,
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
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: isSwahili ? 'Barua Pepe / Email' : 'Email Address',
                        prefixIcon: const Icon(Icons.email_outlined),
                      ),
                      validator: (value) => value == null || !value.contains('@')
                          ? (isSwahili ? 'Weka barua pepe sahihi' : 'Enter a valid email')
                          : null,
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
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: isSwahili ? 'Nenosiri' : 'Password',
                        prefixIcon: const Icon(Icons.lock_outlined),
                        suffixIcon: IconButton(
                          icon: Icon(_obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                      ),
                      validator: (value) => value == null || value.length < 6
                          ? (isSwahili ? 'Nenosiri lazima liwe na herufi 6+' : 'Password must be 6+ characters')
                          : null,
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Segmented Role Toggle
                  Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedRole = 'STUDENT'),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _selectedRole == 'STUDENT' ? AppTheme.skyBlue : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: _selectedRole == 'STUDENT' ? Colors.transparent : Colors.grey[400]!),
                            ),
                            child: Column(
                              children: [
                                Icon(Icons.book_rounded, color: _selectedRole == 'STUDENT' ? Colors.white : Colors.grey),
                                const SizedBox(height: 4),
                                Text(
                                  isSwahili ? 'Mwanafunzi' : 'Student',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: _selectedRole == 'STUDENT' ? Colors.white : Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _selectedRole = 'TEACHER'),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _selectedRole == 'TEACHER' ? AppTheme.teal : Colors.transparent,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: _selectedRole == 'TEACHER' ? Colors.transparent : Colors.grey[400]!),
                            ),
                            child: Column(
                              children: [
                                Icon(Icons.school_rounded, color: _selectedRole == 'TEACHER' ? Colors.white : Colors.grey),
                                const SizedBox(height: 4),
                                Text(
                                  isSwahili ? 'Mwalimu' : 'Teacher',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: _selectedRole == 'TEACHER' ? Colors.white : Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: auth.isLoading ? null : _handleRegister,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: AppTheme.primary,
                      elevation: 4,
                      shadowColor: AppTheme.primary.withOpacity(0.4),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                    ),
                    child: auth.isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(Colors.white)),
                          )
                        : Text(
                            isSwahili ? 'Jiandikishe / Register' : 'Register',
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
