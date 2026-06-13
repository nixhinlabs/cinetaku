const express = require('express');
const router = express.Router();
const AnimeController = require('../controllers/AnimeController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/', APIKeyMiddleware, AnimeController.getAnime);
router.get('/random', APIKeyMiddleware, AnimeController.getRandomAnime);
router.get('/details/:id', APIKeyMiddleware, AnimeController.getDetails);
router.get('/episodes/:id', APIKeyMiddleware, AnimeController.getEpisodes);
router.get('/recommendations/:id', APIKeyMiddleware, AnimeController.getRecommendations);
router.get('/streaming/:id/:episode', APIKeyMiddleware, AnimeController.getStreaming);

module.exports = router;