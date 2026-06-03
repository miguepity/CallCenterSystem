const { employees } = require('../models');

const getEmployees = async (req, res) => {
  try {
    const where = {};

    if (req.query.is_available !== undefined) {
      where.is_available = req.query.is_available === 'true';
    }

    if (req.query.rank !== undefined) {
      where.rank = req.query.rank;
    }

    const allEmployees = await employees.findAll({ where });
    res.status(200).json(allEmployees);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleados', error });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await employees.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el empleado', error });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, rank, is_available } = req.body;

    const newEmployee = await employees.create({
      name,
      rank,
      is_available: is_available !== undefined ? is_available : true,
      created_at: new Date()
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear empleado', error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await employees.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await employee.update(req.body);
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar empleado', error: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const employee = await employees.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await employee.update({ is_available: req.body.is_available });
    res.status(200).json({ message: 'Disponibilidad actualizada', employee });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar disponibilidad', error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await employees.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const { Calls } = require('../models');
    const activeCall = await Calls.findOne({
      where: { employeeId: req.params.id, status: 'active' }
    });

    if (activeCall) {
      return res.status(400).json({ message: 'No se puede eliminar un empleado con una llamada activa' });
    }

    await employee.destroy();
    res.status(200).json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empleado', error });
  }
};

const getEmployeeCalls = async (req, res) => {
  try {
    const employee = await employees.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const { Calls } = require('../models');
    const { Op } = require('sequelize');
    const where = { employeeId: req.params.id };

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.from || req.query.to) {
      where.started_at = {};
      if (req.query.from) where.started_at[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.started_at[Op.lte] = new Date(req.query.to);
    }

    const calls = await Calls.findAll({ where, order: [['started_at', 'DESC']] });
    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};

const getEmployeeStats = async (req, res) => {
  try {
    const employee = await employees.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const { Calls } = require('../models');
    const allCalls = await Calls.findAll({ where: { employeeId: req.params.id } });

    const completed = allCalls.filter(c => c.status === 'completed');
    const avgDuration = completed.length
      ? completed.reduce((acc, c) => {
          const diff = new Date(c.finished_at) - new Date(c.started_at);
          return acc + diff / 60000;
        }, 0) / completed.length
      : 0;

    res.status(200).json({
      employee_id: employee.id,
      name: employee.name,
      total_calls: allCalls.length,
      completed_calls: completed.length,
      in_progress_calls: allCalls.filter(c => c.status === 'in_progress').length,
      pending_calls: allCalls.filter(c => c.status === 'pending').length,
      avg_duration_minutes: parseFloat(avgDuration.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateAvailability,
  deleteEmployee,
  getEmployeeCalls,
  getEmployeeStats
};