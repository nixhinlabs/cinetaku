const express = require('express');
const router = express.Router();
const ShowController = require('../controllers/ShowController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/genres', APIKeyMiddleware, ShowController.getGenres);
router.get('/random', APIKeyMiddleware, ShowController.getRandom);
router.get('/popular', APIKeyMiddleware, ShowController.getPopular);
router.get('/discover', APIKeyMiddleware, ShowController.getDiscover);
router.get('/top-rated', APIKeyMiddleware, ShowController.getTopRated);
router.get('/trending', APIKeyMiddleware, ShowController.getTrending);
router.get('/on-air', APIKeyMiddleware, ShowController.getOnAir);
router.get('/airing-today', APIKeyMiddleware, ShowController.getAiringToday);
router.get('/details/:id', APIKeyMiddleware, ShowController.getDetails);

module.exports = router;