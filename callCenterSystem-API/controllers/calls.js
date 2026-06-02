var db = require('../models');
var { Calls, call_queues } = db;
var { Calls, employees, call_queues } = require('../models');

async function createcall(req, res) {
  try {
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

module.exports = {
  createcall: createcall,
  deletecall: deletecall,
  getcalls: getcalls,
  getcallbyid: getcallbyid
};
