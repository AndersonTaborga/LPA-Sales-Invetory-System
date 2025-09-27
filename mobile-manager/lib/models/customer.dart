import '../utils/formatters.dart';

enum CustomerType {
  individual,
  company,
}

class Customer {
  final String id;
  final String name;
  final String? email;
  final String? phone;
  final String? document; // CPF or CNPJ
  final CustomerType type;
  final String? address;
  final String? city;
  final String? state;
  final String? zipCode;
  final String? country;
  final String? notes;
  final bool isActive;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final DateTime? lastPurchase;
  final double? totalPurchases;
  final int? purchaseCount;
  final String? contactPerson; // For companies
  final String? website;
  final Map<String, dynamic>? customFields;

  Customer({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.document,
    this.type = CustomerType.individual,
    this.address,
    this.city,
    this.state,
    this.zipCode,
    this.country = 'Brasil',
    this.notes,
    this.isActive = true,
    this.createdAt,
    this.updatedAt,
    this.lastPurchase,
    this.totalPurchases,
    this.purchaseCount,
    this.contactPerson,
    this.website,
    this.customFields,
  });

  // Factory constructor from JSON
  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      email: json['email'],
      phone: json['phone'],
      document: json['document'],
      type: json['type'] == 'company' 
          ? CustomerType.company 
          : CustomerType.individual,
      address: json['address'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zip_code'],
      country: json['country'] ?? 'Brasil',
      notes: json['notes'],
      isActive: json['is_active'] ?? true,
      createdAt: json['created_at'] != null 
          ? DateTime.tryParse(json['created_at']) 
          : null,
      updatedAt: json['updated_at'] != null 
          ? DateTime.tryParse(json['updated_at']) 
          : null,
      lastPurchase: json['last_purchase'] != null 
          ? DateTime.tryParse(json['last_purchase']) 
          : null,
      totalPurchases: json['total_purchases']?.toDouble(),
      purchaseCount: json['purchase_count'],
      contactPerson: json['contact_person'],
      website: json['website'],
      customFields: json['custom_fields'],
    );
  }

  // Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'document': document,
      'type': type == CustomerType.company ? 'company' : 'individual',
      'address': address,
      'city': city,
      'state': state,
      'zip_code': zipCode,
      'country': country,
      'notes': notes,
      'is_active': isActive,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'last_purchase': lastPurchase?.toIso8601String(),
      'total_purchases': totalPurchases,
      'purchase_count': purchaseCount,
      'contact_person': contactPerson,
      'website': website,
      'custom_fields': customFields,
    };
  }

  // Formatted getters
  String get formattedPhone {
    return phone != null ? Formatters.formatPhone(phone!) : 'N/A';
  }

  String get formattedDocument {
    if (document == null) return 'N/A';
    
    if (type == CustomerType.company) {
      return Formatters.formatCNPJ(document!);
    } else {
      return Formatters.formatCPF(document!);
    }
  }

  String get formattedTotalPurchases {
    return totalPurchases != null 
        ? Formatters.formatCurrency(totalPurchases!) 
        : 'R\$ 0,00';
  }

  String get formattedLastPurchase {
    return lastPurchase != null 
        ? Formatters.formatDate(lastPurchase!) 
        : 'Nunca';
  }

  // Get full address
  String get fullAddress {
    List<String> addressParts = [];
    
    if (address != null && address!.isNotEmpty) {
      addressParts.add(address!);
    }
    if (city != null && city!.isNotEmpty) {
      addressParts.add(city!);
    }
    if (state != null && state!.isNotEmpty) {
      addressParts.add(state!);
    }
    if (zipCode != null && zipCode!.isNotEmpty) {
      addressParts.add(zipCode!);
    }
    
    return addressParts.join(', ');
  }

  // Get display name
  String get displayName {
    if (type == CustomerType.company && contactPerson != null) {
      return '$name ($contactPerson)';
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
    return 'C';
  }

  // Customer status checks
  bool get isCompany => type == CustomerType.company;
  bool get isIndividual => type == CustomerType.individual;
  bool get hasEmail => email != null && email!.isNotEmpty;
  bool get hasPhone => phone != null && phone!.isNotEmpty;
  bool get hasDocument => document != null && document!.isNotEmpty;
  bool get hasAddress => address != null && address!.isNotEmpty;
  bool get hasPurchaseHistory => purchaseCount != null && purchaseCount! > 0;

  // Customer value classification
  String get customerValue {
    if (totalPurchases == null || totalPurchases! <= 0) {
      return 'Novo';
    } else if (totalPurchases! < 1000) {
      return 'Bronze';
    } else if (totalPurchases! < 5000) {
      return 'Prata';
    } else if (totalPurchases! < 10000) {
      return 'Ouro';
    } else {
      return 'Diamante';
    }
  }

  // Check if customer is recent
  bool get isRecentCustomer {
    if (createdAt == null) return false;
    final now = DateTime.now();
    final difference = now.difference(createdAt!);
    return difference.inDays <= 30;
  }

  // Check if customer is active (recent purchase)
  bool get isActiveCustomer {
    if (lastPurchase == null) return false;
    final now = DateTime.now();
    final difference = now.difference(lastPurchase!);
    return difference.inDays <= 90;
  }

  // Get customer summary
  String get summary {
    List<String> summaryParts = [];
    
    if (isCompany) {
      summaryParts.add('Empresa');
    } else {
      summaryParts.add('Pessoa Física');
    }
    
    if (hasPurchaseHistory) {
      summaryParts.add('$purchaseCount compras');
    }
    
    summaryParts.add(customerValue);
    
    return summaryParts.join(' • ');
  }

  // Copy with method for updating customer data
  Customer copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? document,
    CustomerType? type,
    String? address,
    String? city,
    String? state,
    String? zipCode,
    String? country,
    String? notes,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? lastPurchase,
    double? totalPurchases,
    int? purchaseCount,
    String? contactPerson,
    String? website,
    Map<String, dynamic>? customFields,
  }) {
    return Customer(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      document: document ?? this.document,
      type: type ?? this.type,
      address: address ?? this.address,
      city: city ?? this.city,
      state: state ?? this.state,
      zipCode: zipCode ?? this.zipCode,
      country: country ?? this.country,
      notes: notes ?? this.notes,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      lastPurchase: lastPurchase ?? this.lastPurchase,
      totalPurchases: totalPurchases ?? this.totalPurchases,
      purchaseCount: purchaseCount ?? this.purchaseCount,
      contactPerson: contactPerson ?? this.contactPerson,
      website: website ?? this.website,
      customFields: customFields ?? this.customFields,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Customer && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'Customer(id: $id, name: $name, type: $type, email: $email)';
  }
} 