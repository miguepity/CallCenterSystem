// controllers/callsController.js
'use strict';

const { Calls, employees, call_queue } = require('../models');

// GET /calls
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
          as: 'queue',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(calls);
  } catch (error) {
    console.error('ERROR GET /calls:', error);

    res.status(500).json({
      error: error.message,
    });
  }
};


// GET /calls/:id
const getCallById = async (req,res)=> {
  try{
    const call = await Calls.findByPk(req.params.id, {
      include: [
        {model: employees, as: 'employee'},
        {model: call_queue, as:'queue'},
      ],
    });
    if (!call){
      return res.status(404).json({error: 'Call not found'});
    }
    res.json(call);
  }catch(error){
    console.error('ERROR GET /calls/:id', error);
    res.status(500).json({error: error.message});
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

    const updatedCall = await Calls.findByPk(req.params.id);
    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR PUT /calls/:id:', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /calls
const createCall = async (req, res) => {
  try {
    const newCall = await Calls.create(req.body);
    res.status(201).json(newCall);
  } catch (error) {
    console.error('ERROR POST /calls:', error);
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

// PATCH /calls/:id
const patchCall = async (req, res) => {
  try {
    const call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Actualiza solo los campos enviados en el body
    await call.update(req.body);
    res.json(call);
  } catch (error) {
    console.error('ERROR PATCH /calls/:id:', error);
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

    const currentRank = call.rank_required ?? 1;
    const maxRank = 3;

    if (currentRank >= maxRank) {
      return res.status(400).json({ error: 'Call already at maximum rank' });
    }

    await call.update({
      rank_required: currentRank + 1,
      escalations: (call.escalations ?? 0) + 1,
      status: 'queue',
    });

    const updatedCall = await Calls.findByPk(req.params.id, {
      include: [
        { model: employees, as: 'employee' },
        { model: call_queue, as: 'queue' },
      ],
    });

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

    await call.update({
      status: 'finished',
      finished_at: new Date(),
    });

    const updatedCall = await Calls.findByPk(req.params.id, {
      include: [
        { model: employees, as: 'employee' },
        { model: call_queue, as: 'queue' },
      ],
    });

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

    const call = await Calls.findByPk(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const employee = await employees.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await call.update({
      employee_id,
      status: 'escalated',
    });

    const updatedCall = await Calls.findByPk(req.params.id, {
      include: [
        { model: employees, as: 'employee' },
        { model: call_queue, as: 'queue' },
      ],
    });

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

    const call = await Calls.findByPk(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    const employee = await employees.findByPk(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await call.update({
      employee_id,
      status: 'active',
    });

    const updatedCall = await Calls.findByPk(req.params.id, {
      include: [
        { model: employees, as: 'employee' },
        { model: call_queue, as: 'queue' },
      ],
    });

    res.json(updatedCall);
  } catch (error) {
    console.error('ERROR POST /calls/:id/dispatch:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCalls,
  getCallById,
  updateCall,
  createCall,
  deleteCall,
  patchCall,
  escalateCall,
  finishCall,
  assignAgent,
  dispatchCall,
};