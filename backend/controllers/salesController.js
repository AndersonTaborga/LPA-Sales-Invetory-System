// controllers/salesController.js

const db = require('../models');
const Sales = db.sales || db.Sales;

module.exports = {
  // Obter todas as vendas
  async getAllSales(req, res) {
    try {
      const sales = await Sales.findAll();
      res.json({
        status: 'success',
        data: sales
      });
    } catch (error) {
      console.error('Error getting sales:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar vendas'
      });
    }
  },

  // Obter venda por ID
  async getSaleById(req, res) {
    try {
      const { id } = req.params;
      const sale = await Sales.findByPk(id);
      
      if (!sale) {
        return res.status(404).json({
          status: 'error',
          message: 'Venda não encontrada'
        });
      }

      res.json({
        status: 'success',
        data: sale
      });
    } catch (error) {
      console.error('Error getting sale:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar venda'
      });
    }
  },

  // Criar nova venda
  async createSale(req, res) {
    try {
      const saleData = req.body;
      const newSale = await Sales.create(saleData);
      
      res.status(201).json({
        status: 'success',
        data: newSale,
        message: 'Venda criada com sucesso'
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao criar venda'
      });
    }
  },

  // Atualizar venda
  async updateSale(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const [updatedRows] = await Sales.update(updateData, {
        where: { id }
      });

      if (updatedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Venda não encontrada'
        });
      }

      const updatedSale = await Sales.findByPk(id);
      res.json({
        status: 'success',
        data: updatedSale,
        message: 'Venda atualizada com sucesso'
      });
    } catch (error) {
      console.error('Error updating sale:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao atualizar venda'
      });
    }
  },

  // Deletar venda
  async deleteSale(req, res) {
    try {
      const { id } = req.params;
      
      const deletedRows = await Sales.destroy({
        where: { id }
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Venda não encontrada'
        });
      }

      res.json({
        status: 'success',
        message: 'Venda deletada com sucesso'
      });
    } catch (error) {
      console.error('Error deleting sale:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erro ao deletar venda'
      });
    }
  }
};
