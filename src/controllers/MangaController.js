const axios = require('axios');
const MangaModel = require('../models/MangaModel');
const { STATUS, GENERAL } = require('../config/constants');

class MangaController {
  async getManga(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const data = await MangaModel.getManga(limit, offset);

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch manga"
      });
    }
  }

  async getRandomManga(req, res) {
    try {
      const data = await MangaModel.getRandomManga();

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch random manga"
      });
    }
  }

  async getMangaDetails(req, res) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;
      
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: "Manga ID is required"
        });
      }
      
      const data = await MangaModel.getMangaDetails(id, limit, offset);

      if (!data.success) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: data.error || "Manga not found"
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch manga details"
      });
    }
  }

  async getMangaCover(req, res) {
    try {
      const { id } = req.params;
      const quality = req.query.quality === 'original' ? 'data' : 'dataSaver';
      
      if (!id) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: "Chapter ID is required"
        });
      }
      
      const data = await MangaModel.getMangaCover(id, quality);

      if (!data.success) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: data.error || "Chapter images not found"
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.data
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch chapter images"
      });
    }
  }

  async getImageProxy(req, res) {
    try {
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      const response = await axios.get(url, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'MangaDexApp/1.0',
          'Referer': 'https://mangadex.org/'
        }
      });

      res.setHeader('Content-Type', response.headers['content-type']);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      response.data.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  }
};

module.exports = new MangaController();