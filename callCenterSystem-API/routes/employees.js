var express = require('express');
var router = express.Router();
var employeesController = require('../controllers/employeesController');

router.get('/', employeesController.getEmployees);
router.get('/:id', employeesController.getEmployeeById);
router.post('/', employeesController.createEmployee);
router.delete('/:id', employeesController.deleteEmployee);
router.put('/:id', employeesController.updateEmployee);
router.patch('/:id/availability', employeesController.updateAvailability);
router.get('/:id/calls', employeesController.getEmployeeCalls);
router.get('/:id/stats', employeesController.getEmployeeStats);


module.exports = router;