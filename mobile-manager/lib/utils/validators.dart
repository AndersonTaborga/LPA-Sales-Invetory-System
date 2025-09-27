import '../constants/app_constants.dart';

class Validators {
  // Email validation
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!emailRegex.hasMatch(value)) {
      return AppConstants.invalidEmailError;
    }
    
    return null;
  }
  
  // Password validation
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    if (value.length < 6) {
      return AppConstants.invalidPasswordError;
    }
    
    return null;
  }
  
  // Required field validation
  static String? validateRequired(String? value, [String? fieldName]) {
    if (value == null || value.trim().isEmpty) {
      return fieldName != null 
          ? '$fieldName is required'
          : AppConstants.requiredFieldError;
    }
    return null;
  }
  
  // Quantity validation
  static String? validateQuantity(String? value) {
    if (value == null || value.isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    final quantity = double.tryParse(value);
    if (quantity == null || quantity <= 0) {
      return AppConstants.invalidQuantityError;
    }
    
    return null;
  }
  
  // Price validation
  static String? validatePrice(String? value) {
    if (value == null || value.isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    // Remove currency symbols and spaces
    final cleanValue = value.replaceAll(RegExp(r'[\$\s,]'), '').replaceAll(',', '.');
    final price = double.tryParse(cleanValue);
    
    if (price == null || price < 0) {
      return AppConstants.invalidPriceError;
    }
    
    return null;
  }
  
  // Phone validation
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    // Remove all non-numeric characters
    final cleanPhone = value.replaceAll(RegExp(r'[^\d]'), '');
    
    // Phone numbers: 10 or 11 digits
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return AppConstants.invalidPhoneError;
    }
    
    return null;
  }
  
  // Tax ID validation
  static String? validateTaxId(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Tax ID is optional in many cases
    }
    
    // Remove all non-alphanumeric characters
    final cleanId = value.replaceAll(RegExp(r'[^\w]'), '');
    
    // Tax ID must have at least 9 characters
    if (cleanId.length < 9) {
      return 'Invalid Tax ID';
    }
    
    return null;
  }
  
  // Company Tax ID validation
  static String? validateCompanyTaxId(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Company Tax ID is optional in many cases
    }
    
    // Remove all non-alphanumeric characters
    final cleanId = value.replaceAll(RegExp(r'[^\w]'), '');
    
    // Company Tax ID must have at least 9 characters
    if (cleanId.length < 9) {
      return 'Invalid Company Tax ID';
    }
    
    return null;
  }
  
  // Name validation
  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    
    return null;
  }
  
  // SKU validation
  static String? validateSKU(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    // SKU should be alphanumeric and at least 3 characters
    if (value.trim().length < 3) {
      return 'SKU must be at least 3 characters';
    }
    
    if (!RegExp(r'^[a-zA-Z0-9-_]+$').hasMatch(value.trim())) {
      return 'SKU must contain only letters, numbers, hyphens and underscores';
    }
    
    return null;
  }
  
  // Confirm password validation
  static String? validateConfirmPassword(String? value, String? password) {
    if (value == null || value.isEmpty) {
      return AppConstants.requiredFieldError;
    }
    
    if (value != password) {
      return 'Passwords do not match';
    }
    
    return null;
  }
} 