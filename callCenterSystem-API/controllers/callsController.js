'use strict';

const { Calls, employees, call_queue } = require('../models');

const includeRelations = [
  { model: employees, as: 'employee' },
  { model: call_queue, as: 'queue' },
];

async function findCallById(id) {
  return Calls.findByPk(id, { include: includeRelations });
}

// GET /calls
const getCalls = async (req, res) => {
  try {
    const calls = await Calls.findAll({
      include: includeRelations,
      order: [['createdAt', 'DESC']],
    });

    res.json(calls);
  } catch (error) {
    console.error('ERROR GET /calls:', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /calls/:id
const getCallById = async (req, res) => {
  try {
    const call = await findCallById(req.params.id);

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json(call);
  } catch (error) {
    console.error('ERROR GET /calls/:id:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /calls
const createCall = async (req, res) => {
  try {
    const newCall = await Calls.create({
      caller_name: req.body.caller_name,
      caller_phone: req.body.caller_phone,
      rank_required: req.body.rank_required ?? 1,
      status: 'queued',
      started_at: null,
      finished_at: null,
      employeeId: null,
      callQueueId: req.body.callQueueId ?? null,
    });

    const availableAgent = await employees.findOne({
      where: {
        is_available: true,
        rank: { [require('sequelize').Op.gte]: newCall.rank_required },
      },
    });

    if (availableAgent) {
      await newCall.update({
        employeeId: availableAgent.id,
        status: 'active',
        started_at: new Date(),
      });
      await availableAgent.update({ is_available: false });
    } else {

      const priority = (await call_queue.count()) + 1;
      await call_queue.create({
        call_id: newCall.id,
        priority,
        joined_at: new Date(),
      });
    }

    const createdCall = await findCallById(newCall.id);
    res.status(201).json(createdCall);
  } catch (error) {
    console.error('ERROR POST /calls:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /calls/:id
const updateCall = async (req, res) => {
  try {
    const [updatedRows] = await Calls.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const updatedCall = await findCallById(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR PUT /calls/:id:', error);
    res.status(500).json({ error: error.message });
  }
};

// PATCH /calls/:id
const patchCall = async (req, res) => {
  try {
    const call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    await call.update(req.body);

    const updatedCall = await findCallById(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR PATCH /calls/:id:', error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE /calls/:id
const deleteCall = async (req, res) => {
  try {
    const deletedRows = await Calls.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Call not found' });
    }

    res.json({ message: 'Call deleted' });
  } catch (error) {
    console.error('ERROR DELETE /calls/:id:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /calls/:id/escalate
const escalateCall = async (req, res) => {
  try {
    const call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const currentRank = Number(call.rank_required ?? 1);
    if (currentRank >= 3) {
      return res.status(400).json({ error: 'Call already at maximum rank' });
    }
    
    if (call.employeeId) {
      await employees.update(
        { is_available: true },
        { where: { id: call.employeeId } }
      );
    }

    await call.update({
      rank_required: currentRank + 1,
      status: 'escalated',
      employeeId: null,
    });

    const updatedCall = await findCallById(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR POST /calls/:id/escalate:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /calls/:id/finish
const finishCall = async (req, res) => {
  try {
    const call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.employeeId) {
      await employees.update(
        { is_available: true },
        { where: { id: call.employeeId } }
      );
    }

    await call.update({
      status: 'finished',
      finished_at: new Date(),
    });

    const updatedCall = await findCallById(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR POST /calls/:id/finish:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /calls/:id/assign
const assignAgent = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'employee_id is required' });
    }

    const call = await Calls.findByPk(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const employee = await employees.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await call.update({
      employeeId: employee_id,
      status: 'escalated',
    });

    const updatedCall = await findCallById(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR POST /calls/:id/assign:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /calls/:id/dispatch
const dispatchCall = async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'employee_id is required' });
    }

    const call = await Calls.findByPk(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const employee = await employees.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await call.update({
      employeeId: employee_id,
      status: 'active',
      started_at: call.started_at ?? new Date(),
    });

    await employee.update({ is_available: false });
    await call_queue.destroy({
      where: { call_id: call.id },
    });

    const updatedCall = await findCallById(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR POST /calls/:id/dispatch:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCalls,
  getCallById,
  createCall,
  updateCall,
  patchCall,
  deleteCall,
  escalateCall,
  finishCall,
  assignAgent,
  dispatchCall,
};