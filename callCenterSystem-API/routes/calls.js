var express = require('express');
var router = express.Router();
var callsController = require('../controllers/callsController');

router.get('/', callsController.getCalls);

module.exports = router;