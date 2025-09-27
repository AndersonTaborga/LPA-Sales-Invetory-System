import '../constants/app_constants.dart';
import '../utils/formatters.dart';

enum StockStatus {
  outOfStock,
  critical,
  low,
  normal,
}

class Product {
  final String id;
  final String name;
  final String sku;
  final double price;
  final String category;
  final String? categoryId;
  final int stockQuantity;
  final int? minStockLevel;
  final int? maxStockLevel;
  final String? description;
  final String? imageUrl;
  final List<String>? imageUrls;
  final String? unit;
  final double? weight;
  final String? barcode;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final Map<String, dynamic>? attributes;
  final double? cost;
  final double? margin;

  Product({
    required this.id,
    required this.name,
    required this.sku,
    required this.price,
    required this.category,
    this.categoryId,
    required this.stockQuantity,
    this.minStockLevel,
    this.maxStockLevel,
    this.description,
    this.imageUrl,
    this.imageUrls,
    this.unit = 'un',
    this.weight,
    this.barcode,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
    this.attributes,
    this.cost,
    this.margin,
  });

  // Factory constructor from JSON
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      sku: json['sku'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      category: json['category_name'] ?? json['category'] ?? '',
      categoryId: json['category_id']?.toString(),
      stockQuantity: json['stock'] ?? json['stock_quantity'] ?? 0,
      minStockLevel: json['min_stock_level'],
      maxStockLevel: json['max_stock_level'],
      description: json['description'],
      imageUrl: json['image_url'],
      imageUrls: json['image_urls'] != null 
          ? List<String>.from(json['image_urls']) 
          : null,
      unit: json['unit'] ?? 'un',
      weight: json['weight']?.toDouble(),
      barcode: json['barcode'],
      isActive: json['is_active'] ?? true,
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt']) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.tryParse(json['updatedAt']) 
          : null,
      attributes: json['attributes'],
      cost: json['cost']?.toDouble(),
      margin: json['margin']?.toDouble(),
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'sku': sku,
      'price': price,
      'category_name': category,
      'category_id': categoryId,
      'stock': stockQuantity,
      'min_stock_level': minStockLevel,
      'max_stock_level': maxStockLevel,
      'description': description,
      'image_url': imageUrl,
      'image_urls': imageUrls,
      'unit': unit,
      'weight': weight,
      'barcode': barcode,
      'is_active': isActive,
      'createdAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'attributes': attributes,
      'cost': cost,
      'margin': margin,
    };
  }

  // Stock status methods
  StockStatus get stockStatus {
    if (stockQuantity <= 0) {
      return StockStatus.outOfStock;
    } else if (stockQuantity <= AppConstants.criticalStockThreshold) {
      return StockStatus.critical;
    } else if (stockQuantity <= AppConstants.lowStockThreshold) {
      return StockStatus.low;
    } else {
      return StockStatus.normal;
    }
  }

  String get stockStatusText {
    return Formatters.formatStockStatus(stockQuantity);
  }

  bool get isOutOfStock => stockQuantity <= 0;
  bool get isLowStock => stockQuantity <= AppConstants.lowStockThreshold && stockQuantity > 0;
  bool get isCriticalStock => stockQuantity <= AppConstants.criticalStockThreshold && stockQuantity > 0;
  bool get isInStock => stockQuantity > AppConstants.lowStockThreshold;

  // Formatted getters
  String get formattedPrice => Formatters.formatCurrency(price);
  String get formattedCost => cost != null ? Formatters.formatCurrency(cost!) : 'N/A';
  String get formattedMargin => margin != null ? Formatters.formatPercentage(margin!) : 'N/A';
  String get formattedWeight => weight != null ? '${Formatters.formatNumber(weight!)} kg' : 'N/A';
  String get formattedStock => Formatters.formatQuantity(stockQuantity.toDouble(), unit ?? 'un');

  // Calculate profit margin
  double? get profitMargin {
    if (cost != null && cost! > 0) {
      return ((price - cost!) / cost!) * 100;
    }
    return null;
  }

  String get formattedProfitMargin {
    final margin = profitMargin;
    return margin != null ? Formatters.formatPercentage(margin) : 'N/A';
  }

  // Check if product has images
  bool get hasImages => imageUrl != null || (imageUrls != null && imageUrls!.isNotEmpty);

  // Get all image URLs
  List<String> get allImageUrls {
    List<String> urls = [];
    if (imageUrl != null) urls.add(imageUrl!);
    if (imageUrls != null) urls.addAll(imageUrls!);
    return urls;
  }

  // Get primary image URL
  String? get primaryImageUrl {
    if (imageUrl != null) return imageUrl;
    if (imageUrls != null && imageUrls!.isNotEmpty) return imageUrls!.first;
    return null;
  }

  // Check if product needs restocking
  bool get needsRestocking {
    if (minStockLevel != null) {
      return stockQuantity <= minStockLevel!;
    }
    return isLowStock || isCriticalStock;
  }

  // Calculate stock percentage (if max stock level is defined)
  double? get stockPercentage {
    if (maxStockLevel != null && maxStockLevel! > 0) {
      return (stockQuantity / maxStockLevel!) * 100;
    }
    return null;
  }

  // Check if product can be sold
  bool canSell(int quantity) {
    return isActive && stockQuantity >= quantity;
  }

  // Get stock level description
  String get stockLevelDescription {
    if (isOutOfStock) return 'Produto sem estoque';
    if (isCriticalStock) return 'Estoque crítico - reposição urgente';
    if (isLowStock) return 'Estoque baixo - considere repor';
    return 'Estoque adequado';
  }

  // Copy with method for updating product data
  Product copyWith({
    String? id,
    String? name,
    String? sku,
    double? price,
    String? category,
    String? categoryId,
    int? stockQuantity,
    int? minStockLevel,
    int? maxStockLevel,
    String? description,
    String? imageUrl,
    List<String>? imageUrls,
    String? unit,
    double? weight,
    String? barcode,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    Map<String, dynamic>? attributes,
    double? cost,
    double? margin,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      sku: sku ?? this.sku,
      price: price ?? this.price,
      category: category ?? this.category,
      categoryId: categoryId ?? this.categoryId,
      stockQuantity: stockQuantity ?? this.stockQuantity,
      minStockLevel: minStockLevel ?? this.minStockLevel,
      maxStockLevel: maxStockLevel ?? this.maxStockLevel,
      description: description ?? this.description,
      imageUrl: imageUrl ?? this.imageUrl,
      imageUrls: imageUrls ?? this.imageUrls,
      unit: unit ?? this.unit,
      weight: weight ?? this.weight,
      barcode: barcode ?? this.barcode,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      attributes: attributes ?? this.attributes,
      cost: cost ?? this.cost,
      margin: margin ?? this.margin,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Product && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Product(id: $id, name: $name, sku: $sku, price: $price, stock: $stockQuantity)';
  }
} 