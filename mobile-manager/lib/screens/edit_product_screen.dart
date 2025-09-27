import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

import '../constants/app_colors.dart';
import '../providers/product_provider.dart';
import '../models/product.dart';
import '../utils/validators.dart';
import '../widgets/custom_button.dart';
import '../widgets/custom_text_field.dart';

class EditProductScreen extends StatefulWidget {
  final Product product;

  const EditProductScreen({
    super.key,
    required this.product,
  });

  @override
  State<EditProductScreen> createState() => _EditProductScreenState();
}

class _EditProductScreenState extends State<EditProductScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _priceController;
  late final TextEditingController _skuController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _stockController;
  late final TextEditingController _minStockController;

  File? _selectedImage;
  final ImagePicker _picker = ImagePicker();
  bool _isLoading = false;

  // Predefined categories
  final List<String> _categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Food & Beverages',
    'Health & Beauty',
    'Automotive',
    'Toys',
    'Other'
  ];

  late String _selectedCategory;
  late bool _isActive;

  @override
  void initState() {
    super.initState();
    
    // Initialize controllers with current product data
    _nameController = TextEditingController(text: widget.product.name);
    _priceController = TextEditingController(text: widget.product.price.toString());
    _skuController = TextEditingController(text: widget.product.sku);
    _descriptionController = TextEditingController(text: widget.product.description ?? '');
    _stockController = TextEditingController(text: widget.product.stockQuantity.toString());
    _minStockController = TextEditingController(text: widget.product.minStockLevel?.toString() ?? '');
    
    _selectedCategory = widget.product.category;
    _isActive = widget.product.isActive;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _skuController.dispose();
    _descriptionController.dispose();
    _stockController.dispose();
    _minStockController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      _showErrorSnackBar('Error selecting image: $e');
    }
  }

  Future<void> _takePhoto() async {
    try {
      final XFile? image = await _picker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
      }
    } catch (e) {
      _showErrorSnackBar('Error taking photo: $e');
    }
  }

  void _showImageSourceDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            
            // Header
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Update Product Image',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Options
            ListTile(
              leading: const Icon(Icons.photo_library, color: AppColors.primary),
              title: const Text('Gallery'),
              onTap: () {
                Navigator.pop(context);
                _pickImage();
              },
            ),
            
            ListTile(
              leading: const Icon(Icons.camera_alt, color: AppColors.primary),
              title: const Text('Camera'),
              onTap: () {
                Navigator.pop(context);
                _takePhoto();
              },
            ),
            
            ListTile(
              leading: const Icon(Icons.delete, color: AppColors.error),
              title: const Text('Remove Image'),
              onTap: () {
                Navigator.pop(context);
                setState(() {
                  _selectedImage = null;
                });
              },
            ),
            
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.error,
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.success,
      ),
    );
  }

  void _showDeleteConfirmation() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Product'),
        content: Text('Are you sure you want to delete "${widget.product.name}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteProduct();
            },
            style: TextButton.styleFrom(foregroundColor: AppColors.error),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  Future<void> _deleteProduct() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final productProvider = Provider.of<ProductProvider>(context, listen: false);
      
      // TODO: Implement actual delete in ProductProvider and ProductService
      _showSuccessSnackBar('Product deleted successfully!');
      
      // Navigate back
      if (mounted) {
        Navigator.pop(context, 'deleted');
      }
      
    } catch (e) {
      _showErrorSnackBar('Error deleting product: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final productProvider = Provider.of<ProductProvider>(context, listen: false);
      
      // Create updated product
      final updatedProduct = widget.product.copyWith(
        name: _nameController.text.trim(),
        price: double.parse(_priceController.text.trim()),
        sku: _skuController.text.trim(),
        description: _descriptionController.text.trim().isEmpty 
            ? null 
            : _descriptionController.text.trim(),
        stockQuantity: int.parse(_stockController.text.trim()),
        minStockLevel: _minStockController.text.trim().isEmpty 
            ? null 
            : int.parse(_minStockController.text.trim()),
        category: _selectedCategory,
        imageUrl: _selectedImage?.path ?? widget.product.imageUrl,
        isActive: _isActive,
        updatedAt: DateTime.now(),
      );

      // TODO: Implement actual update in ProductProvider and ProductService
      _showSuccessSnackBar('Product updated successfully!');
      
      // Navigate back
      if (mounted) {
        Navigator.pop(context, updatedProduct);
      }
      
    } catch (e) {
      _showErrorSnackBar('Error updating product: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Widget _buildCurrentImage() {
    if (_selectedImage != null) {
      return Image.file(
        _selectedImage!,
        width: double.infinity,
        height: 200,
        fit: BoxFit.cover,
      );
    } else if (widget.product.imageUrl != null) {
      return Image.network(
        widget.product.imageUrl!,
        width: double.infinity,
        height: 200,
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return Container(
            height: 200,
            color: AppColors.primary.withValues(alpha: 0.1),
            child: const Icon(
              Icons.inventory_2,
              size: 48,
              color: AppColors.primary,
            ),
          );
        },
      );
    } else {
      return Container(
        height: 200,
        color: AppColors.primary.withValues(alpha: 0.1),
        child: const Icon(
          Icons.inventory_2,
          size: 48,
          color: AppColors.primary,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Edit Product'),
        backgroundColor: AppColors.primary,
        foregroundColor: AppColors.textOnPrimary,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: _isLoading ? null : _showDeleteConfirmation,
            tooltip: 'Delete Product',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Image Section
              Container(
                height: 200,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border),
                ),
                child: Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: _buildCurrentImage(),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: _showImageSourceDialog,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.surface.withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Icon(
                            Icons.edit,
                            color: AppColors.primary,
                            size: 20,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Product Name
              CustomTextField(
                controller: _nameController,
                label: 'Product Name *',
                hint: 'Enter product name',
                validator: Validators.validateName,
                enabled: !_isLoading,
              ),

              const SizedBox(height: 16),

              // SKU
              CustomTextField(
                controller: _skuController,
                label: 'SKU *',
                hint: 'Enter product SKU',
                validator: Validators.validateSKU,
                enabled: !_isLoading,
              ),

              const SizedBox(height: 16),

              // Category
              DropdownButtonFormField<String>(
                value: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Category *',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                ),
                items: _categories.map((category) {
                  return DropdownMenuItem(
                    value: category,
                    child: Text(category),
                  );
                }).toList(),
                onChanged: _isLoading ? null : (value) {
                  setState(() {
                    _selectedCategory = value!;
                  });
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please select a category';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 16),

              // Price
              CustomTextField(
                controller: _priceController,
                label: 'Price *',
                hint: 'Enter product price',
                type: TextFieldType.currency,
                validator: Validators.validatePrice,
                enabled: !_isLoading,
                prefixIcon: const Icon(Icons.attach_money),
              ),

              const SizedBox(height: 16),

              // Stock Quantity
              Row(
                children: [
                  Expanded(
                    child: CustomTextField(
                      controller: _stockController,
                      label: 'Stock Quantity *',
                      hint: 'Current stock',
                      type: TextFieldType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Stock quantity is required';
                        }
                        final stock = int.tryParse(value);
                        if (stock == null || stock < 0) {
                          return 'Enter valid stock quantity';
                        }
                        return null;
                      },
                      enabled: !_isLoading,
                      prefixIcon: const Icon(Icons.inventory),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: CustomTextField(
                      controller: _minStockController,
                      label: 'Min Stock Level',
                      hint: 'Minimum stock',
                      type: TextFieldType.number,
                      validator: (value) {
                        if (value != null && value.isNotEmpty) {
                          final minStock = int.tryParse(value);
                          if (minStock == null || minStock < 0) {
                            return 'Enter valid minimum stock';
                          }
                        }
                        return null;
                      },
                      enabled: !_isLoading,
                      prefixIcon: const Icon(Icons.warning_outlined),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Description
              CustomTextField(
                controller: _descriptionController,
                label: 'Description',
                hint: 'Enter product description (optional)',
                maxLines: 4,
                enabled: !_isLoading,
              ),

              const SizedBox(height: 16),

              // Active Status
              SwitchListTile(
                title: const Text('Product Active'),
                subtitle: const Text('Enable/disable product for sales'),
                value: _isActive,
                onChanged: _isLoading ? null : (value) {
                  setState(() {
                    _isActive = value;
                  });
                },
                activeColor: AppColors.primary,
              ),

              const SizedBox(height: 32),

              // Save Button
              CustomButton(
                text: 'Update Product',
                onPressed: _isLoading ? null : _saveProduct,
                isLoading: _isLoading,
                type: ButtonType.primary,
              ),

              const SizedBox(height: 16),

              // Cancel Button
              CustomButton(
                text: 'Cancel',
                onPressed: _isLoading ? null : () => Navigator.pop(context),
                type: ButtonType.secondary,
              ),
            ],
          ),
        ),
      ),
    );
  }
} 