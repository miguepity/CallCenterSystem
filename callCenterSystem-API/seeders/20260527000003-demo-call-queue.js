'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const calls = await queryInterface.sequelize.query(
      `SELECT id FROM "Calls" WHERE status IN ('queued', 'escalated') ORDER BY "createdAt" ASC;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('call_queue', [
      {
        id: uuidv4(),
        callId: calls[0].id,
        priority: 1,
        joined_at: new Date('2026-05-27T09:10:00'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        callId: calls[1].id,
        priority: 5,
        joined_at: new Date('2026-05-27T09:35:00'),
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('call_queue', null, {});
  }
};