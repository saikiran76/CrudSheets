'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Spreadsheets');

    if (!tableDescription['data']) {
      await queryInterface.addColumn('Spreadsheets', 'data', {
        type: Sequelize.JSON,
        allowNull: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Spreadsheets');

    if (tableDescription['data']) {
      await queryInterface.removeColumn('Spreadsheets', 'data');
    }
  }
};
