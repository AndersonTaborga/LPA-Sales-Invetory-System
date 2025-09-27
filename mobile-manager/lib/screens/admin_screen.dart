import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../providers/auth_provider.dart';
import '../providers/product_provider.dart';
import '../providers/sale_provider.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        // Only allow access to admin users
        if (!authProvider.isAdmin) {
          return _buildAccessDenied();
        }

        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text('Admin Dashboard'),
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textOnPrimary,
            elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome Admin
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.primary,
                        AppColors.primary.withValues(alpha: 0.8),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(
                        Icons.admin_panel_settings,
                        color: AppColors.textOnPrimary,
                        size: 32,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Welcome, ${authProvider.currentUser?.name ?? 'Admin'}!',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textOnPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'You have FULL ACCESS to all system features',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textOnPrimary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Quick Stats
                _buildQuickStats(),

                const SizedBox(height: 24),

                // Admin Actions
                const Text(
                  'Admin Controls',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),

                const SizedBox(height: 16),

                // Product Management
                _buildAdminSection(
                  title: 'Product Management',
                  subtitle: 'Full control over products',
                  icon: Icons.inventory_2,
                  color: AppColors.primary,
                  actions: [
                    _AdminAction(
                      icon: Icons.add,
                      title: 'Add Product',
                      onTap: () => _navigateToAddProduct(context),
                    ),
                    _AdminAction(
                      icon: Icons.edit,
                      title: 'Manage Products',
                      onTap: () => _navigateToProducts(context),
                    ),
                    _AdminAction(
                      icon: Icons.inventory,
                      title: 'Stock Control',
                      onTap: () => _showStockManagement(context),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Sales Management
                _buildAdminSection(
                  title: 'Sales Management',
                  subtitle: 'Monitor and control all sales',
                  icon: Icons.point_of_sale,
                  color: AppColors.success,
                  actions: [
                    _AdminAction(
                      icon: Icons.add_shopping_cart,
                      title: 'New Sale',
                      onTap: () => _navigateToNewSale(context),
                    ),
                    _AdminAction(
                      icon: Icons.receipt_long,
                      title: 'All Sales',
                      onTap: () => _navigateToSales(context),
                    ),
                    _AdminAction(
                      icon: Icons.analytics,
                      title: 'Sales Reports',
                      onTap: () => _showSalesReports(context),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // User Management
                _buildAdminSection(
                  title: 'User Management',
                  subtitle: 'Manage users and permissions',
                  icon: Icons.people,
                  color: AppColors.info,
                  actions: [
                    _AdminAction(
                      icon: Icons.person_add,
                      title: 'Add User',
                      onTap: () => _showUserManagement(context),
                    ),
                    _AdminAction(
                      icon: Icons.security,
                      title: 'Permissions',
                      onTap: () => _showPermissions(context),
                    ),
                    _AdminAction(
                      icon: Icons.group,
                      title: 'All Users',
                      onTap: () => _showAllUsers(context),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // System Management
                _buildAdminSection(
                  title: 'System Management',
                  subtitle: 'System settings and maintenance',
                  icon: Icons.settings,
                  color: AppColors.warning,
                  actions: [
                    _AdminAction(
                      icon: Icons.backup,
                      title: 'Backup Data',
                      onTap: () => _showBackupOptions(context),
                    ),
                    _AdminAction(
                      icon: Icons.category,
                      title: 'Categories',
                      onTap: () => _showCategoryManagement(context),
                    ),
                    _AdminAction(
                      icon: Icons.admin_panel_settings,
                      title: 'System Config',
                      onTap: () => _showSystemConfig(context),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildAccessDenied() {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.block,
              size: 64,
              color: AppColors.error,
            ),
            SizedBox(height: 16),
            Text(
              'Access Denied',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'You need admin privileges to access this area',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickStats() {
    return Consumer2<ProductProvider, SaleProvider>(
      builder: (context, productProvider, saleProvider, child) {
        return Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Products',
                productProvider.products.length.toString(),
                Icons.inventory_2,
                AppColors.primary,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Sales',
                saleProvider.sales.length.toString(),
                Icons.point_of_sale,
                AppColors.success,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Revenue',
                '\$${saleProvider.getTotalSalesValue().toStringAsFixed(0)}',
                Icons.attach_money,
                AppColors.info,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildAdminSection({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required List<_AdminAction> actions,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: actions.map((action) => _buildActionChip(action)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildActionChip(_AdminAction action) {
    return InkWell(
      onTap: action.onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(action.icon, size: 16, color: AppColors.primary),
            const SizedBox(width: 4),
            Text(
              action.title,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.primary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Navigation methods
  void _navigateToAddProduct(BuildContext context) {
    Navigator.pushNamed(context, '/add-product');
  }

  void _navigateToProducts(BuildContext context) {
    Navigator.pushNamed(context, '/products');
  }

  void _navigateToNewSale(BuildContext context) {
    Navigator.pushNamed(context, '/new-sale');
  }

  void _navigateToSales(BuildContext context) {
    Navigator.pushNamed(context, '/sales');
  }

  // TODO: Implement these admin features
  void _showStockManagement(BuildContext context) {
    _showComingSoon(context, 'Stock Management');
  }

  void _showSalesReports(BuildContext context) {
    _showComingSoon(context, 'Sales Reports');
  }

  void _showUserManagement(BuildContext context) {
    _showComingSoon(context, 'User Management');
  }

  void _showPermissions(BuildContext context) {
    _showComingSoon(context, 'Permission Management');
  }

  void _showAllUsers(BuildContext context) {
    _showComingSoon(context, 'User List');
  }

  void _showBackupOptions(BuildContext context) {
    _showComingSoon(context, 'Backup & Restore');
  }

  void _showCategoryManagement(BuildContext context) {
    _showComingSoon(context, 'Category Management');
  }

  void _showSystemConfig(BuildContext context) {
    _showComingSoon(context, 'System Configuration');
  }

  void _showComingSoon(BuildContext context, String feature) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(feature),
        content: Text('$feature is coming soon! This is where you would manage this feature as an admin.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}

class _AdminAction {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  _AdminAction({
    required this.icon,
    required this.title,
    required this.onTap,
  });
} 