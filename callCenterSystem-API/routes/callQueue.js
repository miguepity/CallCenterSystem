const router = require('express').Router()

const {
    postCallQueue
} = require('../controllers/callQueues');

router.post('/call-queue', postCallQueue)

module.exports = router;
