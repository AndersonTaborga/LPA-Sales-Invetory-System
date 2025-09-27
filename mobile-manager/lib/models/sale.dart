import '../utils/formatters.dart';
import 'customer.dart';
import 'user.dart';
import 'product.dart';

enum SaleStatus {
  draft,
  pending,
  confirmed,
  processing,
  shipped,
  delivered,
  cancelled,
  refunded,
}

class SaleItem {
  final String id;
  final String productId;
  final String productName;
  final String productSku;
  final double unitPrice;
  final int quantity;
  final double discount;
  final double? tax;
  final String? notes;
  final Product? product; // Optional product reference

  SaleItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productSku,
    required this.unitPrice,
    required this.quantity,
    this.discount = 0.0,
    this.tax,
    this.notes,
    this.product,
  });

  factory SaleItem.fromJson(Map<String, dynamic> json) {
    return SaleItem(
      id: json['id']?.toString() ?? '',
      productId: json['product_id']?.toString() ?? '',
      productName: json['product_name'] ?? '',
      productSku: json['product_sku'] ?? '',
      unitPrice: (json['unit_price'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 0,
      discount: (json['discount'] ?? 0).toDouble(),
      tax: json['tax']?.toDouble(),
      notes: json['notes'],
      product: json['product'] != null ? Product.fromJson(json['product']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product_id': productId,
      'product_name': productName,
      'product_sku': productSku,
      'unit_price': unitPrice,
      'quantity': quantity,
      'discount': discount,
      'tax': tax,
      'notes': notes,
      'product': product?.toJson(),
    };
  }

  // Calculated properties
  double get subtotal => unitPrice * quantity;
  double get discountAmount => subtotal * (discount / 100);
  double get taxAmount => tax != null ? subtotal * (tax! / 100) : 0.0;
  double get total => subtotal - discountAmount + taxAmount;

  // Formatted getters
  String get formattedUnitPrice => Formatters.formatCurrency(unitPrice);
  String get formattedSubtotal => Formatters.formatCurrency(subtotal);
  String get formattedDiscount => Formatters.formatPercentage(discount);
  String get formattedDiscountAmount => Formatters.formatCurrency(discountAmount);
  String get formattedTax => tax != null ? Formatters.formatPercentage(tax!) : 'N/A';
  String get formattedTaxAmount => Formatters.formatCurrency(taxAmount);
  String get formattedTotal => Formatters.formatCurrency(total);

  SaleItem copyWith({
    String? id,
    String? productId,
    String? productName,
    String? productSku,
    double? unitPrice,
    int? quantity,
    double? discount,
    double? tax,
    String? notes,
    Product? product,
  }) {
    return SaleItem(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      productSku: productSku ?? this.productSku,
      unitPrice: unitPrice ?? this.unitPrice,
      quantity: quantity ?? this.quantity,
      discount: discount ?? this.discount,
      tax: tax ?? this.tax,
      notes: notes ?? this.notes,
      product: product ?? this.product,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is SaleItem && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}

class Sale {
  final String id;
  final String? customerId;
  final String? customerName;
  final String sellerId;
  final String sellerName;
  final List<SaleItem> items;
  final SaleStatus status;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final DateTime? confirmedAt;
  final DateTime? deliveredAt;
  final double subtotal;
  final double discount;
  final double tax;
  final double total;
  final String? notes;
  final String? paymentMethod;
  final String? paymentStatus;
  final String? shippingAddress;
  final double? shippingCost;
  final String? trackingNumber;
  final Customer? customer; // Optional customer reference
  final User? seller; // Optional seller reference
  final Map<String, dynamic>? metadata;

  Sale({
    required this.id,
    this.customerId,
    this.customerName,
    required this.sellerId,
    required this.sellerName,
    required this.items,
    required this.status,
    required this.createdAt,
    this.updatedAt,
    this.confirmedAt,
    this.deliveredAt,
    required this.subtotal,
    this.discount = 0.0,
    this.tax = 0.0,
    required this.total,
    this.notes,
    this.paymentMethod,
    this.paymentStatus,
    this.shippingAddress,
    this.shippingCost,
    this.trackingNumber,
    this.customer,
    this.seller,
    this.metadata,
  });

  factory Sale.fromJson(Map<String, dynamic> json) {
    return Sale(
      id: json['id']?.toString() ?? '',
      customerId: json['customer_id']?.toString(),
      customerName: json['customer_name'],
      sellerId: json['seller_id']?.toString() ?? '',
      sellerName: json['seller_name'] ?? '',
      items: (json['items'] as List<dynamic>?)
          ?.map((item) => SaleItem.fromJson(item))
          .toList() ?? [],
      status: _parseStatus(json['status']),
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      updatedAt: json['updated_at'] != null 
          ? DateTime.tryParse(json['updated_at']) 
          : null,
      confirmedAt: json['confirmed_at'] != null 
          ? DateTime.tryParse(json['confirmed_at']) 
          : null,
      deliveredAt: json['delivered_at'] != null 
          ? DateTime.tryParse(json['delivered_at']) 
          : null,
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      discount: (json['discount'] ?? 0).toDouble(),
      tax: (json['tax'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
      notes: json['notes'],
      paymentMethod: json['payment_method'],
      paymentStatus: json['payment_status'],
      shippingAddress: json['shipping_address'],
      shippingCost: json['shipping_cost']?.toDouble(),
      trackingNumber: json['tracking_number'],
      customer: json['customer'] != null ? Customer.fromJson(json['customer']) : null,
      seller: json['seller'] != null ? User.fromJson(json['seller']) : null,
      metadata: json['metadata'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer_id': customerId,
      'customer_name': customerName,
      'seller_id': sellerId,
      'seller_name': sellerName,
      'items': items.map((item) => item.toJson()).toList(),
      'status': status.toString().split('.').last,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'confirmed_at': confirmedAt?.toIso8601String(),
      'delivered_at': deliveredAt?.toIso8601String(),
      'subtotal': subtotal,
      'discount': discount,
      'tax': tax,
      'total': total,
      'notes': notes,
      'payment_method': paymentMethod,
      'payment_status': paymentStatus,
      'shipping_address': shippingAddress,
      'shipping_cost': shippingCost,
      'tracking_number': trackingNumber,
      'customer': customer?.toJson(),
      'seller': seller?.toJson(),
      'metadata': metadata,
    };
  }

  static SaleStatus _parseStatus(String? status) {
    switch (status?.toLowerCase()) {
      case 'draft':
        return SaleStatus.draft;
      case 'pending':
        return SaleStatus.pending;
      case 'confirmed':
        return SaleStatus.confirmed;
      case 'processing':
        return SaleStatus.processing;
      case 'shipped':
        return SaleStatus.shipped;
      case 'delivered':
        return SaleStatus.delivered;
      case 'cancelled':
        return SaleStatus.cancelled;
      case 'refunded':
        return SaleStatus.refunded;
      default:
        return SaleStatus.draft;
    }
  }

  // Status getters
  bool get isDraft => status == SaleStatus.draft;
  bool get isPending => status == SaleStatus.pending;
  bool get isConfirmed => status == SaleStatus.confirmed;
  bool get isProcessing => status == SaleStatus.processing;
  bool get isShipped => status == SaleStatus.shipped;
  bool get isDelivered => status == SaleStatus.delivered;
  bool get isCancelled => status == SaleStatus.cancelled;
  bool get isRefunded => status == SaleStatus.refunded;
  bool get isCompleted => isDelivered;
  bool get isActive => !isCancelled && !isRefunded;

  // Formatted getters
  String get formattedSubtotal => Formatters.formatCurrency(subtotal);
  String get formattedDiscount => Formatters.formatCurrency(discount);
  String get formattedTax => Formatters.formatCurrency(tax);
  String get formattedTotal => Formatters.formatCurrency(total);
  String get formattedShippingCost => shippingCost != null 
      ? Formatters.formatCurrency(shippingCost!) 
      : 'N/A';
  String get formattedCreatedAt => Formatters.formatDateTime(createdAt);
  String get formattedUpdatedAt => updatedAt != null 
      ? Formatters.formatDateTime(updatedAt!) 
      : 'N/A';
  String get formattedConfirmedAt => confirmedAt != null 
      ? Formatters.formatDateTime(confirmedAt!) 
      : 'N/A';
  String get formattedDeliveredAt => deliveredAt != null 
      ? Formatters.formatDateTime(deliveredAt!) 
      : 'N/A';

  // Status text
  String get statusText {
    switch (status) {
      case SaleStatus.draft:
        return 'Rascunho';
      case SaleStatus.pending:
        return 'Pendente';
      case SaleStatus.confirmed:
        return 'Confirmada';
      case SaleStatus.processing:
        return 'Processando';
      case SaleStatus.shipped:
        return 'Enviada';
      case SaleStatus.delivered:
        return 'Entregue';
      case SaleStatus.cancelled:
        return 'Cancelada';
      case SaleStatus.refunded:
        return 'Reembolsada';
    }
  }

  // Calculate totals from items
  double get calculatedSubtotal {
    return items.fold(0.0, (sum, item) => sum + item.subtotal);
  }

  double get calculatedDiscountAmount {
    return items.fold(0.0, (sum, item) => sum + item.discountAmount);
  }

  double get calculatedTaxAmount {
    return items.fold(0.0, (sum, item) => sum + item.taxAmount);
  }

  double get calculatedTotal {
    return calculatedSubtotal - calculatedDiscountAmount + calculatedTaxAmount + (shippingCost ?? 0.0);
  }

  // Item count
  int get itemCount => items.length;
  int get totalQuantity => items.fold(0, (sum, item) => sum + item.quantity);

  // Get sale summary
  String get summary {
    return '$itemCount ${itemCount == 1 ? 'item' : 'itens'} • $formattedTotal';
  }

  // Check if sale can be edited
  bool get canEdit => isDraft || isPending;
  bool get canCancel => !isCancelled && !isRefunded && !isDelivered;
  bool get canConfirm => isPending;
  bool get canShip => isConfirmed || isProcessing;
  bool get canDeliver => isShipped;

  // Get customer display name
  String get customerDisplayName {
    if (customer != null) return customer!.displayName;
    return customerName ?? 'Cliente não informado';
  }

  Sale copyWith({
    String? id,
    String? customerId,
    String? customerName,
    String? sellerId,
    String? sellerName,
    List<SaleItem>? items,
    SaleStatus? status,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? confirmedAt,
    DateTime? deliveredAt,
    double? subtotal,
    double? discount,
    double? tax,
    double? total,
    String? notes,
    String? paymentMethod,
    String? paymentStatus,
    String? shippingAddress,
    double? shippingCost,
    String? trackingNumber,
    Customer? customer,
    User? seller,
    Map<String, dynamic>? metadata,
  }) {
    return Sale(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      sellerId: sellerId ?? this.sellerId,
      sellerName: sellerName ?? this.sellerName,
      items: items ?? this.items,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      confirmedAt: confirmedAt ?? this.confirmedAt,
      deliveredAt: deliveredAt ?? this.deliveredAt,
      subtotal: subtotal ?? this.subtotal,
      discount: discount ?? this.discount,
      tax: tax ?? this.tax,
      total: total ?? this.total,
      notes: notes ?? this.notes,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      shippingAddress: shippingAddress ?? this.shippingAddress,
      shippingCost: shippingCost ?? this.shippingCost,
      trackingNumber: trackingNumber ?? this.trackingNumber,
      customer: customer ?? this.customer,
      seller: seller ?? this.seller,
      metadata: metadata ?? this.metadata,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Sale && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Sale(id: $id, customer: $customerDisplayName, total: $formattedTotal, status: $statusText)';
  }
} 