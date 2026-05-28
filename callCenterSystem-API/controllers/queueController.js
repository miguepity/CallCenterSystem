'use strict';

const { call_queue, Calls, employees } = require('../models');

// GET /call-queue
const getQueue = async (req, res) => {
  try {
    const queue = await call_queue.findAll({
      include: [{ model: Calls, as: 'call' }],
      order: [['priority', 'DESC'], ['joined_at', 'ASC']]
    });
    res.status(200).json(queue);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la cola', error: error.message });
  }
};

// GET /call-queue/:id
const getQueueEntry = async (req, res) => {
  try {
    const entry = await call_queue.findByPk(req.params.id, {
      include: [{ model: Calls, as: 'call' }]
    });
    if (!entry) return res.status(404).json({ message: 'Entrada no encontrada' });
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la entrada', error: error.message });
  }
};

// POST /call-queue/enqueue
const enqueue = async (req, res) => {
  try {
    const { call_id, priority } = req.body;

    const call = await Calls.findByPk(call_id);
    if (!call) return res.status(404).json({ message: 'Llamada no encontrada' });

    const entry = await call_queue.create({
      call_id,
      priority: priority ?? 1,
      joined_at: new Date()
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error al encolar la llamada', error: error.message });
  }
};

// DELETE /call-queue/:id
const removeFromQueue = async (req, res) => {
  try {
    const entry = await call_queue.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entrada no encontrada' });

    await entry.destroy();
    res.status(200).json({ message: 'Llamada removida de la cola' });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover la llamada', error: error.message });
  }
};

// POST /call-queue/dispatch
const dispatch = async (req, res) => {
  try {
    const next = await call_queue.findOne({
      include: [{ model: Calls, as: 'call' }],
      order: [['priority', 'DESC'], ['joined_at', 'ASC']]
    });
    if (!next) return res.status(200).json({ message: 'Cola vacía' });

    const employee = await employees.findOne({
      where: {
        rank: next.call.rank_required,
        is_available: true
      }
    });

    if (!employee) {
      return res.status(200).json({ message: 'No hay empleados disponibles', call_queue_id: next.id });
    }

    await employee.update({ is_available: false });
    await next.call.update({ status: 'in_progress' });
    await next.destroy();

    res.status(200).json({
      message: 'Llamada despachada',
      employee_id: employee.id,
      call_id: next.call.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al despachar', error: error.message });
  }
};

// POST /call-queue/escalate/:id
const escalate = async (req, res) => {
  try {
    const entry = await call_queue.findByPk(req.params.id, {
      include: [{ model: Calls, as: 'call' }]
    });
    if (!entry) return res.status(404).json({ message: 'Entrada no encontrada' });

    const newRank = parseInt(entry.call.rank_required) + 1;

    await entry.call.update({ rank_required: String(newRank) });
    await entry.update({ priority: newRank });

    res.status(200).json({
      message: 'Llamada escalada',
      new_rank: newRank,
      call_queue_id: entry.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al escalar', error: error.message });
  }
};

module.exports = { getQueue, getQueueEntry, enqueue, removeFromQueue, dispatch, escalate };