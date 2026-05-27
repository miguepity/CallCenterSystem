'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employees', [
      { id: uuidv4(), name: 'Ana López',     is_available: true,  rank: 1, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Luis García',   is_available: true,  rank: 2, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Sara Martínez', is_available: false, rank: 3, created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Carlos Ruiz',   is_available: true,  rank: 1, created_at: new Date(), updated_at: new Date() },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  }
};