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
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      caller_phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rank_required: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        defaultValue: 'pending',
        type: Sequelize.STRING
      },
      started_at: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
        defaultValue: Sequelize.NOW,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
