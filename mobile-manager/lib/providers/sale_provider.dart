import 'package:flutter/foundation.dart';
import '../models/sale.dart';
import '../models/customer.dart';
import '../models/product.dart';

class SaleProvider extends ChangeNotifier {
  // Current sale being created/edited
  List<SaleItem> _cartItems = [];
  Customer? _selectedCustomer;
  String? _notes;
  double _discount = 0.0;
  double _tax = 0.0;
  double _shippingCost = 0.0;
  
  // Customer list
  List<Customer> _customers = [];
  
  // Sales list
  List<Sale> _sales = [];
  bool _isLoading = false;
  final bool _isLoadingMore = false;
  String? _errorMessage;
  
  // Pagination
  final int _currentPage = 1;
  final int _totalPages = 1;
  final int _totalCount = 0;
  final bool _hasNextPage = false;
  final bool _hasPreviousPage = false;

  // Getters for cart
  List<SaleItem> get cartItems => _cartItems;
  Customer? get selectedCustomer => _selectedCustomer;
  String? get notes => _notes;
  double get discount => _discount;
  double get tax => _tax;
  double get shippingCost => _shippingCost;
  
  // Getters for customers
  List<Customer> get customers => _customers;
  
  // Getters for sales list
  List<Sale> get sales => _sales;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get errorMessage => _errorMessage;
  
  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  int get totalCount => _totalCount;
  bool get hasNextPage => _hasNextPage;
  bool get hasPreviousPage => _hasPreviousPage;

  // Cart calculations
  double get cartSubtotal {
    return _cartItems.fold(0.0, (sum, item) => sum + item.subtotal);
  }

  double get cartDiscountAmount {
    return cartSubtotal * (_discount / 100);
  }

  double get cartTaxAmount {
    return cartSubtotal * (_tax / 100);
  }

  double get cartTotal {
    return cartSubtotal - cartDiscountAmount + cartTaxAmount + _shippingCost;
  }

  int get cartItemCount => _cartItems.length;
  
  int get cartTotalQuantity {
    return _cartItems.fold(0, (sum, item) => sum + item.quantity);
  }

  bool get isCartEmpty => _cartItems.isEmpty;
  bool get hasCustomer => _selectedCustomer != null;

  // Cart management
  void addToCart(Product product, {int quantity = 1, double? customPrice}) {
    final existingIndex = _cartItems.indexWhere((item) => item.productId == product.id);
    
    if (existingIndex != -1) {
      // Update existing item
      final existingItem = _cartItems[existingIndex];
      _cartItems[existingIndex] = existingItem.copyWith(
        quantity: existingItem.quantity + quantity,
      );
    } else {
      // Add new item
      final saleItem = SaleItem(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        unitPrice: customPrice ?? product.price,
        quantity: quantity,
        product: product,
      );
      _cartItems.add(saleItem);
    }
    
    notifyListeners();
  }

  void removeFromCart(String productId) {
    _cartItems.removeWhere((item) => item.productId == productId);
    notifyListeners();
  }

