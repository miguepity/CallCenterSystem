var express = require('express');
var router = express.Router();
var queueController = require('../controllers/queueController');

router.get('/', queueController.getQueue);
//router.patch('/:id/priority', queueController.updatePriority);
//router.delete('/:id', queueController.deleteFromQueue);

module.exports = router;