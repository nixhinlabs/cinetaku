const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/MovieController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/genres', APIKeyMiddleware, MovieController.getGenres);
router.get('/random', APIKeyMiddleware, MovieController.getRandom);
router.get('/popular', APIKeyMiddleware, MovieController.getPopular);
router.get('/discover', APIKeyMiddleware, MovieController.getDiscover);
router.get('/top-rated', APIKeyMiddleware, MovieController.getTopRated);
router.get('/trending', APIKeyMiddleware, MovieController.getTrending);
router.get('/details/:id', APIKeyMiddleware, MovieController.getDetails);

module.exports = router;