'use strict';

var express = require('express');
var router = express.Router();
var queueController = require('../controllers/queueController');

router.get('/', queueController.getQueue);
router.post('/enqueue', queueController.enqueue);
router.post('/dispatch', queueController.dispatch);
router.get('/:id', queueController.getQueueEntry);
router.delete('/:id', queueController.removeFromQueue);
router.post('/escalate/:id', queueController.escalate);

module.exports = router;