import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import '../constants/app_colors.dart';

enum ButtonType {
  primary,
  secondary,
  outline,
  danger,
  success,
  warning,
}

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonType type;
  final bool isLoading;
  final bool isExpanded;
  final IconData? icon;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final double? fontSize;
  final FontWeight? fontWeight;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = ButtonType.primary,
    this.isLoading = false,
    this.isExpanded = true,
    this.icon,
    this.width,
    this.height,
    this.padding,
    this.fontSize,
    this.fontWeight,
  });

  @override
  Widget build(BuildContext context) {
    final buttonStyle = _getButtonStyle();
    final textColor = _getTextColor();
    final isDisabled = onPressed == null || isLoading;

    Widget buttonChild = Row(
      mainAxisSize: isExpanded ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (isLoading) ...[
          SpinKitThreeBounce(
            color: textColor,
            size: 16,
          ),
          const SizedBox(width: 8),
        ] else if (icon != null) ...[
          Icon(
            icon,
            color: textColor,
            size: 18,
          ),
          const SizedBox(width: 8),
        ],
        Text(
          isLoading ? 'Carregando...' : text,
          style: TextStyle(
            color: textColor,
            fontSize: fontSize ?? 16,
            fontWeight: fontWeight ?? FontWeight.w600,
          ),
        ),
      ],
    );

    Widget button;

    switch (type) {
      case ButtonType.outline:
        button = OutlinedButton(
          onPressed: isDisabled ? null : onPressed,
          style: buttonStyle,
          child: buttonChild,
        );
        break;
      default:
        button = ElevatedButton(
          onPressed: isDisabled ? null : onPressed,
          style: buttonStyle,
          child: buttonChild,
        );
        break;
    }

    if (width != null || height != null) {
      button = SizedBox(
        width: width,
        height: height ?? 48,
        child: button,
      );
    } else if (isExpanded) {
      button = SizedBox(
        width: double.infinity,
        height: height ?? 48,
        child: button,
      );
    }

    return button;
  }

  ButtonStyle _getButtonStyle() {
    final colors = _getColors();
    
    return ElevatedButton.styleFrom(
      backgroundColor: colors['background'],
      foregroundColor: colors['foreground'],
      disabledBackgroundColor: colors['background']?.withValues(alpha: 0.5),
      disabledForegroundColor: colors['foreground']?.withValues(alpha: 0.5),
      elevation: type == ButtonType.outline ? 0 : 2,
      padding: padding ?? const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: type == ButtonType.outline 
            ? BorderSide(color: colors['background'] ?? AppColors.primary)
            : BorderSide.none,
      ),
      shadowColor: AppColors.shadow,
    );
  }

  Map<String, Color?> _getColors() {
    switch (type) {
      case ButtonType.primary:
        return {
          'background': AppColors.primary,
          'foreground': AppColors.textOnPrimary,
        };
      case ButtonType.secondary:
        return {
          'background': AppColors.buttonSecondary,
          'foreground': AppColors.textOnPrimary,
        };
      case ButtonType.outline:
        return {
          'background': AppColors.primary,
          'foreground': AppColors.primary,
        };
      case ButtonType.danger:
        return {
          'background': AppColors.error,
          'foreground': AppColors.textOnPrimary,
        };
      case ButtonType.success:
        return {
          'background': AppColors.success,
          'foreground': AppColors.textOnPrimary,
        };
      case ButtonType.warning:
        return {
          'background': AppColors.warning,
          'foreground': AppColors.textPrimary,
        };
    }
  }

  Color _getTextColor() {
    if (type == ButtonType.outline) {
      return AppColors.primary;
    }
    
    final colors = _getColors();
    return colors['foreground'] ?? AppColors.textOnPrimary;
  }
}

// Specialized button variants for common use cases
class PrimaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  const PrimaryButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return CustomButton(
      text: text,
      onPressed: onPressed,
      type: ButtonType.primary,
      isLoading: isLoading,
      icon: icon,
    );
  }
}

class SecondaryButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  const SecondaryButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return CustomButton(
      text: text,
      onPressed: onPressed,
      type: ButtonType.secondary,
      isLoading: isLoading,
      icon: icon,
    );
  }
}

class OutlineButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  const OutlineButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return CustomButton(
      text: text,
      onPressed: onPressed,
      type: ButtonType.outline,
      isLoading: isLoading,
      icon: icon,
    );
  }
}

class DangerButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  const DangerButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return CustomButton(
      text: text,
      onPressed: onPressed,
      type: ButtonType.danger,
      isLoading: isLoading,
      icon: icon,
    );
  }
}

class SuccessButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;

  const SuccessButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return CustomButton(
      text: text,
      onPressed: onPressed,
      type: ButtonType.success,
      isLoading: isLoading,
      icon: icon,
    );
  }
} 