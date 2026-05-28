'use strict';

var express = require('express');
var router = express.Router();
var queueController = require('../controllers/queueController');

router.get('/', queueController.getQueue);
router.get('/:id', queueController.getQueueEntry);
router.post('/enqueue', queueController.enqueue);
router.delete('/:id', queueController.removeFromQueue);
router.post('/dispatch', queueController.dispatch);
router.post('/escalate/:id', queueController.escalate);

module.exports = router;