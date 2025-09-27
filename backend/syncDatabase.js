const { Sequelize } = require('sequelize');
const config = require('./config/config.json').development;
const db = require('./models'); // Import models and associations

const sequelize = new Sequelize({
  dialect: config.dialect,
  storage: config.storage,
  logging: config.logging
});

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // You can add basic data creation here if needed for testing

  } catch (error) {
    console.error('Unable to sync database:', error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase(); 