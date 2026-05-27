var express = require('express');
var router = express.Router();
var employeesController = require('../controllers/employeesController');

router.get('/', employeesController.getEmployees);
router.get('/:id', employeesController.getEmployeeById);


module.exports = router;