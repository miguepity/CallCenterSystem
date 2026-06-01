var { Calls } = require('../models');

async function createcall(req, res) {
  try {
    if (req.body.callQueueId !== undefined) {
      return res.status(400).json({ message: 'callQueueId no pertenece a Calls; la relacion se gestiona desde call_queues.call_id' });
    }

    var call = await Calls.create({
      caller_name: req.body.caller_name,
      caller_phone: req.body.caller_phone,
      rank_required: req.body.rank_required,
      status: req.body.status,
      started_at: req.body.started_at,
      finished_at: req.body.finished_at,
      employeeId: req.body.employeeId
    });

    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la llamada', error: error.message });
  }
}

async function putcall(req, res) {
  try {
    var body = req.body || {};
    var data = {};

    if (body.callQueueId !== undefined) {
      return res.status(400).json({ message: 'callQueueId no pertenece a Calls; la relacion se gestiona desde call_queues.call_id' });
    }

    if (body.caller_name !== undefined) {
      if (String(body.caller_name).trim() === '') {
        return res.status(400).json({ message: 'caller_name no puede estar vacio' });
      }

      data.caller_name = String(body.caller_name).trim();
    }

    if (body.caller_phone !== undefined) {
      if (String(body.caller_phone).trim() === '') {
        return res.status(400).json({ message: 'caller_phone no puede estar vacio' });
      }

      data.caller_phone = String(body.caller_phone).trim();
    }

    if (body.rank_required !== undefined) {
      var rankRequired = Number(body.rank_required);

      if (!Number.isInteger(rankRequired) || rankRequired <= 0) {
        return res.status(400).json({ message: 'rank_required debe ser un numero entero positivo' });
      }

      data.rank_required = String(body.rank_required);
    }

    if (body.status !== undefined) {
      data.status = String(body.status).trim();
    }

    if (body.started_at !== undefined) {
      if (Number.isNaN(Date.parse(body.started_at))) {
        return res.status(400).json({ message: 'started_at debe ser una fecha valida' });
      }

      data.started_at = body.started_at;
    }

    if (body.finished_at !== undefined) {
      if (Number.isNaN(Date.parse(body.finished_at))) {
        return res.status(400).json({ message: 'finished_at debe ser una fecha valida' });
      }

      data.finished_at = body.finished_at;
    }

    if (body.employeeId !== undefined) {
      data.employeeId = body.employeeId;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }

    var call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ message: 'Llamada no encontrada' });
    }

    await call.update(data);

    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la llamada', error: error.message });
  }
}

module.exports = {
  createcall: createcall,
  putcall: putcall
};
