const axios = require('axios');
const CacheService = require('../services/CacheService');
const { ANIME } = require('../config/constants');

class AnimeModel {
  constructor() {
    this.baseUrl = ANIME.ANIME_API_BASE_URL;
  }

  async getAnime(limit = 10) {
    const cacheKey = `anime_data:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        order_by: 'score',
        sort: 'desc',
        limit: Math.min(limit, 100),
      };
      const response = await axios.get(`${this.baseUrl}/anime`, { params });

      const filteredData = response.data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        image: { uri: anime.images.jpg.image_url },
        rating: anime.score,
        year: anime.aired.from ? new Date(anime.aired.from).getFullYear() : null,
        description: anime.synopsis,
        type: "Anime"
      }));

      return {
        success: true,
        data: filteredData
      };
    });
  }

  async getRandomAnime() {
    const cacheKey = 'anime_random_data';
    
    return CacheService.getOrSet(cacheKey, async () => {
      const response = await axios.get(`${this.baseUrl}/random/anime`);
      
      const anime = response.data.data;
      
      const filteredData = {
        id: anime.mal_id,
        title: anime.title,
        image: { uri: anime.images.jpg.image_url },
        rating: anime.score,
        year: anime.aired.from ? new Date(anime.aired.from).getFullYear() : null,
        description: anime.synopsis,
        type: "Anime"
      };

      return {
        success: true,
        data: filteredData
      };
    });
  }

  async searchAnime(query, orderBy = 'score', sort = 'desc', limit = 20) {
    const cacheKey = `search_anime:${query}:${orderBy}:${sort}:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        q: query,
        order_by: orderBy,
        sort: sort,
        limit: limit
      };
      
      const response = await axios.get(`${this.baseUrl}/anime`, { params });

      const filteredData = response.data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        image: { uri: anime.images.jpg.image_url },
        rating: anime.score,
        year: anime.aired.from ? new Date(anime.aired.from).getFullYear() : null,
        description: anime.synopsis,
        type: "Anime"
      }));

      return {
        success: true,
        data: filteredData
      };
    });
  }

  async getDetails(id) {
    const cacheKey = `anime_details:${id}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const response = await axios.get(`${this.baseUrl}/anime/${id}/full`);
      return response.data;
    });
  }

  async getEpisodes(id, page = 1, limit = 25) {
    const cacheKey = `anime_episodes:${id}:page:${page}:limit:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        limit: limit
      };
      
      const response = await axios.get(`${this.baseUrl}/anime/${id}/episodes`, { params });
      return response.data;
    });
  }

  async getRecommendations(id, limit = 10) {
    const cacheKey = `anime_recommendations:${id}:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const response = await axios.get(`${this.baseUrl}/anime/${id}/recommendations`);
      
      if (response.data.data && limit) {
        response.data.data = response.data.data.slice(0, limit);
      }
      
      return response.data;
    });
  }
}

module.exports = new AnimeModel();