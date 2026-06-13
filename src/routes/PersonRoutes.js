const express = require('express');
const router = express.Router();
const PersonController = require('../controllers/PersonController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/details/:id', APIKeyMiddleware, PersonController.getPersonDetails);
router.get('/popular', APIKeyMiddleware, PersonController.getPopular);

module.exports = router;