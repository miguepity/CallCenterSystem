var express = require('express');
var router = express.Router();
var callsController = require('../controllers/calls');

router.post('/calls', callsController.createcall);

module.exports = router;
