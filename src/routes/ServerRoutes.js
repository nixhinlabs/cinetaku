const express = require('express');
const router = express.Router();
const ServerController = require('../controllers/ServerController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/servers', APIKeyMiddleware, ServerController.getServers);

module.exports = router;