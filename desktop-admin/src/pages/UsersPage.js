import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Table, Form, InputGroup, Modal } from 'react-bootstrap';
import api from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Note: This would need a getUsers endpoint in the API
      // For now, we'll create mock data
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@lpa.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: 2,
          username: 'sales1',
          email: 'sales@lpa.com',
          first_name: 'Sales',
          last_name: 'Manager',
          role: 'employee',
          is_active: true,
          created_at: '2024-01-15'
        },
        {
          id: 3,
          username: 'customer1',
          email: 'customer@lpa.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'customer',
          is_active: true,
          created_at: '2024-02-01'
        }
      ];
      setUsers(mockUsers);
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'employee': return 'primary';
      case 'customer': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (isActive) => {
    return isActive ? 'success' : 'danger';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, is_active: !user.is_active } : user
    ));
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading users...</p>
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
              <h1 className="h2 mb-0">User Management</h1>
              <p className="text-muted">Manage system users and permissions</p>
            </div>
            <Button variant="primary" onClick={handleAddUser}>
              <i className="fas fa-user-plus me-2"></i>
              Add User
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
                <i className="fas fa-users fa-2x text-primary me-3"></i>
                <div>
                  <h3 className="mb-0">{users.length}</h3>
                  <small className="text-muted">Total Users</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-user-shield fa-2x text-danger me-3"></i>
                <div>
                  <h3 className="mb-0">{users.filter(u => u.role === 'admin').length}</h3>
                  <small className="text-muted">Administrators</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-user-tie fa-2x text-info me-3"></i>
                <div>
                  <h3 className="mb-0">{users.filter(u => u.role === 'employee').length}</h3>
                  <small className="text-muted">Employees</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="fas fa-user fa-2x text-success me-3"></i>
                <div>
                  <h3 className="mb-0">{users.filter(u => u.role === 'customer').length}</h3>
                  <small className="text-muted">Customers</small>
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
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators</option>
            <option value="employee">Employees</option>
            <option value="customer">Customers</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-md-end">
          <Button variant="outline-secondary" onClick={fetchUsers}>
            <i className="fas fa-sync me-2"></i>
            Refresh
          </Button>
        </Col>
      </Row>

      {/* Users Table */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No users found</h5>
                  <p className="text-muted">Try adjusting your filters or add new users</p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <div
                                className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white"
                                style={{ width: '40px', height: '40px' }}
                              >
                                <i className="fas fa-user"></i>
                              </div>
                            </div>
                            <div>
                              <h6 className="mb-0">{user.first_name} {user.last_name}</h6>
                              <small className="text-muted">@{user.username}</small>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(user.is_active)}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          {new Date(user.created_at).toLocaleDateString('en-US')}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant={user.is_active ? "outline-warning" : "outline-success"}
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              <i className={`fas fa-${user.is_active ? 'ban' : 'check'}`}></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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

      {/* Add/Edit User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Edit User' : 'Add New User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={editingUser?.first_name || ''}
                    placeholder="Enter first name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={editingUser?.last_name || ''}
                    placeholder="Enter last name"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={editingUser?.username || ''}
                    placeholder="Enter username"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={editingUser?.email || ''}
                    placeholder="Enter email"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select defaultValue={editingUser?.role || 'customer'}>
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select defaultValue={editingUser?.is_active ? 'active' : 'inactive'}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary">
            {editingUser ? 'Update User' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}