var express = require('express');
var router = express.Router();
var callsController = require('../controllers/calls');

router.post('/calls', callsController.createcall);
router.get('/calls', callsController.getcalls);
router.get('/calls/:id', callsController.getcallbyid);

module.exports = router;
