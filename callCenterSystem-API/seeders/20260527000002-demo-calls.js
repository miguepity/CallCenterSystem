'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Obtenemos los ids de employees para las FKs
    const employees = await queryInterface.sequelize.query(
      'SELECT id FROM employees ORDER BY created_at ASC;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('Calls', [
      {
        caller_name: 'Pedro Hernández',
        caller_phone: '99001122',
        rank_required: '1',
        status: 'finished',
        started_at: new Date('2026-05-27T08:00:00'),
        finished_at: new Date('2026-05-27T08:15:00'),
        employeeId: employees[0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        caller_name: 'María Torres',
        caller_phone: '99334455',
        rank_required: '2',
        status: 'active',
        started_at: new Date('2026-05-27T09:00:00'),
        finished_at: null,
        employeeId: employees[1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        caller_name: 'Jorge Méndez',
        caller_phone: '88112233',
        rank_required: '1',
        status: 'queued',
        started_at: null,
        finished_at: null,
        employeeId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        caller_name: 'Laura Jiménez',
        caller_phone: '77998800',
        rank_required: '3',
        status: 'escalated',
        started_at: new Date('2026-05-27T09:30:00'),
        finished_at: null,
        employeeId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Calls', null, {});
  }
};