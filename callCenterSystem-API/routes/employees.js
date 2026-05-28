var express = require('express');
var router = express.Router();
var employeesController = require('../controllers/employeesController');

router.get('/', employeesController.getEmployees);
router.get('/:id', employeesController.getEmployeeById);
router.post('/', employeesController.createEmployee);
//router.delete('/:id', employeesController.deleteEmployee);


module.exports = router;