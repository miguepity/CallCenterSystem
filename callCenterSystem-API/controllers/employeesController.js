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
    const { name, rank, is_available} = req.body;

    const newEmployee = await employees.create({
      name,
      rank,
      is_available: is_available !== undefined ? is_available : true,
      created_at: new Date()
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear empleado', error:error.message });
  }
};
/*
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
*/
module.exports = { 
  getEmployees,
 getEmployeeById,
  createEmployee,
  //deleteEmployee

 };