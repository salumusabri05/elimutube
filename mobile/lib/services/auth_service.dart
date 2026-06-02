import 'package:flutter/material.dart';
import 'api_service.dart';

class AuthProvider extends ChangeNotifier {
  Map<String, dynamic>? _currentUser;
  bool _isLoading = false;

  Map<String, dynamic>? get currentUser => _currentUser;
  bool get isLoading => _isLoading;

  bool get isStudent => _currentUser?['active_role'] == 'STUDENT';
  bool get isTeacher => _currentUser?['active_role'] == 'TEACHER';

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      // Mock login endpoint /auth/login or tables query for simplicity
      final users = await ApiService.get('database/tables/user');
      final user = (users as List).firstWhere(
        (u) => u['email'] == email,
        orElse: () => null,
      );

      if (user == null) {
        throw Exception('User not found. Try registering!');
      }

      _currentUser = Map<String, dynamic>.from(user);
      ApiService.token = 'mock_jwt_token_${user['id']}'; // Store mock token
      notifyListeners();
    } catch (e) {
      debugPrint('Auth login error, falling back to mock login: $e');
      final mockId = email.split('@')[0];
      final mockRole = email.contains('teacher') ? 'TEACHER' : 'STUDENT';
      _currentUser = {
        'id': mockId,
        'email': email,
        'phone': '+255700000000',
        'display_name': mockId.toUpperCase(),
        'roles': [mockRole],
        'active_role': mockRole,
        'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=$mockId',
      };
      ApiService.token = 'mock_jwt_token_$mockId';
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String phone,
    required String email,
    required String password,
    required String initialRole,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final newUser = {
        'email': email,
        'phone': phone,
        'display_name': name,
        'roles': [initialRole],
        'active_role': initialRole,
        'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=$name',
      };

      final createdUser = await ApiService.post('database/tables/user', newUser);
      _currentUser = Map<String, dynamic>.from(createdUser);
      ApiService.token = 'mock_jwt_token_${createdUser['id']}';
      notifyListeners();
    } catch (e) {
      debugPrint('Auth register error, falling back to mock register: $e');
      _currentUser = {
        'id': 'mock_${email.split('@')[0]}',
        'email': email,
        'phone': phone,
        'display_name': name,
        'roles': [initialRole],
        'active_role': initialRole,
        'avatar_url': 'https://api.dicebear.com/7.x/adventurer/svg?seed=$name',
      };
      ApiService.token = 'mock_jwt_token_${_currentUser!['id']}';
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> switchMode() async {
    if (_currentUser == null) return;

    final currentRole = _currentUser!['active_role'];
    final newRole = currentRole == 'STUDENT' ? 'TEACHER' : 'STUDENT';

    // Verify if teacher role is possessed, or auto-assign for testing convenience
    List rolesList = _currentUser!['roles'] ?? [];
    if (!rolesList.contains(newRole)) {
      rolesList.add(newRole);
    }

    _isLoading = true;
    notifyListeners();

    try {
      final updatedUser = await ApiService.post(
        'database/tables/user/${_currentUser!['id']}/update',
        {
          'active_role': newRole,
          'roles': rolesList,
        },
      );

      _currentUser = Map<String, dynamic>.from(updatedUser);
      notifyListeners();
    } catch (e) {
      // Offline fallback / local toggle for testing
      _currentUser!['active_role'] = newRole;
      _currentUser!['roles'] = rolesList;
      notifyListeners();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void logout() {
    _currentUser = null;
    ApiService.token = null;
    notifyListeners();
  }
}
