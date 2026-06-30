import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/utils/helpers/logs.dart';

enum SocialAuthProvider { apple, google }

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService._internal(ref);
});

class AuthService {
  static AuthService? _instance;

  final Ref ref;
  final FirebaseAuth firebaseAuth = FirebaseAuth.instance;

  User? _firebaseUser;

  StreamSubscription<User?>? _authSubscription;

  IdTokenResult? token;

  AuthService._internal(this.ref) {
    fetchToken();
  }

  factory AuthService(Ref ref) {
    _instance ??= AuthService._internal(ref);
    return _instance!;
  }

  static void resetInstance() {
    _instance = null;
  }

  SocialAuthProvider get authProvider {
    final provider = firebaseAuth.currentUser?.providerData[0].providerId;

    return switch (provider) {
      'apple.com' => SocialAuthProvider.apple,
      _ => SocialAuthProvider.google,
    };
  }

  User? get currentFirebaseUser => FirebaseAuth.instance.currentUser;

  Future<IdTokenResult?> fetchToken([bool refreshToken = false]) async {
    token = await currentFirebaseUser?.getIdTokenResult(refreshToken);
    return token;
  }

  Stream<User?> _authStateChanges() => firebaseAuth.authStateChanges();

  void userAuthStream({required Function(User? user) userOnChanged}) {
    _authSubscription?.cancel();
    _authSubscription = null;

    _authSubscription = _authStateChanges().listen((event) async {
      bool useCallback =
          (_firebaseUser != null && event == null) ||
          (_firebaseUser == null && event != null);
      _firebaseUser = event;

      if (useCallback) userOnChanged(event);
    });
  }

  Future<String?> reloadFirebaseUser() async {
    await FirebaseAuth.instance.currentUser?.reload();

    fetchToken(true);
    return currentFirebaseUser?.uid;
  }

  Future<bool> signOut() async {
    try {
      await firebaseAuth.signOut();

      fetchToken(true);

      return true;
    } on FirebaseAuthException catch (e, trace) {
      logPrint(e, trace: trace);
    }

    return false;
  }

  Future<UserCredential?> signInWithCustomToken(String authToken) async {
    try {
      final user = await firebaseAuth.signInWithCustomToken(authToken);

      return user;
    } on FirebaseAuthException catch (e, trace) {
      logPrint(e, trace: trace);
    }

    return null;
  }

  void dispose() {
    _authSubscription?.cancel();
    _authSubscription = null;
  }
}
