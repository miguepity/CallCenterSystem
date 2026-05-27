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

module.exports = { 
  getEmployees,
  getEmployeeById

 };