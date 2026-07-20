const express = require('express');
const router = express.Router();
const AnimeController = require('../controllers/AnimeController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/', AnimeController.getAnime);
router.get('/random', AnimeController.getRandomAnime);
router.get('/details/:id', AnimeController.getDetails);
router.get('/episodes/:id', AnimeController.getEpisodes);
router.get('/episodes/:id/:episode', AnimeController.getAnimeEpisodeById);
router.get('/recommendations/:id', AnimeController.getRecommendations);
router.get('/streaming/:id/:episode', AnimeController.getStreaming);

module.exports = router;
