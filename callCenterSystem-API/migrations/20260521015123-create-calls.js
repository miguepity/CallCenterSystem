'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Calls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_: {
        type: Sequelize.UUID
      },
      caller_name: {
        type: Sequelize.STRING
      },
      caller_phone: {
        type: Sequelize.STRING
      },
      rank_required: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      started_at: {
        type: Sequelize.DATE
      },
      finished_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Calls');
  }
};