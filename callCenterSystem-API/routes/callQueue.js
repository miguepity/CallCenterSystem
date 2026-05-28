const router = require('express').Router()

const {
    postCallQueue,
    putCallQueue
} = require('../controllers/callQueues');

router.post('/call-queue', postCallQueue)

router.put('/call-queue', putCallQueue)

module.exports = router;
