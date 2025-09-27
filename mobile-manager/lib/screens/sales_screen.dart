import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/sale_provider.dart';
import '../providers/auth_provider.dart';
import '../models/sale.dart';
import '../constants/app_colors.dart';
import '../utils/formatters.dart';

class SalesScreen extends StatefulWidget {
  const SalesScreen({super.key});

  @override
  State<SalesScreen> createState() => _SalesScreenState();
}

class _SalesScreenState extends State<SalesScreen> {
  SaleStatus? _selectedStatus;
  
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadSales();
    });
  }

  void _loadSales() {
    final saleProvider = Provider.of<SaleProvider>(context, listen: false);
    // For now, we'll just generate some mock sales
    _generateMockSales(saleProvider);
  }

  void _generateMockSales(SaleProvider saleProvider) {
    // Generate some mock sales for demonstration
    final mockSales = [
      Sale(
        id: '1',
        customerId: '1',
        customerName: 'João Silva',
        sellerId: '1',
        sellerName: 'Vendedor 1',
        items: [],
        status: SaleStatus.confirmed,
        createdAt: DateTime.now().subtract(const Duration(hours: 2)),
        subtotal: 250.00,
        total: 250.00,
      ),
      Sale(
        id: '2',
        customerId: '2',
        customerName: 'Maria Santos',
        sellerId: '1',
        sellerName: 'Vendedor 1',
        items: [],
        status: SaleStatus.pending,
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        subtotal: 180.50,
        total: 180.50,
      ),
      Sale(
        id: '3',
        customerId: '3',
        customerName: 'Pedro Costa',
        sellerId: '1',
        sellerName: 'Vendedor 1',
        items: [],
        status: SaleStatus.delivered,
        createdAt: DateTime.now().subtract(const Duration(days: 1)),
        subtotal: 420.00,
        total: 420.00,
      ),
    ];

    for (final sale in mockSales) {
      saleProvider.addSaleToList(sale);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (!authProvider.canViewSales()) {
          return _buildNoPermissionScreen();
        }

        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text('Sales'),
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textOnPrimary,
            actions: [
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: _showFilterDialog,
              ),
            ],
          ),
          body: Consumer<SaleProvider>(
            builder: (context, saleProvider, child) {
              return Column(
                children: [
                  _buildFilterChips(saleProvider),
                  _buildSalesStats(saleProvider),
                  Expanded(child: _buildSalesList(saleProvider)),
                ],
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildNoPermissionScreen() {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Sales'),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.lock,
              size: 64,
              color: AppColors.textHint,
            ),
            SizedBox(height: 16),
            Text(
              'No Permission',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'You do not have permission to view sales',
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

  Widget _buildFilterChips(SaleProvider saleProvider) {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: AppColors.surface,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          _buildFilterChip('Todas', null, saleProvider),
          const SizedBox(width: 8),
          _buildFilterChip('Rascunho', SaleStatus.draft, saleProvider),
          const SizedBox(width: 8),
          _buildFilterChip('Pendente', SaleStatus.pending, saleProvider),
          const SizedBox(width: 8),
          _buildFilterChip('Confirmada', SaleStatus.confirmed, saleProvider),
          const SizedBox(width: 8),
          _buildFilterChip('Entregue', SaleStatus.delivered, saleProvider),
          const SizedBox(width: 8),
          _buildFilterChip('Cancelada', SaleStatus.cancelled, saleProvider),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, SaleStatus? status, SaleProvider saleProvider) {
    final isSelected = _selectedStatus == status;
    final salesWithStatus = status != null 
        ? saleProvider.getSalesByStatus(status).length 
        : saleProvider.sales.length;

    return FilterChip(
      label: Text('$label ($salesWithStatus)'),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _selectedStatus = selected ? status : null;
        });
      },
      selectedColor: AppColors.primary.withValues(alpha: 0.2),
      checkmarkColor: AppColors.primary,
      labelStyle: TextStyle(
        color: isSelected ? AppColors.primary : AppColors.textSecondary,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
      ),
    );
  }

  Widget _buildSalesStats(SaleProvider saleProvider) {
    final filteredSales = _getFilteredSales(saleProvider);
    final totalValue = filteredSales.fold(0.0, (sum, sale) => sum + sale.total);
    
    return Container(
      padding: const EdgeInsets.all(16),
      color: AppColors.surface,
      child: Row(
        children: [
          Expanded(
            child: _buildStatCard(
              'Total Sales',
              filteredSales.length.toString(),
              Icons.receipt_long,
              AppColors.info,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: _buildStatCard(
              'Total Value',
              Formatters.formatCurrency(totalValue),
              Icons.attach_money,
              AppColors.success,
            ),
          ),
        ],
      ),
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

  Widget _buildSalesList(SaleProvider saleProvider) {
    final filteredSales = _getFilteredSales(saleProvider);

    if (filteredSales.isEmpty) {
      return _buildEmptyState();
    }

    return RefreshIndicator(
      onRefresh: () async {
        _loadSales();
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: filteredSales.length,
        itemBuilder: (context, index) {
          final sale = filteredSales[index];
          return _buildSaleCard(sale);
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.receipt_long_outlined,
            size: 64,
            color: AppColors.textHint,
          ),
          SizedBox(height: 16),
          Text(
            'No sales found',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Try adjusting filters or create a new sale',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSaleCard(Sale sale) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showSaleDetails(sale),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Sale #${sale.id}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  _buildStatusBadge(sale.status),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.person_outline,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    sale.customerDisplayName,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(
                    Icons.access_time,
                    size: 16,
                    color: AppColors.textSecondary,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Created on ${sale.formattedCreatedAt}',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    sale.summary,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  Text(
                    sale.formattedTotal,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(SaleStatus status) {
    Color color;
    String text;

    switch (status) {
      case SaleStatus.draft:
        color = AppColors.textHint;
        text = 'Rascunho';
        break;
      case SaleStatus.pending:
        color = AppColors.warning;
        text = 'Pendente';
        break;
      case SaleStatus.confirmed:
        color = AppColors.info;
        text = 'Confirmada';
        break;
      case SaleStatus.processing:
        color = AppColors.accent;
        text = 'Processando';
        break;
      case SaleStatus.shipped:
        color = AppColors.secondary;
        text = 'Enviada';
        break;
      case SaleStatus.delivered:
        color = AppColors.success;
        text = 'Entregue';
        break;
      case SaleStatus.cancelled:
        color = AppColors.error;
        text = 'Cancelada';
        break;
      case SaleStatus.refunded:
        color = AppColors.error;
        text = 'Reembolsada';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  List<Sale> _getFilteredSales(SaleProvider saleProvider) {
    if (_selectedStatus == null) {
      return saleProvider.sales;
    }
    return saleProvider.getSalesByStatus(_selectedStatus!);
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filtros'),
        content: const Text('Filtros avançados em breve...'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Fechar'),
          ),
        ],
      ),
    );
  }

  void _showSaleDetails(Sale sale) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _SaleDetailsSheet(sale: sale),
    );
  }
}

class _SaleDetailsSheet extends StatelessWidget {
  final Sale sale;

  const _SaleDetailsSheet({required this.sale});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.7,
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.textHint,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSaleHeader(),
                  const SizedBox(height: 20),
                  _buildCustomerInfo(),
                  const SizedBox(height: 20),
                  _buildSaleInfo(),
                  if (sale.notes != null) ...[
                    const SizedBox(height: 20),
                    _buildNotes(),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSaleHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Sale #${sale.id}',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            _buildStatusBadge(),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'Created on ${sale.formattedCreatedAt}',
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusBadge() {
    Color color;
    String text = sale.statusText;

    switch (sale.status) {
      case SaleStatus.draft:
        color = AppColors.textHint;
        break;
      case SaleStatus.pending:
        color = AppColors.warning;
        break;
      case SaleStatus.confirmed:
        color = AppColors.info;
        break;
      case SaleStatus.processing:
        color = AppColors.accent;
        break;
      case SaleStatus.shipped:
        color = AppColors.secondary;
        break;
      case SaleStatus.delivered:
        color = AppColors.success;
        break;
      case SaleStatus.cancelled:
      case SaleStatus.refunded:
        color = AppColors.error;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Widget _buildCustomerInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Cliente',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            sale.customerDisplayName,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSaleInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Sale Information',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          _buildInfoRow('Seller:', sale.sellerName),
          const SizedBox(height: 8),
          _buildInfoRow('Quantity of items:', '${sale.itemCount}'),
          const SizedBox(height: 8),
          _buildInfoRow('Subtotal:', sale.formattedSubtotal),
          if (sale.discount > 0) ...[
            const SizedBox(height: 8),
            _buildInfoRow('Discount:', sale.formattedDiscount),
          ],
          if (sale.tax > 0) ...[
            const SizedBox(height: 8),
            _buildInfoRow('Tax:', sale.formattedTax),
          ],
          const SizedBox(height: 12),
          const Divider(),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Total:',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                sale.formattedTotal,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildNotes() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Observações',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            sale.notes!,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
} 