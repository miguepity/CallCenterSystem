var db = require('../models');
var { Calls, employees, call_queues } = db;
var { Op } = db.Sequelize;

var CALL_STATUSES = ['pending', 'completed', 'cancelled'];
var CREATE_FIELDS = ['caller_name', 'caller_phone', 'rank_required', 'status', 'employeeId'];
var UPDATE_FIELDS = ['caller_name', 'caller_phone', 'rank_required', 'status', 'finished_at', 'employeeId'];

function hasField(body, field) {
  return Object.prototype.hasOwnProperty.call(body, field);
}

function getUnexpectedFields(body, allowedFields) {
  return Object.keys(body || {}).filter(function (field) {
    return allowedFields.indexOf(field) === -1;
  });
}

function isUuid(value) {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function validateRequiredString(body, field) {
  if (!hasField(body, field) || body[field] === null || String(body[field]).trim() === '') {
    return { message: field + ' es requerido' };
  }

  return { value: String(body[field]).trim() };
}

function validateOptionalString(body, field) {
  if (!hasField(body, field)) {
    return {};
  }

  if (body[field] === null || String(body[field]).trim() === '') {
    return { message: field + ' no puede estar vacio' };
  }

  return { value: String(body[field]).trim() };
}

function validateRank(value) {
  var rankRequired = Number(value);

  if (!Number.isInteger(rankRequired) || rankRequired <= 0) {
    return { message: 'rank_required debe ser un numero entero positivo' };
  }

  return { value: String(value).trim() };
}

function validateStatus(value) {
  if (value === null || String(value).trim() === '') {
    return { message: 'status es requerido' };
  }

  var status = String(value).trim();

  if (CALL_STATUSES.indexOf(status) === -1) {
    return { message: 'status debe ser uno de: ' + CALL_STATUSES.join(', ') };
  }

  return { value: status };
}

function validateDateField(value, field) {
  if (value === null || String(value).trim() === '') {
    return { message: field + ' no puede estar vacio' };
  }

  if (Number.isNaN(Date.parse(value))) {
    return { message: field + ' debe ser una fecha valida' };
  }

  return { value: value };
}

async function validateEmployee(employeeId) {
  if (employeeId === undefined) {
    return {};
  }

  if (employeeId === null || !isUuid(employeeId)) {
    return { message: 'employeeId debe ser un UUID valido' };
  }

  var employee = await employees.findByPk(employeeId);

  if (!employee) {
    return { message: 'Empleado no encontrado' };
  }

  return { value: employeeId };
}

async function createcall(req, res) {
  try {
    var body = req.body || {};
    var unexpectedFields = getUnexpectedFields(body, CREATE_FIELDS);

    if (unexpectedFields.length > 0) {
      return res.status(400).json({ message: 'Campos no permitidos: ' + unexpectedFields.join(', ') });
    }

    var callerName = validateRequiredString(body, 'caller_name');
    if (callerName.message) return res.status(400).json({ message: callerName.message });

    var existingCall = await Calls.findOne({ where: { caller_name: callerName.value } });
    if (existingCall) {
      return res.status(409).json({ message: 'Ya existe una llamada con ese nombre' });
    }

    var callerPhone = validateRequiredString(body, 'caller_phone');
    if (callerPhone.message) return res.status(400).json({ message: callerPhone.message });

    var rankRequiredInput = validateRequiredString(body, 'rank_required');
    if (rankRequiredInput.message) return res.status(400).json({ message: rankRequiredInput.message });

    var rankRequired = validateRank(rankRequiredInput.value);
    if (rankRequired.message) return res.status(400).json({ message: rankRequired.message });

    if (!hasField(body, 'status')) {
      return res.status(400).json({ message: 'status es requerido' });
    }

    var status = validateStatus(body.status);
    if (status.message) return res.status(400).json({ message: status.message });

    var employee = await validateEmployee(body.employeeId);
    if (employee.message) return res.status(400).json({ message: employee.message });

    var now = new Date();
    var data = {
      caller_name: callerName.value,
      caller_phone: callerPhone.value,
      rank_required: rankRequired.value,
      status: status.value,
      started_at: now,
      finished_at: status.value === 'pending' ? null : now
    };

    if (employee.value !== undefined) {
      data.employeeId = employee.value;
    }

    var call = await Calls.create(data);

    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la llamada', error: error.message });
  }
}

async function getcalls(req, res) {
  try {
    var limit = req.query.limit === undefined ? 5 : Number(req.query.limit);
    var offset = req.query.offset === undefined ? 0 : Number(req.query.offset);

    if (!Number.isInteger(limit) || limit < 1) {
      return res.status(400).json({ message: 'limit debe ser mayor a 0' });
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({ message: 'offset no puede ser negativo' });
    }

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
    if (!isUuid(req.params.id)) {
      return res.status(400).json({ message: 'id debe ser un UUID valido' });
    }

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
    if (!isUuid(req.params.id)) {
      return res.status(400).json({ message: 'id debe ser un UUID valido' });
    }

    var body = req.body || {};
    var data = {};
    var unexpectedFields = getUnexpectedFields(body, UPDATE_FIELDS);

    if (unexpectedFields.length > 0) {
      return res.status(400).json({ message: 'Campos no permitidos: ' + unexpectedFields.join(', ') });
    }

    var call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ message: 'Llamada no encontrada' });
    }

    if (call.status === 'cancelled') {
      return res.status(409).json({ message: 'No se puede actualizar una llamada desactivada' });
    }

    var callerName = validateOptionalString(body, 'caller_name');
    if (callerName.message) return res.status(400).json({ message: callerName.message });

    if (callerName.value !== undefined) {
      var existingCall = await Calls.findOne({
        where: {
          caller_name: callerName.value,
          id: { [Op.ne]: req.params.id }
        }
      });

      if (existingCall) {
        return res.status(409).json({ message: 'Ya existe una llamada con ese nombre' });
      }

      data.caller_name = callerName.value;
    }

    var callerPhone = validateOptionalString(body, 'caller_phone');
    if (callerPhone.message) return res.status(400).json({ message: callerPhone.message });

    if (callerPhone.value !== undefined) {
      data.caller_phone = callerPhone.value;
    }

    var rankRequiredInput = validateOptionalString(body, 'rank_required');
    if (rankRequiredInput.message) return res.status(400).json({ message: rankRequiredInput.message });

    if (rankRequiredInput.value !== undefined) {
      var rankRequired = validateRank(rankRequiredInput.value);
      if (rankRequired.message) return res.status(400).json({ message: rankRequired.message });

      data.rank_required = rankRequired.value;
    }

    if (hasField(body, 'status')) {
      var status = validateStatus(body.status);
      if (status.message) return res.status(400).json({ message: status.message });

      data.status = status.value;
    }

    if (hasField(body, 'finished_at')) {
      var finishedAt = validateDateField(body.finished_at, 'finished_at');
      if (finishedAt.message) return res.status(400).json({ message: finishedAt.message });

      data.finished_at = finishedAt.value;
    }

    if (hasField(body, 'employeeId')) {
      var employee = await validateEmployee(body.employeeId);
      if (employee.message) return res.status(400).json({ message: employee.message });

      data.employeeId = employee.value;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }

    if ((data.status === 'completed' || data.status === 'cancelled') && data.finished_at === undefined && !call.finished_at) {
      data.finished_at = new Date();
    }

    await call.update(data);

    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la llamada', error: error.message });
  }
}

async function deletecall(req, res) {
  try {
    if (!isUuid(req.params.id)) {
      return res.status(400).json({ message: 'id debe ser un UUID valido' });
    }

    var call = await Calls.findByPk(req.params.id);

    if (!call) {
      return res.status(404).json({ message: 'Llamada no encontrada' });
    }

    if (call.status === 'cancelled') {
      return res.status(409).json({ message: 'La llamada ya esta desactivada' });
    }

    await call.update({
      status: 'cancelled',
      finished_at: call.finished_at || new Date()
    });

    res.status(200).json({ message: 'Llamada desactivada correctamente', call: call });
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar la llamada', error: error.message });
  }
}

module.exports = {
  createcall: createcall,
  getcalls: getcalls,
  getcallbyid: getcallbyid,
  putcall: putcall,
  deletecall: deletecall
};
