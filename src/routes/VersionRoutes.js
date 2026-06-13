const express = require('express');
const router = express.Router();
const VersionController = require('../controllers/VersionController');

router.get('/version', VersionController.getLatestVersion);

module.exports = router;