import 'package:intl/intl.dart';
import '../constants/app_constants.dart';

class Formatters {
  // Currency formatter for Brazilian Real
  static final NumberFormat _currencyFormatter = NumberFormat.currency(
    locale: AppConstants.currencyLocale,
    symbol: AppConstants.currencySymbol,
    decimalDigits: 2,
  );
  
  // Date formatters
  static final DateFormat _dateFormatter = DateFormat(AppConstants.dateFormat);
  static final DateFormat _dateTimeFormatter = DateFormat(AppConstants.dateTimeFormat);
  static final DateFormat _timeFormatter = DateFormat(AppConstants.timeFormat);
  
  // Format currency
  static String formatCurrency(double value) {
    return _currencyFormatter.format(value);
  }
  
  // Format number with decimal places
  static String formatNumber(double value, {int decimalPlaces = 2}) {
    final formatter = NumberFormat.currency(
      locale: AppConstants.currencyLocale,
      symbol: '',
      decimalDigits: decimalPlaces,
    );
    return formatter.format(value).trim();
  }
  
  // Parse currency string to double
  static double parseCurrency(String value) {
    try {
      // Remove currency symbol and spaces
      String cleanValue = value
          .replaceAll(AppConstants.currencySymbol, '')
          .replaceAll(' ', '')
          .replaceAll('.', '') // Remove thousands separator
          .replaceAll(',', '.'); // Replace decimal separator
      
      return double.parse(cleanValue);
    } catch (e) {
      return 0.0;
    }
  }
  
  // Format date
  static String formatDate(DateTime date) {
    return _dateFormatter.format(date);
  }
  
  // Format date and time
  static String formatDateTime(DateTime dateTime) {
    return _dateTimeFormatter.format(dateTime);
  }
  
  // Format time only
  static String formatTime(DateTime time) {
    return _timeFormatter.format(time);
  }
  
  // Parse date string
  static DateTime? parseDate(String dateString) {
    try {
      return _dateFormatter.parse(dateString);
    } catch (e) {
      return null;
    }
  }
  
  // Parse date time string
  static DateTime? parseDateTime(String dateTimeString) {
    try {
      return _dateTimeFormatter.parse(dateTimeString);
    } catch (e) {
      return null;
    }
  }
  
  // Format phone number (Brazilian format)
  static String formatPhone(String phone) {
    // Remove all non-numeric characters
    String cleanPhone = phone.replaceAll(RegExp(r'[^\d]'), '');
    
    if (cleanPhone.length == 10) {
      // Format: (XX) XXXX-XXXX
      return '(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}';
    } else if (cleanPhone.length == 11) {
      // Format: (XX) XXXXX-XXXX
      return '(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}';
    }
    
    return phone; // Return original if format is not recognized
  }
  
  // Parse phone number to clean format
  static String parsePhone(String phone) {
    return phone.replaceAll(RegExp(r'[^\d]'), '');
  }
  
  // Format CPF (Brazilian tax ID)
  static String formatCPF(String cpf) {
    // Remove all non-numeric characters
    String cleanCPF = cpf.replaceAll(RegExp(r'[^\d]'), '');
    
    if (cleanCPF.length == 11) {
      // Format: XXX.XXX.XXX-XX
      return '${cleanCPF.substring(0, 3)}.${cleanCPF.substring(3, 6)}.${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}';
    }
    
    return cpf; // Return original if format is not recognized
  }
  
  // Parse CPF to clean format
  static String parseCPF(String cpf) {
    return cpf.replaceAll(RegExp(r'[^\d]'), '');
  }
  
  // Format CNPJ (Brazilian company tax ID)
  static String formatCNPJ(String cnpj) {
    // Remove all non-numeric characters
    String cleanCNPJ = cnpj.replaceAll(RegExp(r'[^\d]'), '');
    
    if (cleanCNPJ.length == 14) {
      // Format: XX.XXX.XXX/XXXX-XX
      return '${cleanCNPJ.substring(0, 2)}.${cleanCNPJ.substring(2, 5)}.${cleanCNPJ.substring(5, 8)}/${cleanCNPJ.substring(8, 12)}-${cleanCNPJ.substring(12)}';
    }
    
    return cnpj; // Return original if format is not recognized
  }
  
  // Parse CNPJ to clean format
  static String parseCNPJ(String cnpj) {
    return cnpj.replaceAll(RegExp(r'[^\d]'), '');
  }
  
  // Format percentage
  static String formatPercentage(double value, {int decimalPlaces = 1}) {
    final formatter = NumberFormat.percentPattern(AppConstants.currencyLocale);
    formatter.minimumFractionDigits = decimalPlaces;
    formatter.maximumFractionDigits = decimalPlaces;
    return formatter.format(value / 100);
  }
  
  // Format file size
  static String formatFileSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    if (bytes < 1024 * 1024 * 1024) return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    return '${(bytes / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }
  
  // Format duration
  static String formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    
    if (duration.inHours > 0) {
      return '${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds';
    } else {
      return '$twoDigitMinutes:$twoDigitSeconds';
    }
  }
  
  // Format relative time (e.g., "2 hours ago")
  static String formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inDays > 0) {
      return '${difference.inDays} dia${difference.inDays > 1 ? 's' : ''} atrás';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hora${difference.inHours > 1 ? 's' : ''} atrás';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minuto${difference.inMinutes > 1 ? 's' : ''} atrás';
    } else {
      return 'Agora mesmo';
    }
  }
  
  // Capitalize first letter of each word
  static String capitalizeWords(String text) {
    if (text.isEmpty) return text;
    
    return text.split(' ').map((word) {
      if (word.isEmpty) return word;
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(' ');
  }
  
  // Truncate text with ellipsis
  static String truncateText(String text, int maxLength) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength)}...';
  }
  
  // Format quantity with unit
  static String formatQuantity(double quantity, String unit) {
    if (quantity == quantity.toInt()) {
      return '${quantity.toInt()} $unit';
    } else {
      return '${formatNumber(quantity)} $unit';
    }
  }
  
  // Format stock status
  static String formatStockStatus(int quantity) {
    if (quantity <= 0) {
      return 'Sem estoque';
    } else if (quantity <= AppConstants.criticalStockThreshold) {
      return 'Estoque crítico';
    } else if (quantity <= AppConstants.lowStockThreshold) {
      return 'Estoque baixo';
    } else {
      return 'Em estoque';
    }
  }
  
  // Format compact number (e.g., 1.2K, 1.5M)
  static String formatCompactNumber(double number) {
    if (number < 1000) {
      return number.toInt().toString();
    } else if (number < 1000000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else if (number < 1000000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else {
      return '${(number / 1000000000).toStringAsFixed(1)}B';
    }
  }
} 