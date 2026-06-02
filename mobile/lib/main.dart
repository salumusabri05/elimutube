import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'l10n/app_localizations.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => SettingsProvider()),
      ],
      child: const ElimuTubeApp(),
    ),
  );
}

class SettingsProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;
  Locale _locale = const Locale('en');

  ThemeMode get themeMode => _themeMode;
  Locale get locale => _locale;

  void toggleTheme() {
    _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }

  void toggleLanguage() {
    _locale = _locale.languageCode == 'en' ? const Locale('sw') : const Locale('en');
    notifyListeners();
  }
}

class ElimuTubeApp extends StatelessWidget {
  const ElimuTubeApp({super.key});

  @override
  Widget build(BuildContext context) {
    final settings = context.watch<SettingsProvider>();

    return MaterialApp(
      title: 'ElimuTube',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: settings.themeMode,
      
      localizationsDelegates: [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''), 
        Locale('sw', ''),
      ],
      locale: settings.locale,
      
      home: const WelcomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final settings = context.read<SettingsProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.appTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () => settings.toggleLanguage(),
            tooltip: l10n.changeLanguage,
          ),
          IconButton(
            icon: Icon(Theme.of(context).brightness == Brightness.light ? Icons.dark_mode : Icons.light_mode),
            onPressed: () => settings.toggleTheme(),
            tooltip: l10n.changeTheme,
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                l10n.welcomeMessage,
                style: Theme.of(context).textTheme.displayLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                l10n.subtitle,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              
              // Example Video Card
              Card(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 180,
                      decoration: const BoxDecoration(
                        color: Colors.grey,
                        borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
                      ),
                      child: Stack(
                        children: [
                          const Center(
                            child: Icon(Icons.play_circle_fill, size: 64, color: Colors.white),
                          ),
                          Positioned(
                            bottom: 8,
                            right: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black87,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                '45:20',
                                style: TextStyle(color: Colors.white, fontSize: 12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'SAYANSI',
                                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                    color: Theme.of(context).brightness == Brightness.light ? AppTheme.primary : const Color(0xFFA7C8FF),
                                  ),
                                ),
                              ),
                              const Spacer(),
                              Icon(Icons.verified, 
                                color: Theme.of(context).brightness == Brightness.light ? AppTheme.primary : const Color(0xFFA7C8FF), 
                                size: 16),
                              const SizedBox(width: 4),
                              Text('Mwl. Juma', style: Theme.of(context).textTheme.bodyMedium),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Biology Form 4: Human Reproduction System',
                            style: Theme.of(context).textTheme.headlineMedium,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Tsh 2,000',
                                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                  color: AppTheme.secondary,
                                ),
                              ),
                              ElevatedButton(
                                onPressed: () {},
                                child: Text(l10n.enrollNow),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              OutlinedButton(
                onPressed: () {},
                child: Text(l10n.viewProfile),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppTheme.accent,
        child: const Icon(Icons.chat_bubble, color: AppTheme.primary),
      ),
    );
  }
}
