'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calls', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
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
      employee_id: {
        references: {
          model: 'employees',
          key: 'id'
        },
        type: Sequelize.UUID
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addColumn('call_queues', "call_id", {
      name: 'call_id',
      type: Sequelize.UUID,
      references: {
        model: 'calls',
        key: 'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('call_queues', 'call_id');
    await queryInterface.dropTable('calls');
  }
};
