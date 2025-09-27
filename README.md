# LPA Sales Inventory System

Complete sales and inventory management system for Logic Peripherals Australia (LPA), featuring a centralized architecture based on Node.js API.

## Overview

The LPA system consists of four main applications that share a centralized API:

- **Backend**: Node.js/Express API with SQLite
- **Desktop Admin**: React interface for administrators
- **Mobile Manager**: Flutter application for sales staff
- **Web E-commerce**: PHP online store for customers

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Desktop Admin │    │  Mobile Manager │    │  Web E-commerce │
│     (React)     │    │    (Flutter)    │    │      (PHP)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Backend API          │
                    │   (Node.js/Express)       │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     Database (SQLite)     │
                    └───────────────────────────┘
```

## Project Structure

```
LPA Sales Inventory System/
├── backend/           # Node.js/Express API + SQLite
├── desktop-admin/     # React for administrators
├── mobile-manager/    # Flutter for mobile management
├── web-ecommerce/     # PHP for customers
├── docs/              # Documentation
└── README.md          # This file
```

## Prerequisites

- Node.js (v16 or higher)
- Flutter (v3.0 or higher)
- PHP (v8.0 or higher)
- Git

## Installation and Execution

### 1. Backend (Required - First)

```bash
cd backend
npm install
npm run seed
npm start
```

Backend will be available at: http://localhost:5000

### 2. Desktop Admin (React)

```bash
cd desktop-admin
npm install
npm start
```

Application available at: http://localhost:3000

### 3. Web E-commerce (PHP)

```bash
cd web-ecommerce
"C:/xampp/php/php.exe" -S localhost:8000
```

Store available at: http://localhost:8000

### 4. Mobile Manager (Flutter)

```bash
cd mobile-manager
flutter clean
flutter pub get
flutter run -d chrome
```

## Test Credentials

### Administrator
- Email: admin@lpa.com
- Password: 123456

### Sales Staff
- Email: vendedor1@lpa.com
- Password: 123456

### Customer
- Email: cliente1@lpa.com
- Password: 123456

## Features by Application

### Backend (API)
- JWT Authentication
- Product CRUD operations
- Sales CRUD operations
- User management
- Reports generation
- Category management
- Order management

### Desktop Admin (React)
- Administrative dashboard
- Product management
- User management
- Advanced reports
- Responsive interface

### Web E-commerce (PHP)
- Product catalog
- Shopping cart
- Checkout process
- Login/registration
- Responsive interface

### Mobile Manager (Flutter)
- Stock consultation
- Sales registration
- Mobile interface
- Real-time synchronization

## API Endpoints

### Authentication
- POST /api/users/login
- POST /api/users/register

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- PATCH /api/products/:id/stock
- GET /api/products/low-stock

### Categories
- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

### Sales
- GET /api/sales
- GET /api/sales/:id
- POST /api/sales
- PUT /api/sales/:id
- DELETE /api/sales/:id

### Orders
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PATCH /api/orders/:id/status
- DELETE /api/orders/:id

### Reports
- GET /api/reports/dashboard
- GET /api/reports/sales
- GET /api/reports/top-products
- GET /api/reports/customers
- GET /api/reports/stock

## Data Models

### User
- id, username, email, password
- first_name, last_name, role
- phone, address, is_active
- timestamps

### Product
- id, name, description, price
- stock, image_url, category_name
- sku, is_active
- timestamps

### Category
- id, name, description
- timestamps

### Sales
- id, user_id, total, status
- customer_name, customer_email
- customer_phone, payment_method
- notes, timestamps

### SaleItem
- id, sale_id, product_id
- quantity, price
- timestamps

### Order
- id, user_id, total_amount
- status, shipping_address
- payment_method, notes
- timestamps

### OrderItem
- id, order_id, product_id
- quantity, price
- timestamps

## Technologies Used

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite
- JWT
- bcryptjs

### Desktop Admin
- React
- Bootstrap
- Axios
- Context API

### Mobile Manager
- Flutter
- Provider
- HTTP
- Shared Preferences

### Web E-commerce
- PHP
- Bootstrap
- cURL
- Sessions

## Configuration

### Backend
File: `backend/.env`
```
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Desktop Admin
File: `desktop-admin/src/services/api.js`
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Mobile Manager
File: `mobile-manager/lib/constants/app_constants.dart`
```dart
static const String baseUrl = 'http://localhost:5000';
```

