const router = require('express').Router()

const {
    postCallQueue,
    getCallQueue,
    putCallQueue,
} = require('../controllers/callQueues');

router.post('/call-queue', postCallQueue)

router.get('/call-queue/:queueId', getCallQueue)

router.put('/call-queue/:queueId', putCallQueue)

module.exports = router;
