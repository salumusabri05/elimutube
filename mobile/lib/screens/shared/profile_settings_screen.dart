import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../theme/app_theme.dart';
import '../../theme/page_transitions.dart';
import '../../main.dart';
import '../login_screen.dart';

class ProfileSettingsScreen extends StatefulWidget {
  final bool showAppBar;
  const ProfileSettingsScreen({super.key, this.showAppBar = false});

  @override
  State<ProfileSettingsScreen> createState() => _ProfileSettingsScreenState();
}

class _ProfileSettingsScreenState extends State<ProfileSettingsScreen> {
  final _phoneController = TextEditingController();
  String _mno = 'MPESA';

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    _phoneController.text = auth.currentUser?['phone']?.replaceAll('+255', '') ?? '';
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _saveSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Settings saved successfully! / Mipangilio imehifadhiwa!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsProvider>();
    final auth = context.watch<AuthProvider>();
    final isSwahili = settings.locale.languageCode == 'sw';
    final user = auth.currentUser;

    Widget content = SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Profile Card
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 48,
                    backgroundColor: AppTheme.primary.withOpacity(0.1),
                    backgroundImage: NetworkImage(
                      user?['avatar_url'] ?? 'https://api.dicebear.com/7.x/adventurer/svg?seed=user',
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    user?['display_name'] ?? 'User Name',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    user?['email'] ?? 'email@example.com',
                    style: TextStyle(color: Colors.grey[600], fontSize: 14),
                  ),
                  const SizedBox(height: 12),
                  // Mode Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: auth.isTeacher ? AppTheme.teal.withOpacity(0.15) : AppTheme.skyBlue.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          auth.isTeacher ? Icons.school : Icons.book_rounded,
                          size: 16,
                          color: auth.isTeacher ? AppTheme.teal : AppTheme.skyBlue,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          auth.isTeacher
                              ? (isSwahili ? 'Mwalimu / Teacher Mode' : 'Teacher Mode')
                              : (isSwahili ? 'Mwanafunzi / Student Mode' : 'Student Mode'),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: auth.isTeacher ? AppTheme.teal : AppTheme.skyBlue,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Switch Mode Control
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: ListTile(
              leading: Icon(
                auth.isTeacher ? Icons.book : Icons.school,
                color: auth.isTeacher ? AppTheme.skyBlue : AppTheme.teal,
              ),
              title: Text(
                isSwahili ? 'Badilisha Hali ya Matumizi' : 'Switch Active Mode',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(
                auth.isTeacher 
                    ? (isSwahili ? 'Badilisha kwenda Mwanafunzi' : 'Switch to Student Dashboard')
                    : (isSwahili ? 'Badilisha kwenda Mwalimu' : 'Switch to Teacher Dashboard'),
              ),
              trailing: Switch(
                value: auth.isTeacher,
                activeColor: AppTheme.teal,
                inactiveThumbColor: AppTheme.skyBlue,
                onChanged: (val) async {
                  await auth.switchMode();
                  if (!mounted) return;
                  
                  // Clean redirect on mode switch to make it responsive
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      duration: const Duration(seconds: 1),
                      content: Text(
                        isSwahili 
                            ? 'Umebadilisha hali ya matumizi!' 
                            : 'Switched mode successfully!',
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Payment Methods Configuration (Tanzania MNOs)
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isSwahili ? 'Njia za Malipo ya Simu (MNO)' : 'Mobile Money Configuration',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primary),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: _mno,
                    decoration: InputDecoration(
                      labelText: isSwahili ? 'Mtandao wa Simu' : 'Network Operator',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'MPESA', child: Text('Vodacom M-Pesa')),
                      DropdownMenuItem(value: 'AIRTEL', child: Text('Airtel Money')),
                      DropdownMenuItem(value: 'TIGO', child: Text('Tigo Pesa')),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _mno = val);
                    },
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: isSwahili ? 'Nambari ya Simu' : 'Payphone Number',
                      prefixText: '+255 ',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: _saveSettings,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      isSwahili ? 'Hifadhi Maelezo' : 'Save Details',
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Shared System Toggles
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.language, color: AppTheme.primary),
                  title: Text(isSwahili ? 'Lugha / Language' : 'App Language'),
                  trailing: Text(
                    isSwahili ? 'Kiswahili' : 'English',
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary),
                  ),
                  onTap: () => settings.toggleLanguage(),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.brightness_medium, color: AppTheme.primary),
                  title: Text(isSwahili ? 'Mandhari / Theme' : 'Theme Mode'),
                  trailing: Icon(Theme.of(context).brightness == Brightness.light ? Icons.dark_mode : Icons.light_mode),
                  onTap: () => settings.toggleTheme(),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.logout, color: AppTheme.error),
                  title: Text(
                    isSwahili ? 'Ondoka / Logout' : 'Logout',
                    style: const TextStyle(color: AppTheme.error, fontWeight: FontWeight.bold),
                  ),
                  onTap: () {
                    auth.logout();
                    Navigator.pushAndRemoveUntil(
                      context,
                      FadePageRoute(child: const LoginScreen()),
                      (route) => false,
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          const Center(
            child: Text(
              'ElimuTube v2.0.0\nSwahili learning ecosystem',
              style: TextStyle(color: Colors.grey, fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );

    if (widget.showAppBar) {
      return Scaffold(
        appBar: AppBar(
          title: Text(isSwahili ? 'Akaunti' : 'Account Settings'),
          backgroundColor: AppTheme.primary,
          foregroundColor: Colors.white,
        ),
        body: content,
      );
    }

    return content;
  }
}
