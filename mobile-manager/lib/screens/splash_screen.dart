import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import '../providers/auth_provider.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import 'login_screen.dart';
import 'home_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    
    _initializeAnimations();
    _initializeApp();
  }

  void _initializeAnimations() {
    _animationController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: const Interval(0.0, 0.5, curve: Curves.easeIn),
    ));

    _scaleAnimation = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: const Interval(0.0, 0.7, curve: Curves.elasticOut),
    ));

    _animationController.forward();
  }

  Future<void> _initializeApp() async {
    try {
      // Inicializa o AuthProvider
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.initialize();

      // Aguarda pelo menos 2 segundos para mostrar a splash
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        _navigateToNextScreen(authProvider.isAuthenticated);
      }
    } catch (e) {
      // Em caso de erro, navega para login
      if (mounted) {
        _navigateToNextScreen(false);
      }
    }
  }

  void _navigateToNextScreen(bool isAuthenticated) {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) {
          return isAuthenticated ? const HomeScreen() : const LoginScreen();
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: animation,
            child: child,
          );
        },
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppColors.primaryGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                flex: 3,
                child: Center(
                  child: AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return FadeTransition(
                        opacity: _fadeAnimation,
                        child: ScaleTransition(
                          scale: _scaleAnimation,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildLogo(),
                              const SizedBox(height: 24),
                              _buildAppName(),
                              const SizedBox(height: 8),
                              _buildTagline(),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
              Expanded(
                flex: 1,
                child: Column(
                  children: [
                    _buildLoadingIndicator(),
                    const SizedBox(height: 24),
                    _buildVersion(),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLogo() {
    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        color: AppColors.textOnPrimary.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(
          color: AppColors.textOnPrimary.withValues(alpha: 0.3),
          width: 2,
        ),
      ),
      child: const Icon(
        Icons.store,
        size: 60,
        color: AppColors.textOnPrimary,
      ),
    );
  }

  Widget _buildAppName() {
    return const Text(
      AppConstants.appName,
      style: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: AppColors.textOnPrimary,
        letterSpacing: 1.2,
      ),
    );
  }

  Widget _buildTagline() {
    return const Text(
      'Sales and Inventory Management',
      style: TextStyle(
        fontSize: 16,
        color: AppColors.textOnPrimary,
        fontWeight: FontWeight.w300,
        letterSpacing: 0.5,
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return const SpinKitPulse(
      color: AppColors.textOnPrimary,
      size: 40.0,
    );
  }

  Widget _buildVersion() {
    return Column(
      children: [
        Text(
          'Version ${AppConstants.appVersion}',
          style: TextStyle(
            fontSize: 12,
            color: AppColors.textOnPrimary.withValues(alpha: 0.8),
            fontWeight: FontWeight.w300,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Built with Flutter',
          style: TextStyle(
            fontSize: 10,
            color: AppColors.textOnPrimary.withValues(alpha: 0.6),
            fontWeight: FontWeight.w300,
          ),
        ),
      ],
    );
  }
} 