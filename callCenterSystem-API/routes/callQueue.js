const router = require('express').Router()

const {
    postCallQueue,
    getCallQueue
} = require('../controllers/callQueues');

router.post('/call-queue', postCallQueue)

router.get('/call-queue', getCallQueue)

module.exports = router;
