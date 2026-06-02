const router = require('express').Router()

const {
    postCallQueue,
    getCallQueue,
    putCallQueue,
    deleteCallQueue
} = require('../controllers/callQueues');

router.post('/call-queue', postCallQueue)

router.get('/call-queue/:queueId', getCallQueue)

router.put('/call-queue/:queueId', putCallQueue)

router.delete('/call-queue', deleteCallQueue)

module.exports = router;
