const ShowModel = require('../models/ShowModel');
const { STATUS, PAGINATION } = require('../config/constants');

class ShowController {
  async getGenres(req, res) {
    try {
      const data = await ShowModel.getGenre();
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.genres
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch show genres"
      });
    }
  }

  async getRandom(req, res) {
    try {
      const data = await ShowModel.getRandom();
      
      if (!data) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: "No show found"
        });
      }
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch random show"
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

      const data = await ShowModel.getPopular(page);
      
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
        message: "Failed to fetch popular shows"
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

      const data = await ShowModel.getDiscover(page);
      
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
        message: "Failed to fetch discover shows"
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

      const data = await ShowModel.getTopRated(page);
      
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
        message: "Failed to fetch top rated shows"
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

      const data = await ShowModel.getTrending(page);
      
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
        message: "Failed to fetch trending shows"
      });
    }
  }

  async getOnAir(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.PAGE;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await ShowModel.getOnAir(page);
      
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
        message: "Failed to fetch on-air shows"
      });
    }
  }

  async getAiringToday(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.PAGE;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await ShowModel.getAiringToday(page);
      
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
        message: "Failed to fetch airing today shows"
      });
    }
  }

  async getDetails(req, res) {
    try {
      const showId = parseInt(req.params.id);

      if (!showId || showId < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Valid show ID is required'
        });
      }

      const data = await ShowModel.getDetails(showId);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch show details"
      });
    }
  }
}

module.exports = new ShowController();