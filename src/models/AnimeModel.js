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

  async searchAnime(query, orderBy = 'score', sort = 'desc', limit = 10) {
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
      const data = response.data.data;
      
      const formattedData = {
        id: data.mal_id,
        title: data.title,
        title_english: data.title_english,
        title_japanese: data.title_japanese,
        type: "Anime",
        image: {
          uri: data.images.jpg.large_image_url,
          small: data.images.jpg.small_image_url,
          medium: data.images.jpg.image_url
        },
        rating: data.score,
        year: data.year,
        description: data.synopsis,
        status: data.status,
        episodes: data.episodes,
        duration: data.duration,
        age_rating: data.rating,
        aired_from: data.aired.from,
        aired_to: data.aired.to,
        aired_string: data.aired.string,
        season: data.season,
        source: data.source,
        background: data.background,
        rank: data.rank,
        popularity: data.popularity,
        favorites: data.favorites,
        members: data.members,
        scored_by: data.scored_by,
        genres: data.genres.map(g => g.name),
        themes: data.themes.map(t => t.name),
        demographics: data.demographics.map(d => d.name),
        producers: data.producers.map(p => p.name),
        licensors: data.licensors.map(l => l.name),
        studios: data.studios.map(s => s.name),
        openings: data.theme.openings,
        endings: data.theme.endings,
        trailer: data.trailer.embed_url || data.trailer.url,
        relations: data.relations.map(rel => ({
          relation: rel.relation,
          entries: rel.entry.map(entry => ({
            id: entry.mal_id,
            title: entry.name,
            type: entry.type,
            url: entry.url
          }))
        }))
      };
      
      return {
        success: true,
        data: formattedData
      };
    });
  }

  async getEpisodes(id, page = 1, limit = 10) {
    const cacheKey = `anime_episodes:${id}:page:${page}:limit:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        limit: limit
      };
      
      const response = await axios.get(`${this.baseUrl}/anime/${id}/episodes`, { params });

      const filteredData = response.data.data.map(anime => ({
        id: anime.mal_id,
        title: anime.title,
        image: { uri: null },
        rating: anime.score,
        year: anime.aired.from ? new Date(anime.aired.from).getFullYear() : null,
        description: anime.title_romanji,
        type: "Anime"
      }));

      return {
        success: true,
        data: filteredData,
        pagination: response.data.pagination
      };
    });
  }

  async getAnimeEpisodeById(id, episode) {
    const cacheKey = `anime_episode:${id}:episode:${episode}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      try {
        const response = await axios.get(`${this.baseUrl}/anime/${id}/episodes/${episode}`);
        const anime = response.data.data;
        
        const filteredData = {
          id: anime.mal_id,
          title: anime.title,
          image: { uri: null },
          rating: anime.score || null,
          year: anime.aired ? new Date(anime.aired).getFullYear() : null,
          description: anime.title_romanji || anime.synopsis,
          type: "Anime",
          episode_number: episode
        };
        
        return {
          success: true,
          data: filteredData
        };
        
      } catch (error) {
        console.error(`Error fetching episode ${episode} for anime ${id}:`, error.message);
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
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