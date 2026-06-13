const axios = require('axios');
const AnimeModel = require('../models/AnimeModel');
const { STATUS, ANIME } = require('../config/constants');

class AnimeController {
  async getAnime(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const validatedLimit = Math.min(Math.max(limit, 1), 100);

      const data = await AnimeModel.getAnime(validatedLimit);
      
      if (!data) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: 'No anime data found'
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
      
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch anime"
      });
    }
  }

  async getRandomAnime(req, res) {
    try {
      const data = await AnimeModel.getRandomAnime();
      
      if (!data) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: 'No random anime data found'
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
      
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch random anime"
      });
    }
  }

  async getDetails(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Anime ID is required'
        });
      }

      const data = await AnimeModel.getDetails(id);
      
      if (!data || !data.data) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `No anime found with ID: ${id}`
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.data
      });
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `Anime with ID ${req.params.id} not found`
        });
      }
      
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch anime details"
      });
    }
  }

  async getEpisodes(req, res) {
    try {
      const { id } = req.params;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 25;
      
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Anime ID is required'
        });
      }

      const data = await AnimeModel.getEpisodes(id, page, limit);
      
      if (!data || !data.data || data.data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `No episodes found for anime ID: ${id}`
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        anime_id: id,
        data: data.data,
        pagination: data.pagination
      });
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `Anime with ID ${req.params.id} not found`
        });
      }
      
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch episodes"
      });
    }
  }

  async getRecommendations(req, res) {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Anime ID is required'
        });
      }

      const data = await AnimeModel.getRecommendations(id, limit);
      
      if (!data || !data.data || data.data.length === 0) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `No recommendations found for anime ID: ${id}`
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.data,
        count: data.data.length
      });
      
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch recommendations"
      });
    }
  }

  async getStreaming(req, res) {
    try {
      const { id, episode } = req.params;
      
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Anime ID is required'
        });
      }

      const animeDetails = await AnimeModel.getDetails(id);
      
      if (!animeDetails || !animeDetails.data) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: `Anime with ID ${id} not found`
        });
      }

      const anime = animeDetails.data;
      const isMovie = anime.type?.toLowerCase() === 'movie';
      
      let streamingUrl;
      let episodeNumber;
      
      if (isMovie) {
        episodeNumber = 1;
        streamingUrl = `${ANIME.ANIME_STREAMING_URL}/${id}/1/sub`;
      } else {
        if (!episode) {
          return res.status(STATUS.BAD_REQUEST).json({
            success: false,
            message: 'Episode number is required for series'
          });
        }
        
        episodeNumber = parseInt(episode);
        streamingUrl = `${ANIME.ANIME_STREAMING_URL}/${id}/${episodeNumber}/sub`;
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: {
          anime_id: id,
          title: anime.title,
          type: anime.type,
          is_movie: isMovie,
          episode: episodeNumber,
          streaming_url: streamingUrl
        }
      });
      
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to generate streaming link"
      });
    }
  }
}

module.exports = new AnimeController();