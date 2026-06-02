var db = require('../models');
var { Calls, employees, call_queues } = db;

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

async function getcalls(req, res) {
  try {
    var limit = parseInt(req.query.limit, 10) || 5;
    var offset = parseInt(req.query.offset, 10) || 0;

    var calls = await Calls.findAndCountAll({
      limit: limit,
      offset: offset,
      distinct: true,
      include: [
        { model: employees },
        { model: call_queues }
      ]
    });

    res.status(200).json({ total: calls.count, calls: calls.rows });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las llamadas', error: error.message });
  }
}

async function getcallbyid(req, res) {
  try {
    var call = await Calls.findByPk(req.params.id, {
      include: [
        { model: employees },
        { model: call_queues }
      ]
    });

    if (!call) {
      return res.status(404).json({ message: 'Llamada no encontrada' });
    }

    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la llamada', error: error.message });
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

async function deletecall(req, res) {
  var transaction;

  try {
    transaction = await db.sequelize.transaction();

    var call = await Calls.findByPk(req.params.id, { transaction: transaction });

    if (!call) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Llamada no encontrada' });
    }

    await call_queues.destroy({
      where: { call_id: req.params.id },
      transaction: transaction
    });
    await call.destroy({ transaction: transaction });

    await transaction.commit();
    res.status(200).json({ message: 'Llamada eliminada correctamente' });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    res.status(500).json({ message: 'Error al eliminar la llamada', error: error.message });
  }
}

module.exports = {
  createcall: createcall,
  getcalls: getcalls,
  getcallbyid: getcallbyid,
  putcall: putcall,
  deletecall: deletecall
};
