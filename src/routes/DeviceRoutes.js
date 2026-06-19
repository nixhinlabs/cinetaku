const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/DeviceController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.post('/', APIKeyMiddleware, DeviceController.create);
router.get('/info/:androidId', APIKeyMiddleware, DeviceController.getByAndroidId);
router.get('/all', DeviceController.getTotal)

module.exports = router;
