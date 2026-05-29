var express = require('express');
var router = express.Router();
var callsController = require('../controllers/callsController');

router.get('/', callsController.getCalls);
router.get('/:id', callsController.getCallById);
router.put('/',callsController.updateCall);

module.exports = router;