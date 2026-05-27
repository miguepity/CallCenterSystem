var express = require('express');
var router = express.Router();
var employeesController = require('../controllers/employeesController');

router.get('/', employeesController.getEmployees);


module.exports = router;