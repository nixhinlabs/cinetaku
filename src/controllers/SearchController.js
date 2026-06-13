const MovieModel = require('../models/MovieModel');
const ShowModel = require('../models/ShowModel');
const PersonModel = require('../models/PersonModel');
const MangaModel = require('../models/MangaModel');
const AnimeModel = require('../models/AnimeModel');
const { STATUS, PAGINATION } = require('../config/constants');

class SearchController {
  async searchMovie(req, res) {
    try {
      const query = req.query.query;
      const page = parseInt(req.query.page) || PAGINATION.PAGE;

      if (!query) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Query parameter is required'
        });
      }

      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await MovieModel.searchMovie(query, page);

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search movie"
      });
    }
  };

  async searchShow(req, res) {
    try {
      const query = req.query.query;
      const page = parseInt(req.query.page) || PAGINATION.PAGE;

      if (!query) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Query parameter is required'
        });
      }

      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await ShowModel.searchShow(query, page);

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search show"
      });
    }
  };

  async searchPerson(req, res) {
    try {
      const query = req.query.query;
      const page = parseInt(req.query.page) || PAGINATION.PAGE;

      if (!query) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Query parameter is required'
        });
      }

      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await PersonModel.searchPerson(query, page);

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search person"
      });
    }
  };

  async searchMulti(req, res) {
    try {
      const query = req.query.query;
      const page = parseInt(req.query.page) || PAGINATION.PAGE;

      if (!query) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Query parameter is required'
        });
      }

      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await PersonModel.searchMulti(query, page);

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search multi"
      });
    }
  }

  async searchManga(req, res) {
    try {
      const { title } = req.query;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;
      
      if (!title) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: "Title query parameter is required"
        });
      }
      
      const data = await MangaModel.searchManga(title, limit, offset);

      if (!data.success) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: data.error || "No manga found"
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.data,
        pagination: data.pagination
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search manga"
      });
    }
  }

  async searchAnime(req, res) {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Search query parameter is required'
        });
      }

      const orderBy = req.query.order_by || 'score';
      const sort = req.query.sort || 'desc';
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;

      const data = await AnimeModel.searchAnime(query, orderBy, sort, limit);
      
      if (!data || !data.data || data.data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `No anime found.`
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        query: query,
        count: data.data.length,
        data: data.data,
        pagination: data.pagination
      });
      
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to search anime"
      });
    }
  }
};

module.exports = new SearchController();