// controllers/categoryController.js

const db = require('../models');
const { Category, Product } = db;

module.exports = {
  // Obter todas as categorias
  async getAllCategories(req, res) {
    try {
      const { include_products = false } = req.query;
      
      const include = include_products === 'true' ? [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'name', 'price', 'stock'],
          where: { is_active: true },
          required: false
        }
      ] : [];

      const categories = await Category.findAll({
        where: { is_active: true },
        include,
        order: [['name', 'ASC']]
      });

      res.json({
        status: 'success',
        data: categories
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar categorias'
      });
    }
  },

  // Obter categoria por ID
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'price', 'stock', 'image_url'],
            where: { is_active: true },
            required: false
          }
        ]
      });
      
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        status: 'success',
        data: category
      });
    } catch (error) {
      console.error('Error getting category:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar categoria'
      });
    }
  },

  // Criar nova categoria
  async createCategory(req, res) {
    try {
      const categoryData = req.body;
      const newCategory = await Category.create(categoryData);
      
      res.status(201).json({
        status: 'success',
        data: newCategory,
        message: 'Categoria criada com sucesso'
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao criar categoria'
      });
    }
  },

  // Atualizar categoria
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const [updatedRows] = await Category.update(updateData, {
        where: { id }
      });

      if (updatedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Categoria não encontrada'
        });
      }

      const updatedCategory = await Category.findByPk(id);
      
      res.json({
        status: 'success',
        data: updatedCategory,
        message: 'Categoria atualizada com sucesso'
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar categoria'
      });
    }
  },

  // Deletar categoria
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se existem produtos nesta categoria
      const productsCount = await Product.count({
        where: { category_id: id }
      });

      if (productsCount > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Não é possível deletar categoria com produtos associados'
        });
      }
      
      const deletedRows = await Category.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Categoria não encontrada'
        });
      }

      res.json({
        status: 'success',
        message: 'Categoria deletada com sucesso'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao deletar categoria'
      });
    }
  }
};
