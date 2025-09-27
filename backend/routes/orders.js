// routes/orders.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Middleware de autenticação (implementar depois)
// const authMiddleware = require('../middleware/auth');

// GET /api/orders - Listar todos os pedidos
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Obter pedido por ID
router.get('/:id', orderController.getOrderById);

// POST /api/orders - Criar novo pedido
// router.post('/', authMiddleware, orderController.createOrder);
router.post('/', orderController.createOrder);

// PATCH /api/orders/:id/status - Atualizar status do pedido
// router.patch('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE /api/orders/:id - Deletar pedido
// router.delete('/:id', authMiddleware, orderController.deleteOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
