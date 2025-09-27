import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';

export default function Layout() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
        <Container fluid>
          <Navbar.Brand href="/app/dashboard" className="fw-bold text-dark">
            <i className="fas fa-store me-2"></i>
            LPA Admin
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/app/dashboard" className="d-flex align-items-center">
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/app/products" className="d-flex align-items-center">
                <i className="fas fa-boxes me-2"></i>
                Products
              </Nav.Link>
              <Nav.Link as={NavLink} to="/app/sales" className="d-flex align-items-center">
                <i className="fas fa-shopping-cart me-2"></i>
                Sales
              </Nav.Link>
              <Nav.Link as={NavLink} to="/app/orders" className="d-flex align-items-center">
                <i className="fas fa-receipt me-2"></i>
                Orders
              </Nav.Link>
              <Nav.Link as={NavLink} to="/app/reports" className="d-flex align-items-center">
                <i className="fas fa-chart-bar me-2"></i>
                Reports
              </Nav.Link>
              <Nav.Link as={NavLink} to="/app/users" className="d-flex align-items-center">
                <i className="fas fa-users me-2"></i>
                Users
              </Nav.Link>
            </Nav>
            
            <Nav>
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  <i className="fas fa-user me-2"></i>
                  {user?.first_name || 'User'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/app/profile">
                    <i className="fas fa-user-circle me-2"></i>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={NavLink} to="/app/settings">
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={NavLink} to="/app/help">
                    <i className="fas fa-question-circle me-2"></i>
                    Help
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <Container>
          <div className="row align-items-center">
            <div className="col-md-6">
              <small>&copy; 2024 LPA Sales Inventory System. All rights reserved.</small>
            </div>
            <div className="col-md-6 text-md-end">
              <small>
                <i className="fas fa-server me-1"></i>
                Sales and Inventory Management System
              </small>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}