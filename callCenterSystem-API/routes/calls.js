const express = require('express');
const router = express.Router();
const callsController = require('../controllers/callsController');
 
router.get('/', callsController.getCalls);

module.exports = router;