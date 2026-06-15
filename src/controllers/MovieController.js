const MovieModel = require('../models/MovieModel');
const { STATUS, PAGINATION } = require('../config/constants');

class MovieController {
  async getGenres(req, res) {
    try {
      const data = await MovieModel.getGenre();
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.genres
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch movie genres"
      });
    }
  }

  async getRandom(req, res) {
    try {
      const data = await MovieModel.getRandom();
      
      if (!data) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: "No movies found"
        });
      }
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch random movie"
      });
    }
  }

  async getPopular(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.PAGE;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await MovieModel.getPopular(page);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.results,
        pagination: {
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
          limit: PAGINATION.LIMIT
        }
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch popular movies"
      });
    }
  }

  async getDiscover(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.PAGE;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await MovieModel.getDiscover(page);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.results,
        pagination: {
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
          limit: PAGINATION.LIMIT
        }
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch discover movies"
      });
    }
  }

  async getTopRated(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.PAGE;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await MovieModel.getTopRated(page);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.results,
        pagination: {
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
          limit: PAGINATION.LIMIT
        }
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch top rated movies"
      });
    }
  }

  async getTrending(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.PAGE;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await MovieModel.getTrending(page);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.results,
        pagination: {
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
          limit: PAGINATION.LIMIT
        }
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch trending movies"
      });
    }
  }

  async getDetails(req, res) {
    try {
      const movieId = parseInt(req.params.id);

      if (!movieId || movieId < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Valid movie ID is required'
        });
      }

      const data = await MovieModel.getDetails(movieId);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch movie details"
      });
    }
  }
}

module.exports = new MovieController();