// routes/products.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Middleware de autenticação (implementar depois)
// const authMiddleware = require('../middleware/auth');

// GET /api/products - Listar todos os produtos
router.get('/', productController.getAllProducts);

// GET /api/products/low-stock - Produtos com estoque baixo
router.get('/low-stock', productController.getLowStockProducts);

// GET /api/products/:id - Obter produto por ID
router.get('/:id', productController.getProductById);

// POST /api/products - Criar novo produto
// router.post('/', authMiddleware, productController.createProduct);
router.post('/', productController.createProduct);

// PUT /api/products/:id - Atualizar produto
// router.put('/:id', authMiddleware, productController.updateProduct);
router.put('/:id', productController.updateProduct);

// PATCH /api/products/:id/stock - Atualizar estoque
// router.patch('/:id/stock', authMiddleware, productController.updateStock);
router.patch('/:id/stock', productController.updateStock);

// DELETE /api/products/:id - Deletar produto
// router.delete('/:id', authMiddleware, productController.deleteProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
