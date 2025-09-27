import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Form, InputGroup, Dropdown } from 'react-bootstrap';
import api from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      if (response.success && response.data.status === 'success') {
        setOrders(response.data.data);
      } else {
        setError('Error loading orders');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await api.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading orders...</p>
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
              <h1 className="h2 mb-0">Order Management</h1>
              <p className="text-muted">Track and manage customer orders</p>
            </div>
            <Button variant="primary">
              <i className="fas fa-plus me-2"></i>
              New Order
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

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-receipt fa-2x text-primary me-3"></i>
                <div>
                  <h3 className="mb-0">{totalOrders}</h3>
                  <small className="text-muted">Total Orders</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-clock fa-2x text-warning me-3"></i>
                <div>
                  <h3 className="mb-0">{pendingOrders}</h3>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-dollar-sign fa-2x text-success me-3"></i>
                <div>
                  <h3 className="mb-0">${totalRevenue.toFixed(2)}</h3>
                  <small className="text-muted">Total Value</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-truck fa-2x text-info me-3"></i>
                <div>
                  <h3 className="mb-0">{orders.filter(o => o.status === 'shipped').length}</h3>
                  <small className="text-muted">Shipped</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search orders by customer or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-md-end">
          <Button variant="outline-secondary" onClick={fetchOrders}>
            <i className="fas fa-sync me-2"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Orders Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No orders found</h5>
                  <p className="text-muted">Try adjusting your filters or create a new order</p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>
                          <div>
                            <h6 className="mb-0">{order.customer_name || 'N/A'}</h6>
                            <small className="text-muted">{order.customer_email}</small>
                          </div>
                        </td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString('en-US')}
                        </td>
                        <td>
                          <strong>${order.total_amount}</strong>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td>
                          <small>{order.payment_method || 'N/A'}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
                                <i className="fas fa-cog"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'processing')}>
                                  Mark as Processing
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'shipped')}>
                                  Mark as Shipped
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                                  Mark as Delivered
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="text-danger">
                                  Cancel Order
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
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
    </Container>
  );
}
