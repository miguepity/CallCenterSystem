var express = require('express');
var router = express.Router();
var callsController = require('../controllers/calls');

router.post('/calls', callsController.createcall);
router.put('/calls/:id', callsController.putcall);

module.exports = router;
