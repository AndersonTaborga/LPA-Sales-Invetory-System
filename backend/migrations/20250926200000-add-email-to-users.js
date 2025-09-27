'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    // Update existing users with email
    await queryInterface.sequelize.query(
      "UPDATE users SET email = 'admin@lpa.com' WHERE username = 'admin'"
    );
    
    // Make email NOT NULL and UNIQUE after updating
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'email');
  }
};
