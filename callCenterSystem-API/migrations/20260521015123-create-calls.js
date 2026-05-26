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
      employeeId: {
        references: {
          model: 'employees',
          key: 'id'
        },
        type: Sequelize.UUID
      },
      callQueueId: {
        references: {
          model: 'call_queue',
          key: 'id'
        },
        type: Sequelize.UUID
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
    await queryInterface.addColumn('call_queue', "callId", {
      name: 'call_id',
      type: Sequelize.INTEGER,
      references: {
        model: 'Calls',
        key: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('call_queue', 'callId');
    await queryInterface.dropTable('Calls');
  }
};