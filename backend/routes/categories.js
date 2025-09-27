// routes/categories.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Middleware de autenticação (implementar depois)
// const authMiddleware = require('../middleware/auth');

// GET /api/categories - Listar todas as categorias
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Obter categoria por ID
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - Criar nova categoria
// router.post('/', authMiddleware, categoryController.createCategory);
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - Atualizar categoria
// router.put('/:id', authMiddleware, categoryController.updateCategory);
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - Deletar categoria
// router.delete('/:id', authMiddleware, categoryController.deleteCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
