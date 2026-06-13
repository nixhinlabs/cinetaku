const express = require('express');
const router = express.Router();
const MangaController = require('../controllers/MangaController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/', APIKeyMiddleware, MangaController.getManga);
router.get('/random', APIKeyMiddleware, MangaController.getRandomManga);
router.get('/details/:id', APIKeyMiddleware, MangaController.getMangaDetails);
router.get('/cover/:id', APIKeyMiddleware, MangaController.getMangaCover);
router.get('/image-proxy', APIKeyMiddleware, MangaController.getImageProxy);

module.exports = router;