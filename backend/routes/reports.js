// routes/reports.js

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Middleware de autenticação (implementar depois)
// const authMiddleware = require('../middleware/auth');

// GET /api/reports/dashboard - Resumo do dashboard
router.get('/dashboard', reportController.getDashboardSummary);

// GET /api/reports/sales - Relatório de vendas
router.get('/sales', reportController.getSalesReport);

// GET /api/reports/top-products - Produtos mais vendidos
router.get('/top-products', reportController.getTopProductsReport);

// GET /api/reports/customers - Relatório de clientes
router.get('/customers', reportController.getCustomersReport);

// GET /api/reports/stock - Relatório de estoque
router.get('/stock', reportController.getStockReport);

module.exports = router;
