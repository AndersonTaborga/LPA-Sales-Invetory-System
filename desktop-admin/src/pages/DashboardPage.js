import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalOrders: 0,
    lowStockProducts: 0,
    totalRevenue: 0
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const productsResponse = await api.getProducts();
      if (productsResponse.success && productsResponse.data.status === 'success') {
        const products = productsResponse.data.data;
        const lowStock = products.filter(p => p.stock <= 10);
        setLowStockProducts(lowStock);
        
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
          lowStockProducts: lowStock.length
        }));
      }

      // Load orders
      const ordersResponse = await api.getOrders();
      if (ordersResponse.success && ordersResponse.data.status === 'success') {
        const orders = ordersResponse.data.data;
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
        
        setStats(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue: totalRevenue
        }));
        
        // Orders are now handled separately from sales
      }

      // Load sales
      const salesResponse = await api.getSales();
      if (salesResponse.success && salesResponse.data.status === 'success') {
        const sales = salesResponse.data.data;
        setStats(prev => ({
          ...prev,
          totalSales: sales.length
        }));
        
        // Set recent sales (most recent 5)
        setRecentSales(sales.slice(0, 5));
      }

    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStockBadgeVariant = (stock) => {
    if (stock === 0) return 'danger';
    if (stock <= 10) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1 className="h2 mb-0">LPA Dashboard</h1>
          <p className="text-muted">Overview of sales and inventory system</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-boxes fa-2x text-primary me-3"></i>
                <div>
                  <h3 className="mb-0">{stats.totalProducts}</h3>
                  <small className="text-muted">Products</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-shopping-cart fa-2x text-success me-3"></i>
                <div>
                  <h3 className="mb-0">{stats.totalOrders}</h3>
                  <small className="text-muted">Orders</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-chart-line fa-2x text-info me-3"></i>
                <div>
                  <h3 className="mb-0">{formatCurrency(stats.totalRevenue)}</h3>
                  <small className="text-muted">Total Revenue</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-exclamation-triangle fa-2x text-warning me-3"></i>
                <div>
                  <h3 className="mb-0">{stats.lowStockProducts}</h3>
                  <small className="text-muted">Low Stock</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row>
        {/* Recent Sales */}
        <Col lg={8} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Sales</h5>
                <Button variant="outline-primary" size="sm">
                  View All
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {recentSales.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSales.map(sale => (
                      <tr key={sale.id}>
                        <td>#{sale.id}</td>
                        <td>{sale.customer_name || 'N/A'}</td>
                        <td>{formatCurrency(sale.total)}</td>
                        <td>
                          <Badge bg={
                            sale.status === 'pending' ? 'warning' :
                            sale.status === 'completed' ? 'success' :
                            sale.status === 'cancelled' ? 'danger' : 'secondary'
                          }>
                            {sale.status}
                          </Badge>
                        </td>
                        <td>{new Date(sale.createdAt).toLocaleDateString('en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No sales found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Low Stock Alert */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Stock Alert</h5>
            </Card.Header>
            <Card.Body>
              {lowStockProducts.length > 0 ? (
                <div>
                  <Alert variant="warning" className="mb-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {lowStockProducts.length} product(s) with low stock
                  </Alert>
                  <div className="list-group list-group-flush">
                    {lowStockProducts.slice(0, 5).map(product => (
                      <div key={product.id} className="list-group-item px-0 border-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{product.name}</h6>
                            <small className="text-muted">SKU: {product.sku}</small>
                          </div>
                          <Badge bg={getStockBadgeVariant(product.stock)}>
                            {product.stock} units
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  {lowStockProducts.length > 5 && (
                    <Button variant="outline-warning" size="sm" className="mt-3 w-100">
                      View All ({lowStockProducts.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                  <p className="text-muted">All products have adequate stock</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <Button variant="primary" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <i className="fas fa-plus fa-2x mb-2"></i>
                    <span>Add Product</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="success" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                    <span>New Sale</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="info" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <i className="fas fa-chart-bar fa-2x mb-2"></i>
                    <span>Reports</span>
                  </Button>
                </Col>
                <Col md={3} className="mb-3">
                  <Button variant="warning" className="w-100 h-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <i className="fas fa-users fa-2x mb-2"></i>
                    <span>Manage Users</span>
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}