### Web E-commerce
File: `web-ecommerce/includes/config.php`
```php
define('API_BASE_URL', 'http://localhost:5000');
```

## Development

### Branch Structure
- main: Production code
- develop: Development code
- feature/*: New features
- hotfix/*: Urgent fixes

### Code Standards
- JavaScript: ESLint + Prettier
- PHP: PSR-12
- Dart: Dart Analysis
- Commits: Conventional Commits

### Testing
```bash
# Backend
cd backend
npm test

# Desktop Admin
cd desktop-admin
npm test

# Mobile Manager
cd mobile-manager
flutter test
```

## Deployment

### Development
1. Start backend
2. Start frontend applications
3. Access via localhost

### Production
1. Deploy backend to server
2. Build frontend applications
3. Configure production URLs
4. Configure SSL
5. Configure monitoring

## Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run seed
npm start
```

### Desktop Admin won't start
```bash
cd desktop-admin
npm install
npm start
```

### Mobile Manager won't compile
```bash
cd mobile-manager
flutter clean
flutter pub get
flutter run -d chrome
```

### Web E-commerce won't load
```bash
cd web-ecommerce/public
php -S localhost:8000
```

### Windows symlink error
```bash
cd mobile-manager
flutter clean
flutter pub get
flutter run -d chrome
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For technical support:
- Email: info@lpa.com.au
- Phone: +61 2 1234 5678
- Address: Sydney, Australia

## Version History

- v1.0.0: Initial version
- v2.0.0: Refactoring to centralized architecture
- v2.1.0: Removal of local dependencies
- v2.2.0: Unified documentation

## Roadmap

### Upcoming Versions
- v3.0.0: Notification system
- v3.1.0: Advanced reports
- v3.2.0: Payment integration
- v4.0.0: Native mobile version

## Configuration Files

### package.json (Backend)
```json
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seedDatabase.js",
    "sync-db": "node syncDatabase.js"
  }
}
```

### package.json (Desktop Admin)
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

### pubspec.yaml (Mobile Manager)
```yaml
name: mobile_sales_app
version: 1.0.0+1
dependencies:
  flutter:
    sdk: flutter
  http: ^1.4.0
  provider: ^6.1.5
```

## Useful Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Development mode
npm run seed       # Populate database
npm run sync-db    # Sync database
```

### Desktop Admin
```bash
npm start          # Development
npm run build      # Production build
npm test           # Run tests
```

### Mobile Manager
```bash
flutter run        # Run app
flutter build      # Production build
flutter test       # Run tests
flutter clean      # Clear cache
```

### Web E-commerce
```bash
php -S localhost:8000    # PHP server
php -l arquivo.php       # Check syntax
```

## Monitoring

### Logs
- Backend: Console + file
- Desktop Admin: Browser console
- Mobile Manager: Flutter logs
- Web E-commerce: PHP error log

### Metrics
- API performance
- Memory usage
- Response time
- Errors and exceptions

## Backup

### Data
- SQLite: Automatic backup
- Uploads: Synchronization
- Configurations: Versioning

### Procedure
1. Stop applications
2. Backup database
3. Backup files
4. Test restoration
5. Restart applications

## Security

### Authentication
- JWT tokens
- Hashed passwords
- Secure sessions
- CSRF protection

### Validation
- Input sanitization
- SQL injection prevention
- XSS protection
- Rate limiting

### Headers
- CORS configured
- Security headers
- HTTPS enforcement
- Content Security Policy

## Performance

### Optimizations
- Database indexing
- Query optimization
- Caching strategies
- Image compression
- Code minification

### Monitoring
- Response times
- Memory usage
- CPU usage
- Database performance
- Network latency

## Integration

### External APIs
- Payment gateways
- Shipping providers
- Email services
- SMS services
- Analytics

### Webhooks
- Order updates
- Payment confirmations
- Inventory changes
- User activities

## Maintenance

### Routines
- Daily backup
- Log rotation
- Database cleanup
- Cache clearing
- Security updates

### Updates
- Dependencies
- Framework versions
- Security patches
- Feature updates
- Bug fixes

---

**Logic Peripherals Australia** - Sales and Inventory System

Developed with modern architecture and current technologies for maximum efficiency and scalability.