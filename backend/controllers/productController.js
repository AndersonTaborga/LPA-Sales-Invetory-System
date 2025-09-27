// controllers/productController.js

const db = require('../models');
const { Product, Category } = db;
const { Op } = db.Sequelize;

module.exports = {
  // Obter todos os produtos
  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 20, category, search, is_active } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      
      if (category) {
        where.category_name = category;
      }
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { sku: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (is_active !== undefined) {
        where.is_active = is_active === 'true';
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        status: 'success',
        data: products,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produtos',
        error: error.message
      });
    }
  },

  // Obter produto por ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'description']
          }
        ]
      });
      
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      res.json({
        status: 'success',
        data: product
      });
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produto'
      });
    }
  },

  // Criar novo produto
  async createProduct(req, res) {
    try {
      const productData = req.body;
      
      // Validar se a categoria existe
      if (productData.category_id) {
        const category = await Category.findByPk(productData.category_id);
        if (!category) {
          return res.status(400).json({
            status: 'error',
            message: 'Categoria não encontrada'
          });
        }
      }

      const newProduct = await Product.create(productData);
      
      // Buscar o produto criado com a categoria
      const productWithCategory = await Product.findByPk(newProduct.id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      });
      
      res.status(201).json({
        status: 'success',
        data: productWithCategory,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao criar produto'
      });
    }
  },

  // Atualizar produto
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validar se a categoria existe
      if (updateData.category_id) {
        const category = await Category.findByPk(updateData.category_id);
        if (!category) {
          return res.status(400).json({
            status: 'error',
            message: 'Categoria não encontrada'
          });
        }
      }
      
      const [updatedRows] = await Product.update(updateData, {
        where: { id }
      });

      if (updatedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      const updatedProduct = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      });
      
      res.json({
        status: 'success',
        data: updatedProduct,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar produto'
      });
    }
  },

  // Deletar produto
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const deletedRows = await Product.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      res.json({
        status: 'success',
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao deletar produto'
      });
    }
  },

  // Atualizar estoque
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      
      if (stock < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Estoque não pode ser negativo'
        });
      }
      
      const [updatedRows] = await Product.update(
        { stock },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Produto não encontrado'
        });
      }

      const updatedProduct = await Product.findByPk(id);
      
      res.json({
        status: 'success',
        data: updatedProduct,
        message: 'Estoque atualizado com sucesso'
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar estoque'
      });
    }
  },

  // Obter produtos com estoque baixo
  async getLowStockProducts(req, res) {
    try {
      const { threshold = 10 } = req.query;
      
      const products = await Product.findAll({
        where: {
          stock: {
            [Op.lte]: parseInt(threshold)
          },
          is_active: true
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ],
        order: [['stock', 'ASC']]
      });

      res.json({
        status: 'success',
        data: products
      });
    } catch (error) {
      console.error('Error getting low stock products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar produtos com estoque baixo'
      });
    }
  }
};
