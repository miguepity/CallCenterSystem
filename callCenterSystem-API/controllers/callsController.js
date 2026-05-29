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


module.exports = {
  getCalls,
  getCallById,
  updateCall
};