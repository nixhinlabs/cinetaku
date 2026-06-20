const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');

router.get('/', ReviewController.getReviews);

module.exports = router;
