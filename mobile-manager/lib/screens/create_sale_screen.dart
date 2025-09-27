import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../providers/sale_provider.dart';
import '../providers/product_provider.dart';
import '../providers/auth_provider.dart';
import '../models/customer.dart';
import '../models/product.dart';
import '../constants/app_colors.dart';
import '../utils/formatters.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_text_field.dart';

class CreateSaleScreen extends StatefulWidget {
  const CreateSaleScreen({super.key});

  @override
  State<CreateSaleScreen> createState() => _CreateSaleScreenState();
}

class _CreateSaleScreenState extends State<CreateSaleScreen> {
  int _currentStep = 0;
  final _notesController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadInitialData();
    });
  }

  void _loadInitialData() {
    final saleProvider = Provider.of<SaleProvider>(context, listen: false);
    saleProvider.loadCustomers();
  }

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (!authProvider.canCreateSales()) {
          return _buildNoPermissionScreen();
        }

        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text('New Sale'),
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textOnPrimary,
          ),
          body: Consumer<SaleProvider>(
            builder: (context, saleProvider, child) {
              return Column(
                children: [
                  _buildProgressIndicator(),
                  Expanded(child: _buildStepContent(saleProvider)),
                  _buildBottomBar(saleProvider),
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
        title: const Text('New Sale'),
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
              'You do not have permission to create sales',
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

  Widget _buildProgressIndicator() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: AppColors.surface,
      child: Row(
        children: [
          _buildStepCircle(1, 'Customer', _currentStep >= 1),
          _buildStepLine(_currentStep >= 2),
          _buildStepCircle(2, 'Products', _currentStep >= 2),
          _buildStepLine(_currentStep >= 3),
          _buildStepCircle(3, 'Finalize', _currentStep >= 3),
        ],
      ),
    );
  }

  Widget _buildStepCircle(int step, String label, bool isActive) {
    return Column(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: isActive ? AppColors.primary : AppColors.border,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: isActive
                ? const Icon(
                    Icons.check,
                    color: AppColors.textOnPrimary,
                    size: 18,
                  )
                : Text(
                    '${step + 1}',
                    style: TextStyle(
                      color: isActive ? AppColors.textOnPrimary : AppColors.textHint,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isActive ? AppColors.primary : AppColors.textHint,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  Widget _buildStepLine(bool isActive) {
    return Container(
      width: 2,
      margin: const EdgeInsets.only(bottom: 16),
      color: isActive ? AppColors.primary : AppColors.border,
    );
  }

  Widget _buildStepContent(SaleProvider saleProvider) {
    switch (_currentStep) {
      case 0:
        return _buildCustomerStep(saleProvider);
      case 1:
        return _buildProductsStep(saleProvider);
      case 2:
        return _buildFinalizationStep(saleProvider);
      default:
        return _buildCustomerStep(saleProvider);
    }
  }

  Widget _buildCustomerStep(SaleProvider saleProvider) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Select Customer',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          if (saleProvider.selectedCustomer != null)
            _buildSelectedCustomer(saleProvider.selectedCustomer!)
          else
            _buildCustomerSelection(saleProvider),
        ],
      ),
    );
  }

  Widget _buildSelectedCustomer(Customer customer) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: AppColors.primary,
              child: Text(
                customer.initials,
                style: const TextStyle(
                  color: AppColors.textOnPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    customer.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  if (customer.email != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      customer.email!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                  if (customer.phone != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      customer.formattedPhone,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                Provider.of<SaleProvider>(context, listen: false).clearCustomer();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerSelection(SaleProvider saleProvider) {
    return Consumer<SaleProvider>(
      builder: (context, saleProvider, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
          children: [
              const Text(
                'Select Customer',
              style: TextStyle(
                fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              if (saleProvider.customers.isEmpty)
                const Center(
                  child: Text(
                    'Loading customers...',
                    style: TextStyle(color: AppColors.textSecondary),
            ),
                )
              else
                ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: saleProvider.customers.length,
      itemBuilder: (context, index) {
        final customer = saleProvider.customers[index];
                    return _buildCustomerCard(customer, saleProvider);
                  },
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCustomerCard(Customer customer, SaleProvider saleProvider) {
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.primary,
              child: Text(
                customer.initials,
                style: const TextStyle(
                  color: AppColors.textOnPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(
              customer.name,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            subtitle: Text(
              customer.summary,
              style: const TextStyle(
                color: AppColors.textSecondary,
              ),
            ),
            onTap: () {
              saleProvider.selectCustomer(customer);
            },
          ),
    );
  }

  Widget _buildProductsStep(SaleProvider saleProvider) {
    return Column(
      children: [
        _buildCartSummary(saleProvider),
        Expanded(child: _buildProductSelection()),
      ],
    );
  }

  Widget _buildCartSummary(SaleProvider saleProvider) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Cart',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              Text(
                Formatters.formatCurrency(saleProvider.cartTotal),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '${saleProvider.cartItemCount} ${saleProvider.cartItemCount == 1 ? 'item' : 'itens'}',
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductSelection() {
    return Consumer<ProductProvider>(
      builder: (context, productProvider, child) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select Products',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 16),
              if (productProvider.products.isEmpty)
                const Center(
                  child: Text(
                    'Loading products...',
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                )
              else
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: productProvider.products.length,
                  itemBuilder: (context, index) {
                    final product = productProvider.products[index];
                    return _buildProductCard(product);
                  },
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildProductCard(Product product) {
    return Consumer<SaleProvider>(
      builder: (context, saleProvider, child) {
        final cartItem = saleProvider.getCartItem(product.id);
        final isInCart = cartItem != null;
        
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                _buildProductImage(product),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'SKU: ${product.sku}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        product.formattedPrice,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Stock: ${product.stockQuantity}',
                        style: TextStyle(
                          fontSize: 12,
                          color: product.isOutOfStock 
                              ? AppColors.error 
                              : AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                if (isInCart)
                  _buildQuantityControls(product, cartItem)
                else
                  CustomButton(
                    text: 'Add',
                    onPressed: product.isOutOfStock 
                        ? null 
                        : () => _addToCart(product),
                    type: ButtonType.primary,
                    height: 36,
                    isExpanded: true,
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildProductImage(Product product) {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.border),
      ),
      child: product.primaryImageUrl != null
          ? ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                product.primaryImageUrl!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(
                    Icons.image_not_supported,
                    color: AppColors.textHint,
                  );
                },
              ),
            )
          : const Icon(
              Icons.inventory_2,
              color: AppColors.textHint,
            ),
    );
  }

  Widget _buildQuantityControls(Product product, dynamic cartItem) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: const Icon(Icons.remove_circle_outline),
          onPressed: () => _decreaseQuantity(product),
          iconSize: 20,
        ),
        Container(
          width: 40,
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Text(
            cartItem.quantity.toString(),
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.add_circle_outline),
          onPressed: () => _increaseQuantity(product),
          iconSize: 20,
        ),
      ],
    );
  }

  Widget _buildFinalizationStep(SaleProvider saleProvider) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildOrderSummary(saleProvider),
          const SizedBox(height: 24),
          _buildNotesField(),
          const SizedBox(height: 24),
          _buildFinalizeButton(saleProvider),
        ],
      ),
    );
  }

  Widget _buildOrderSummary(SaleProvider saleProvider) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Order Summary',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 16),
            ...saleProvider.cartItems.map((item) => _buildOrderItem(item)),
            const Divider(),
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
                  Formatters.formatCurrency(saleProvider.cartTotal),
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
    );
  }

  Widget _buildOrderItem(dynamic item) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              '${item.quantity}x ${item.productName}',
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textPrimary,
              ),
            ),
          ),
          Text(
            Formatters.formatCurrency(item.total),
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesField() {
    return CustomTextField(
      label: 'Notes (optional)',
      hint: 'Enter notes about the sale...',
      controller: _notesController,
      maxLines: 3,
    );
  }

  Widget _buildFinalizeButton(SaleProvider saleProvider) {
    return CustomButton(
      text: 'Finalize Sale',
      onPressed: () => _finalizeSale(saleProvider),
      isLoading: saleProvider.isLoading,
      isExpanded: true,
      type: ButtonType.primary,
    );
  }

  Widget _buildBottomBar(SaleProvider saleProvider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.border),
        ),
      ),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: CustomButton(
                text: 'Back',
                onPressed: _previousStep,
                type: ButtonType.outline,
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: 16),
          Expanded(
            child: CustomButton(
              text: _getNextButtonText(),
              onPressed: _canProceed(saleProvider) ? () => _nextStep(saleProvider) : null,
              type: ButtonType.primary,
            ),
          ),
        ],
      ),
    );
  }

  String _getNextButtonText() {
    switch (_currentStep) {
      case 0:
        return 'Next';
      case 1:
        return 'Review';
      case 2:
        return 'Finalize';
      default:
        return 'Next';
    }
  }

  bool _canProceed(SaleProvider saleProvider) {
    switch (_currentStep) {
      case 0:
        return saleProvider.selectedCustomer != null;
      case 1:
        return saleProvider.cartItems.isNotEmpty;
      case 2:
        return true;
      default:
        return false;
    }
  }

  void _nextStep(SaleProvider saleProvider) {
    if (_currentStep < 2) {
      setState(() {
        _currentStep++;
      });
      
      // Load products when entering step 1
      if (_currentStep == 1) {
        final productProvider = Provider.of<ProductProvider>(context, listen: false);
        productProvider.loadProducts(refresh: true);
      }
    } else {
      _finalizeSale(saleProvider);
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
      });
    }
  }

  void _addToCart(Product product) {
    final saleProvider = Provider.of<SaleProvider>(context, listen: false);
    saleProvider.addToCart(product);
  }

  void _increaseQuantity(Product product) {
    final saleProvider = Provider.of<SaleProvider>(context, listen: false);
    final currentQuantity = saleProvider.getCartItemQuantity(product.id);
    if (currentQuantity < product.stockQuantity) {
      saleProvider.updateCartItemQuantity(product.id, currentQuantity + 1);
    }
  }

  void _decreaseQuantity(Product product) {
    final saleProvider = Provider.of<SaleProvider>(context, listen: false);
    final currentQuantity = saleProvider.getCartItemQuantity(product.id);
    if (currentQuantity > 1) {
      saleProvider.updateCartItemQuantity(product.id, currentQuantity - 1);
    } else {
      saleProvider.removeFromCart(product.id);
    }
  }

  Future<void> _finalizeSale(SaleProvider saleProvider) async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final user = authProvider.user!;
      
      final baseSale = saleProvider.createSaleFromCart(user.id, user.name);
      final sale = baseSale.copyWith(
        notes: _notesController.text.isNotEmpty ? _notesController.text : null,
      );
      
      // Here you would typically call an API to create the sale
      // For now, we'll just add it to the local list
      saleProvider.addSaleToList(sale);
      saleProvider.clearCart();
      
      Fluttertoast.showToast(
        msg: 'Sale created successfully!',
        backgroundColor: AppColors.success,
        textColor: AppColors.textOnPrimary,
      );
      
      Navigator.of(context).pop();
    } catch (e) {
      Fluttertoast.showToast(
        msg: 'Error creating sale',
        backgroundColor: AppColors.error,
        textColor: AppColors.textOnPrimary,
      );
    }
  }
} 