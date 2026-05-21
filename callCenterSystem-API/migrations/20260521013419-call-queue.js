'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('call_queue', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      call_id: 
      {

        type: Sequelize.UUID,
        primaryKey:true,
        
      },
      priority: {
        type: Sequelize.INTEGER
      },
      joined_at: 
      {

        allowNull: false,
        type: Sequelize.DATE

      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};