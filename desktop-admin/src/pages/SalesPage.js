import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Form, InputGroup } from 'react-bootstrap';
import api from '../services/api';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await api.getSales();
      if (response.success && response.data.status === 'success') {
        setSales(response.data.data);
      } else {
        setError('Error loading sales');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
  const completedSales = sales.filter(sale => sale.status === 'completed').length;

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading sales...</p>
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
              <h1 className="h2 mb-0">Sales Management</h1>
              <p className="text-muted">Track and manage all sales transactions</p>
            </div>
            <Button variant="primary">
              <i className="fas fa-plus me-2"></i>
              New Sale
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
                <i className="fas fa-shopping-cart fa-2x text-primary me-3"></i>
                <div>
                  <h3 className="mb-0">{sales.length}</h3>
                  <small className="text-muted">Total Sales</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-check-circle fa-2x text-success me-3"></i>
                <div>
                  <h3 className="mb-0">{completedSales}</h3>
                  <small className="text-muted">Completed</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-dollar-sign fa-2x text-info me-3"></i>
                <div>
                  <h3 className="mb-0">${totalRevenue.toFixed(2)}</h3>
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
                <i className="fas fa-clock fa-2x text-warning me-3"></i>
                <div>
                  <h3 className="mb-0">{sales.filter(s => s.status === 'pending').length}</h3>
                  <small className="text-muted">Pending</small>
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
              placeholder="Search sales by customer or ID..."
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
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-md-end">
          <Button variant="outline-secondary" onClick={fetchSales}>
            <i className="fas fa-sync me-2"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Sales Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {filteredSales.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No sales found</h5>
                  <p className="text-muted">Try adjusting your filters or create a new sale</p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sale ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map(sale => (
                      <tr key={sale.id}>
                        <td>
                          <strong>#{sale.id}</strong>
                        </td>
                        <td>
                          <div>
                            <h6 className="mb-0">{sale.customer_name || 'N/A'}</h6>
                            <small className="text-muted">{sale.customer_email}</small>
                          </div>
                        </td>
                        <td>
                          {new Date(sale.createdAt).toLocaleDateString('en-US')}
                        </td>
                        <td>
                          <strong>${sale.total}</strong>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(sale.status)}>
                            {sale.status}
                          </Badge>
                        </td>
                        <td>
                          <small>{sale.payment_method || 'N/A'}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="outline-primary" size="sm">
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button variant="outline-danger" size="sm">
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
    </Container>
  );
}