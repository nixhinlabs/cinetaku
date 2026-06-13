const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/SearchController');
const APIKeyMiddleware = require('../middlewares/APIKeyMiddleware');

router.get('/movie', APIKeyMiddleware, SearchController.searchMovie);
router.get('/show', APIKeyMiddleware, SearchController.searchShow);
router.get('/person', APIKeyMiddleware, SearchController.searchPerson);
router.get('/multi', APIKeyMiddleware, SearchController.searchMulti);
router.get('/manga', APIKeyMiddleware, SearchController.searchManga);
router.get('/anime', APIKeyMiddleware, SearchController.searchAnime);

module.exports = router;