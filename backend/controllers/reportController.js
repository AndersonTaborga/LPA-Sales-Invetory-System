// controllers/reportController.js

const db = require('../models');
const { Sales, SaleItem, Product, Order, OrderItem, User } = db;
const { Op } = db.Sequelize;

module.exports = {
  // Relatório de vendas
  async getSalesReport(req, res) {
    try {
      const { start_date, end_date, group_by = 'day' } = req.query;
      
      const where = {};
      if (start_date && end_date) {
        where.created_at = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      let groupByClause;
      let dateFormat;
      
      switch (group_by) {
        case 'day':
          groupByClause = db.sequelize.fn('DATE', db.sequelize.col('created_at'));
          dateFormat = '%Y-%m-%d';
          break;
        case 'month':
          groupByClause = db.sequelize.fn('DATE_FORMAT', db.sequelize.col('created_at'), '%Y-%m');
          dateFormat = '%Y-%m';
          break;
        case 'year':
          groupByClause = db.sequelize.fn('YEAR', db.sequelize.col('created_at'));
          dateFormat = '%Y';
          break;
        default:
          groupByClause = db.sequelize.fn('DATE', db.sequelize.col('created_at'));
          dateFormat = '%Y-%m-%d';
      }

      const salesReport = await Sales.findAll({
        where,
        attributes: [
          [groupByClause, 'period'],
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_sales'],
          [db.sequelize.fn('SUM', db.sequelize.col('total')), 'total_amount'],
          [db.sequelize.fn('AVG', db.sequelize.col('total')), 'average_amount']
        ],
        group: [groupByClause],
        order: [[groupByClause, 'ASC']],
        raw: true
      });

      // Estatísticas gerais
      const totalSales = await Sales.count({ where });
      const totalAmount = await Sales.sum('total', { where });
      const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;

      res.json({
        status: 'success',
        data: {
          report: salesReport,
          summary: {
            total_sales: totalSales,
            total_amount: totalAmount || 0,
            average_amount: averageAmount
          }
        }
      });
    } catch (error) {
      console.error('Error getting sales report:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao gerar relatório de vendas'
      });
    }
  },

  // Relatório de produtos mais vendidos
  async getTopProductsReport(req, res) {
    try {
      const { start_date, end_date, limit = 10 } = req.query;
      
      const where = {};
      if (start_date && end_date) {
        where.created_at = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const topProducts = await SaleItem.findAll({
        where,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'image_url', 'category_name']
          },
          {
            model: Sales,
            as: 'sale',
            where: where,
            required: true
          }
        ],
        attributes: [
          'product_id',
          [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'total_quantity'],
          [db.sequelize.fn('SUM', db.sequelize.col('total')), 'total_amount']
        ],
        group: ['product_id'],
        order: [[db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'DESC']],
        limit: parseInt(limit)
      });

      res.json({
        status: 'success',
        data: topProducts
      });
    } catch (error) {
      console.error('Error getting top products report:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao gerar relatório de produtos mais vendidos'
      });
    }
  },

  // Relatório de clientes
  async getCustomersReport(req, res) {
    try {
      const { start_date, end_date, limit = 10 } = req.query;
      
      const where = {};
      if (start_date && end_date) {
        where.created_at = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const topCustomers = await Sales.findAll({
        where,
        attributes: [
          'customer_name',
          'customer_email',
          [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_orders'],
          [db.sequelize.fn('SUM', db.sequelize.col('total')), 'total_spent'],
          [db.sequelize.fn('AVG', db.sequelize.col('total')), 'average_order_value']
        ],
        group: ['customer_name', 'customer_email'],
        order: [[db.sequelize.fn('SUM', db.sequelize.col('total')), 'DESC']],
        limit: parseInt(limit),
        raw: true
      });

      // Estatísticas gerais de clientes
      const totalCustomers = await Sales.count({
        where,
        distinct: true,
        col: 'customer_email'
      });

      res.json({
        status: 'success',
        data: {
          top_customers: topCustomers,
          summary: {
            total_customers: totalCustomers
          }
        }
      });
    } catch (error) {
      console.error('Error getting customers report:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao gerar relatório de clientes'
      });
    }
  },

  // Relatório de estoque
  async getStockReport(req, res) {
    try {
      const { low_stock_threshold = 10 } = req.query;
      
      const stockReport = await Product.findAll({
        attributes: [
          'id',
          'name',
          'stock',
          'price',
          'category_name',
          [db.sequelize.literal(`CASE 
            WHEN stock <= ${low_stock_threshold} THEN 'low'
            WHEN stock <= ${low_stock_threshold * 2} THEN 'medium'
            ELSE 'high'
          END`), 'stock_level']
        ],
        where: {
          is_active: true
        },
        order: [['stock', 'ASC']]
      });

      // Estatísticas de estoque
      const totalProducts = await Product.count({ where: { is_active: true } });
      const lowStockProducts = await Product.count({
        where: {
          stock: { [Op.lte]: low_stock_threshold },
          is_active: true
        }
      });
      const totalStockValue = await Product.sum(
        db.sequelize.literal('stock * price'),
        { where: { is_active: true } }
      );

      res.json({
        status: 'success',
        data: {
          products: stockReport,
          summary: {
            total_products: totalProducts,
            low_stock_products: lowStockProducts,
            total_stock_value: totalStockValue || 0
          }
        }
      });
    } catch (error) {
      console.error('Error getting stock report:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao gerar relatório de estoque'
      });
    }
  },

  // Dashboard - resumo geral
  async getDashboardSummary(req, res) {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      // Vendas do mês
      const monthlySales = await Sales.sum('total', {
        where: {
          created_at: {
            [Op.gte]: startOfMonth
          }
        }
      });

      // Vendas do ano
      const yearlySales = await Sales.sum('total', {
        where: {
          created_at: {
            [Op.gte]: startOfYear
          }
        }
      });

      // Total de vendas
      const totalSales = await Sales.sum('total');

      // Total de pedidos
      const totalOrders = await Order.count();

      // Produtos com estoque baixo
      const lowStockProducts = await Product.count({
        where: {
          stock: { [Op.lte]: 10 },
          is_active: true
        }
      });

      // Total de produtos
      const totalProducts = await Product.count({
        where: { is_active: true }
      });

      // Total de clientes
      const totalCustomers = await User.count({
        where: { role: 'customer' }
      });

      res.json({
        status: 'success',
        data: {
          sales: {
            monthly: monthlySales || 0,
            yearly: yearlySales || 0,
            total: totalSales || 0
          },
          orders: {
            total: totalOrders
          },
          products: {
            total: totalProducts,
            low_stock: lowStockProducts
          },
          customers: {
            total: totalCustomers
          }
        }
      });
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao gerar resumo do dashboard'
      });
    }
  }
};
