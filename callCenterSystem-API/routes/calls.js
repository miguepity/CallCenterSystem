var express = require('express');
var router = express.Router();
var callsController = require('../controllers/callsController');

router.get('/', callsController.getCalls);
router.get('/:id', callsController.getCallById);
router.put('/:id',callsController.updateCall);
router.post('/', callsController.createCall);
router.delete('/:id', callsController.deleteCall);
router.patch('/:id', callsController.patchCall);
router.post('/:id/escalate', callsController.escalateCall);
router.post('/:id/finish', callsController.finishCall);
router.post('/:id/assign', callsController.assignAgent);
router.post('/:id/dispatch', callsController.dispatchCall);

module.exports = router;