// controllers/orderController.js

const db = require('../models');
const { Order, OrderItem, Product, User } = db;
const { Op } = db.Sequelize;

module.exports = {
  // Obter todos os pedidos
  async getAllOrders(req, res) {
    try {
      const { page = 1, limit = 20, status, user_id, start_date, end_date } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      
      if (status) {
        where.status = status;
      }
      
      if (user_id) {
        where.user_id = user_id;
      }
      
      if (start_date && end_date) {
        where.createdAt = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'first_name', 'last_name']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'image_url']
              }
            ]
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        status: 'success',
        data: orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error getting orders:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar pedidos'
      });
    }
  },

  // Obter pedido por ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'phone']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'description', 'image_url', 'sku']
              }
            ]
          }
        ]
      });
      
      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Pedido não encontrado'
        });
      }

      res.json({
        status: 'success',
        data: order
      });
    } catch (error) {
      console.error('Error getting order:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar pedido'
      });
    }
  },

  // Criar novo pedido
  async createOrder(req, res) {
    const transaction = await db.sequelize.transaction();
    
    try {
      console.log('Creating order with data:', req.body);
      const { order_items, ...orderData } = req.body;
      
      if (!order_items || order_items.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          status: 'error',
          message: 'Pedido deve conter pelo menos um item'
        });
      }

      // Calcular total do pedido
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of order_items) {
        const product = await Product.findByPk(item.product_id, { transaction });
        
        if (!product) {
          await transaction.rollback();
          return res.status(400).json({
            status: 'error',
            message: `Produto com ID ${item.product_id} não encontrado`
          });
        }

        if (product.stock < item.quantity) {
          await transaction.rollback();
          return res.status(400).json({
            status: 'error',
            message: `Estoque insuficiente para o produto ${product.name}`
          });
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal
        });
      }

      // Criar pedido
      const newOrder = await Order.create({
        ...orderData,
        total_amount: totalAmount
      }, { transaction });

      // Criar itens do pedido
      for (const itemData of orderItemsData) {
        await OrderItem.create({
          ...itemData,
          order_id: newOrder.id
        }, { transaction });

        // Atualizar estoque
        await Product.decrement('stock', {
          by: itemData.quantity,
          where: { id: itemData.product_id },
          transaction
        });
      }

      await transaction.commit();

      // Buscar pedido criado com relacionamentos
      const orderWithItems = await Order.findByPk(newOrder.id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'first_name', 'last_name']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'image_url']
              }
            ]
          }
        ]
      });
      
      res.status(201).json({
        status: 'success',
        data: orderWithItems,
        message: 'Pedido criado com sucesso'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating order:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao criar pedido'
      });
    }
  },

  // Atualizar status do pedido
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Status inválido'
        });
      }
      
      const [updatedRows] = await Order.update(
        { status },
        { where: { id } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Pedido não encontrado'
        });
      }

      const updatedOrder = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'email', 'first_name', 'last_name']
          },
          {
            model: OrderItem,
            as: 'orderItems',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'image_url']
              }
            ]
          }
        ]
      });
      
      res.json({
        status: 'success',
        data: updatedOrder,
        message: 'Status do pedido atualizado com sucesso'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar status do pedido'
      });
    }
  },

  // Deletar pedido
  async deleteOrder(req, res) {
    const transaction = await db.sequelize.transaction();
    
    try {
      const { id } = req.params;
      
      // Buscar pedido com itens
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'orderItems'
          }
        ],
        transaction
      });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({
          status: 'error',
          message: 'Pedido não encontrado'
        });
      }

      // Restaurar estoque dos produtos
      for (const item of order.orderItems) {
        await Product.increment('stock', {
          by: item.quantity,
          where: { id: item.product_id },
          transaction
        });
      }

      // Deletar itens do pedido
      await OrderItem.destroy({
        where: { order_id: id },
        transaction
      });

      // Deletar pedido
      await Order.destroy({
        where: { id },
        transaction
      });

      await transaction.commit();

      res.json({
        status: 'success',
        message: 'Pedido deletado com sucesso'
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting order:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao deletar pedido'
      });
    }
  }
};
