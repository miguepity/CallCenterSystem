const router = require('express').Router()

const {
    postCallQueue,
    getCallQueue,
    putCallQueue,
} = require('../controllers/callQueues');

router.post('/call-queue', postCallQueue)

router.get('/call-queue', getCallQueue)

router.put('/call-queue', putCallQueue)

module.exports = router;
