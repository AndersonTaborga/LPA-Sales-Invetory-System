import '../constants/app_constants.dart';

class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final List<String> permissions;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final bool isActive;
  final String? department;
  final String? phone;
  final String? avatar;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.permissions,
    this.createdAt,
    this.updatedAt,
    this.isActive = true,
    this.department,
    this.phone,
    this.avatar,
  });

  // Factory constructor from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString() ?? '',
      name: json['username'] ?? json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'customer',
      permissions: List<String>.from(json['permissions'] ?? []),
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt']) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.tryParse(json['updatedAt']) 
          : null,
      isActive: json['is_active'] ?? true,
      department: json['department'],
      phone: json['phone'],
      avatar: json['avatar'],
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'permissions': permissions,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'is_active': isActive,
      'department': department,
      'phone': phone,
      'avatar': avatar,
    };
  }

  // Permission checking methods
  bool hasPermission(String permission) {
    // Admin has ALL permissions automatically
    if (isAdmin) return true;
    return permissions.contains(permission);
  }

  bool canViewProducts() {
    if (isAdmin) return true;
    return hasPermission(AppConstants.viewProductsPermission);
  }

  bool canViewSales() {
    if (isAdmin) return true;
    return hasPermission(AppConstants.viewSalesPermission);
  }

  bool canCreateSales() {
    if (isAdmin) return true;
    return hasPermission(AppConstants.createSalesPermission);
  }

  bool canViewCustomers() {
    if (isAdmin) return true;
    return hasPermission(AppConstants.viewCustomersPermission);
  }

  bool canViewStock() {
    if (isAdmin) return true;
    return hasPermission(AppConstants.viewStockPermission);
  }

  // ADMIN SUPER POWERS - Admin can do EVERYTHING
  bool canCreateProducts() {
    if (isAdmin) return true;
    return hasPermission('create_products');
  }

  bool canEditProducts() {
    if (isAdmin) return true;
    return hasPermission('edit_products');
  }

  bool canDeleteProducts() {
    if (isAdmin) return true;
    return hasPermission('delete_products');
  }

  bool canManageStock() {
    if (isAdmin) return true;
    return hasPermission('manage_stock');
  }

  bool canEditSales() {
    if (isAdmin) return true;
    return hasPermission('edit_sales');
  }

  bool canCancelSales() {
    if (isAdmin) return true;
    return hasPermission('cancel_sales');
  }

  bool canManageUsers() {
    if (isAdmin) return true;
    return hasPermission('manage_users');
  }

  bool canViewReports() {
    if (isAdmin) return true;
    return hasPermission('view_reports');
  }

  bool canManageCategories() {
    if (isAdmin) return true;
    return hasPermission('manage_categories');
  }

  bool canManageCustomers() {
    if (isAdmin) return true;
    return hasPermission('manage_customers');
  }

  bool canAccessAllData() {
    return isAdmin; // Only admin can access all data
  }

  bool canOverridePermissions() {
    return isAdmin; // Only admin can override system permissions
  }

  // Role checking methods
  bool get isAdmin => role.toLowerCase() == 'admin';
  bool get isManager => role.toLowerCase() == 'manager';
  bool get isSalesperson => role.toLowerCase() == 'salesperson';
  bool get isFieldUser => role.toLowerCase() == 'field_user';

  // Get display name (first name + last initial)
  String get displayName {
    final nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return '${nameParts.first} ${nameParts.last[0]}.';
    }
    return name;
  }

  // Get initials for avatar
  String get initials {
    final nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return '${nameParts.first[0]}${nameParts.last[0]}'.toUpperCase();
    } else if (name.isNotEmpty) {
      return name.substring(0, 1).toUpperCase();
    }
    return 'U';
  }

  // Copy with method for updating user data
  User copyWith({
    String? id,
    String? name,
    String? email,
    String? role,
    List<String>? permissions,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isActive,
    String? department,
    String? phone,
    String? avatar,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      role: role ?? this.role,
      permissions: permissions ?? this.permissions,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isActive: isActive ?? this.isActive,
      department: department ?? this.department,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'User(id: $id, name: $name, email: $email, role: $role)';
  }
} 