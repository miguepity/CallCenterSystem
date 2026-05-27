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

module.exports = { getEmployees };