  void updateCartItemQuantity(String productId, int quantity) {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    final index = _cartItems.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      _cartItems[index] = _cartItems[index].copyWith(quantity: quantity);
      notifyListeners();
    }
  }

  void updateCartItemPrice(String productId, double price) {
    final index = _cartItems.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      _cartItems[index] = _cartItems[index].copyWith(unitPrice: price);
      notifyListeners();
    }
  }

  void updateCartItemDiscount(String productId, double discount) {
    final index = _cartItems.indexWhere((item) => item.productId == productId);
    if (index != -1) {
      _cartItems[index] = _cartItems[index].copyWith(discount: discount);
      notifyListeners();
    }
  }

  void clearCart() {
    _cartItems.clear();
    _selectedCustomer = null;
    _notes = null;
    _discount = 0.0;
    _tax = 0.0;
    _shippingCost = 0.0;
    notifyListeners();
  }

  // Customer selection
  void selectCustomer(Customer customer) {
    _selectedCustomer = customer;
    notifyListeners();
  }

  void clearCustomer() {
    _selectedCustomer = null;
    notifyListeners();
  }

  // Sale details
  void setNotes(String? notes) {
    _notes = notes;
    notifyListeners();
  }

  void setDiscount(double discount) {
    _discount = discount.clamp(0.0, 100.0);
    notifyListeners();
  }

  void setTax(double tax) {
    _tax = tax.clamp(0.0, 100.0);
    notifyListeners();
  }

  void setShippingCost(double cost) {
    _shippingCost = cost.clamp(0.0, double.infinity);
    notifyListeners();
  }

  // Check if product is in cart
  bool isProductInCart(String productId) {
    return _cartItems.any((item) => item.productId == productId);
  }

  // Get cart item by product ID
  SaleItem? getCartItem(String productId) {
    try {
      return _cartItems.firstWhere((item) => item.productId == productId);
    } catch (e) {
      return null;
    }
  }

  // Get cart item quantity
  int getCartItemQuantity(String productId) {
    final item = getCartItem(productId);
    return item?.quantity ?? 0;
  }

  // Validate cart for checkout
  bool validateCart() {
    if (_cartItems.isEmpty) return false;
    if (_selectedCustomer == null) return false;
    
    // Check if all items have valid quantities and prices
    for (final item in _cartItems) {
      if (item.quantity <= 0 || item.unitPrice <= 0) return false;
      
      // Check stock availability if product is available
      if (item.product != null && !item.product!.canSell(item.quantity)) {
        return false;
      }
    }
    
    return true;
  }

  // Get validation errors
  List<String> getValidationErrors() {
    final errors = <String>[];
    
    if (_cartItems.isEmpty) {
      errors.add('No items in cart');
    }
    
    if (_selectedCustomer == null) {
      errors.add('Customer not selected');
    }
    
    for (final item in _cartItems) {
      if (item.quantity <= 0) {
        errors.add('Invalid quantity for ${item.productName}');
      }
      
      if (item.unitPrice <= 0) {
        errors.add('${item.productName}: Preço inválido');
      }
      
      if (item.product != null && !item.product!.canSell(item.quantity)) {
        errors.add('${item.productName}: Estoque insuficiente');
      }
    }
    
    return errors;
  }

  // Create sale from cart
  Sale createSaleFromCart(String sellerId, String sellerName) {
    return Sale(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      customerId: _selectedCustomer?.id,
      customerName: _selectedCustomer?.name,
      sellerId: sellerId,
      sellerName: sellerName,
      items: List.from(_cartItems),
      status: SaleStatus.draft,
      createdAt: DateTime.now(),
      subtotal: cartSubtotal,
      discount: cartDiscountAmount,
      tax: cartTaxAmount,
      total: cartTotal,
      notes: _notes,
      shippingCost: _shippingCost > 0 ? _shippingCost : null,
      customer: _selectedCustomer,
    );
  }

  // Load cart from sale (for editing)
  void loadCartFromSale(Sale sale) {
    _cartItems = List.from(sale.items);
    _selectedCustomer = sale.customer;
    _notes = sale.notes;
    _discount = (sale.discount / sale.subtotal) * 100; // Convert to percentage
    _tax = (sale.tax / sale.subtotal) * 100; // Convert to percentage
    _shippingCost = sale.shippingCost ?? 0.0;
    notifyListeners();
  }

  // Sales list management
  void addSaleToList(Sale sale) {
    _sales.insert(0, sale);
    notifyListeners();
  }

  void updateSaleInList(Sale updatedSale) {
    final index = _sales.indexWhere((s) => s.id == updatedSale.id);
    if (index != -1) {
      _sales[index] = updatedSale;
      notifyListeners();
    }
  }

  void removeSaleFromList(String saleId) {
    _sales.removeWhere((s) => s.id == saleId);
    notifyListeners();
  }

  // Get sales by status
  List<Sale> getSalesByStatus(SaleStatus status) {
    return _sales.where((s) => s.status == status).toList();
  }

  // Get recent sales
  List<Sale> getRecentSales({int limit = 10}) {
    final sortedSales = List<Sale>.from(_sales);
    sortedSales.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return sortedSales.take(limit).toList();
  }

  // Calculate total sales value
  double getTotalSalesValue() {
    return _sales.fold(0.0, (sum, sale) => sum + sale.total);
  }

  // Calculate sales count by status
  Map<SaleStatus, int> getSalesCountByStatus() {
    final counts = <SaleStatus, int>{};
    for (final status in SaleStatus.values) {
      counts[status] = _sales.where((s) => s.status == status).length;
    }
    return counts;
  }

  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Clear error message
  void clearError() {
    _clearError();
  }

  // Load customers
  Future<void> loadCustomers({String? search}) async {
    try {
      // Mock customers for demonstration
      final mockCustomers = [
        Customer(
          id: '1',
          name: 'John Silva',
          email: 'john.silva@email.com',
          phone: '+1234567890',
          address: '123 Main Street, Downtown',
          city: 'New York',
          state: 'NY',
        ),
        Customer(
          id: '2',
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '+1234567891',
          address: '456 Oak Avenue, Midtown',
          city: 'Los Angeles',
          state: 'CA',
        ),
        Customer(
          id: '3',
          name: 'Peter Costa',
          email: 'peter.costa@email.com',
          phone: '+1234567892',
          address: '789 Pine Road, Uptown',
          city: 'Chicago',
          state: 'IL',
        ),
        Customer(
          id: '4',
          name: 'ABC Company',
          email: 'contact@abccompany.com',
          phone: '+1234567893',
          address: '321 Business Blvd, Corporate Center',
          city: 'Houston',
          state: 'TX',
        ),
      ];
      
      _customers = mockCustomers;
      notifyListeners();
    } catch (e) {
      _setError('Error loading customers: $e');
    }
  }

  // Load sales
  Future<void> loadSales({String? search}) async {
    try {
      _setLoading(true);
      _clearError();
      
      // Mock sales for demonstration
      final mockSales = [
        Sale(
          id: '1',
          customerId: '1',
          customerName: 'John Silva',
          sellerId: 'user1',
          sellerName: 'Demo Seller',
          items: [
            SaleItem(
              id: '1',
              productId: '1',
              productName: 'Product A',
              productSku: 'SKU001',
              unitPrice: 50.0,
              quantity: 2,
            ),
          ],
          status: SaleStatus.confirmed,
          createdAt: DateTime.now().subtract(const Duration(hours: 2)),
          subtotal: 100.0,
          discount: 0.0,
          tax: 0.0,
          total: 100.0,
          notes: 'Completed sale - payment received',
        ),
        Sale(
          id: '2',
          customerId: '2',
          customerName: 'Maria Santos',
          sellerId: 'user1',
          sellerName: 'Demo Seller',
          items: [
            SaleItem(
              id: '2',
              productId: '2',
              productName: 'Product B',
              productSku: 'SKU002',
              unitPrice: 75.0,
              quantity: 1,
            ),
          ],
          status: SaleStatus.pending,
          createdAt: DateTime.now().subtract(const Duration(hours: 1)),
          subtotal: 75.0,
          discount: 0.0,
          tax: 0.0,
          total: 75.0,
          notes: 'Pending payment confirmation',
        ),
      ];
      
      _sales = mockSales;
      notifyListeners();
    } catch (e) {
      _setError('Error loading sales: $e');
    }
  }
} 