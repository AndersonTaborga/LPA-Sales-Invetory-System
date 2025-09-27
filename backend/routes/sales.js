// routes/sales.js

const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Middleware de autenticação (implementar depois)
// const authMiddleware = require('../middleware/auth');

// GET /api/sales - Listar todas as vendas
router.get('/', salesController.getAllSales);

// GET /api/sales/:id - Obter venda por ID
router.get('/:id', salesController.getSaleById);

// POST /api/sales - Criar nova venda
// router.post('/', authMiddleware, salesController.createSale);
router.post('/', salesController.createSale);

// PUT /api/sales/:id - Atualizar venda
// router.put('/:id', authMiddleware, salesController.updateSale);
router.put('/:id', salesController.updateSale);

// DELETE /api/sales/:id - Deletar venda
// router.delete('/:id', authMiddleware, salesController.deleteSale);
router.delete('/:id', salesController.deleteSale);

module.exports = router; 