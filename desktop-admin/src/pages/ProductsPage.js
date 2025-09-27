import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import api from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts();
      if (response.success && response.data.status === 'success') {
        setProducts(response.data.data);
      } else {
        setError('Error loading products');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStockBadgeVariant = (stock) => {
    if (stock <= 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  };

  const getStockText = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await api.deleteProduct(productId);
        if (response.success) {
          setProducts(products.filter(p => p.id !== productId));
        }
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading products...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-0">Inventory Management</h1>
              <p className="text-muted">Manage your product inventory and stock levels</p>
            </div>
            <Button variant="primary" onClick={handleAddProduct}>
              <i className="fas fa-plus me-2"></i>
              Add Product
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-md-end">
          <Badge bg="info" className="me-2">
            Total: {products.length}
          </Badge>
          <Badge bg="warning" className="me-2">
            Low Stock: {products.filter(p => p.stock <= 10).length}
          </Badge>
          <Badge bg="danger">
            Out of Stock: {products.filter(p => p.stock === 0).length}
          </Badge>
        </Col>
      </Row>

      {/* Products Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-boxes fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No products found</h5>
                  <p className="text-muted">Try adjusting your search or add new products</p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="rounded"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div
                                  className="bg-light rounded d-flex align-items-center justify-content-center"
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <i className="fas fa-box text-muted"></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <h6 className="mb-0">{product.name}</h6>
                              <small className="text-muted">{product.description}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <code>{product.sku}</code>
                        </td>
                        <td>{product.category_name || 'N/A'}</td>
                        <td>
                          <strong>${product.price}</strong>
                        </td>
                        <td>
                          <span className="fw-bold">{product.stock}</span>
                        </td>
                        <td>
                          <Badge bg={getStockBadgeVariant(product.stock)}>
                            {getStockText(product.stock)}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Product Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={editingProduct?.name || ''}
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={editingProduct?.sku || ''}
                    placeholder="Enter SKU"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.price || ''}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    defaultValue={editingProduct?.stock || ''}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                defaultValue={editingProduct?.description || ''}
                placeholder="Enter product description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                defaultValue={editingProduct?.image_url || ''}
                placeholder="https://example.com/image.jpg"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}