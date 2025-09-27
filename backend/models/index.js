'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Definir relacionamentos
const { User, Product, Category, Sales, SaleItem, Order, OrderItem } = db;

// User relationships
User.hasMany(Sales, { foreignKey: 'user_id', as: 'sales' });
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

// Product relationships
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.hasMany(SaleItem, { foreignKey: 'product_id', as: 'saleItems' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });

// Category relationships
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });

// Sales relationships
Sales.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Sales.hasMany(SaleItem, { foreignKey: 'sale_id', as: 'saleItems' });

// SaleItem relationships
SaleItem.belongsTo(Sales, { foreignKey: 'sale_id', as: 'sale' });
SaleItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order relationships
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'orderItems' });

// OrderItem relationships
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
