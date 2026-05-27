// controllers/callsController.js
'use strict';

const { Calls, employees, call_queue } = require('../models');

const getCalls = async (req, res) => {
  try {
    const calls = await Calls.findAll({
      include: [
        {
          model: employees,
          as: 'employee',
        },
        {
          model: call_queue,
          as: 'callQueue',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.json(calls);
  } catch (error) {
    console.error('ERROR GET /calls:', error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getCalls,
};