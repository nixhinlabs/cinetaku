const axios = require('axios');
const CacheService = require('../services/CacheService');
const { ANIME } = require('../config/constants');

class AnimeModel {
  constructor() {
    this.anilistUrl = 'https://graphql.anilist.co';
    this.jikanUrl = ANIME.ANIME_API_BASE_URL;
    this.lastRequestTime = 0;
    this.minDelay = 200;
  }

  async _delayIfNeeded() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minDelay - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  async _graphqlRequest(query, variables = {}) {
    await this._delayIfNeeded();
    
    try {
      const response = await axios.post(this.anilistUrl, {
        query,
        variables
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data;
    } catch (error) {
      console.error('GraphQL request failed:', error.message);
      throw error;
    }
  }

  async _fetchFromAniList(limit = 10, filters = {}) {
    const query = `
      query($limit: Int, $search: String, $id: Int, $genre: String) {
        Page(perPage: $limit) {
          media(
            ${filters.id ? `id: $id` : ''}
            ${filters.search ? `search: $search` : ''}
            sort: ${filters.sort || 'SCORE_DESC'}
            type: ANIME
            status_not: NOT_YET_RELEASED
            ${filters.genre ? `genre: $genre` : ''}
          ) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              extraLarge
            }
            bannerImage
            averageScore
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
            description
            status
            episodes
            duration
            genres
            studios {
              edges {
                node {
                  name
                }
                isMain
              }
            }
            trailer {
              site
              id
              thumbnail
            }
            rankings {
              rank
              type
              allTime
            }
            staff {
              edges {
                node {
                  name {
                    full
                  }
                }
                role
              }
            }
            characters {
              edges {
                node {
                  name {
                    full
                  }
                }
              }
            }
            relations {
              edges {
                relationType
                node {
                  id
                  title {
                    romaji
                    english
                  }
                  type
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      limit: Math.min(limit, 50),
      ...filters
    };

    const response = await this._graphqlRequest(query, variables);
    return response.data.Page.media;
  }

  async _formatAniListData(anime) {
    return {
      id: anime.id,
      title: anime.title.english || anime.title.romaji || anime.title.native,
      title_english: anime.title.english,
      title_japanese: anime.title.native,
      type: "Anime",
      image: {
        uri: anime.coverImage?.extraLarge || anime.coverImage?.large,
        small: anime.coverImage?.large,
        medium: anime.coverImage?.large
      },
      banner: anime.bannerImage,
      rating: anime.averageScore ? anime.averageScore / 10 : null,
      year: anime.startDate?.year,
      description: anime.description ? anime.description.replace(/<[^>]*>/g, '') : '',
      status: anime.status,
      episodes: anime.episodes,
      duration: anime.duration,
      genres: anime.genres || [],
      studios: anime.studios?.edges?.filter(e => e.isMain).map(e => e.node.name) || [],
      trailer: anime.trailer?.id ? `https://www.youtube.com/watch?v=${anime.trailer.id}` : null,
      rank: anime.rankings?.find(r => r.allTime)?.rank || null,
      staff: anime.staff?.edges?.map(e => ({
        name: e.node.name.full,
        role: e.role
      })) || [],
      characters: anime.characters?.edges?.map(e => e.node.name.full) || [],
      relations: anime.relations?.edges?.map(e => ({
        relation: e.relationType,
        entries: [{
          id: e.node.id,
          title: e.node.title.english || e.node.title.romaji,
          type: e.node.type
        }]
      })) || []
    };
  }

  async getAnime(limit = 10) {
    const cacheKey = `anime_data:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const media = await this._fetchFromAniList(limit);
      const filteredData = media.map(anime => ({
        id: anime.id,
        title: anime.title.english || anime.title.romaji || anime.title.native,
        image: { uri: anime.coverImage?.extraLarge || anime.coverImage?.large },
        rating: anime.averageScore ? anime.averageScore / 10 : null,
        year: anime.startDate?.year,
        description: anime.description ? anime.description.replace(/<[^>]*>/g, '') : '',
        type: "Anime"
      }));

      return {
        success: true,
        data: filteredData,
        source: 'anilist'
      };
    });
  }

  async getRandomAnime() {
    const cacheKey = 'anime_random_data';
    
    return CacheService.getOrSet(cacheKey, async () => {
      // Get a random page
      const randomPage = Math.floor(Math.random() * 100) + 1;
      const query = `
        query($page: Int) {
          Page(perPage: 1, page: $page) {
            media(type: ANIME, status_not: NOT_YET_RELEASED) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                extraLarge
                large
              }
              averageScore
              startDate { year }
              description
              status
              episodes
              genres
            }
          }
        }
      `;

      const response = await this._graphqlRequest(query, { page: randomPage });
      const anime = response.data.Page.media[0];

      if (!anime) {
        throw new Error('No random anime found');
      }

      const filteredData = {
        id: anime.id,
        title: anime.title.english || anime.title.romaji || anime.title.native,
        image: { uri: anime.coverImage?.extraLarge || anime.coverImage?.large },
        rating: anime.averageScore ? anime.averageScore / 10 : null,
        year: anime.startDate?.year,
        description: anime.description ? anime.description.replace(/<[^>]*>/g, '') : '',
        type: "Anime"
      };

      return {
        success: true,
        data: filteredData,
        source: 'anilist'
      };
    });
  }

  async searchAnime(query, orderBy = 'SCORE_DESC', sort = 'desc', limit = 10) {
    const cacheKey = `search_anime:${query}:${orderBy}:${sort}:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const media = await this._fetchFromAniList(limit, { 
        search: query,
        sort: orderBy
      });

      const filteredData = media.map(anime => ({
        id: anime.id,
        title: anime.title.english || anime.title.romaji || anime.title.native,
        image: { uri: anime.coverImage?.extraLarge || anime.coverImage?.large },
        rating: anime.averageScore ? anime.averageScore / 10 : null,
        year: anime.startDate?.year,
        description: anime.description ? anime.description.replace(/<[^>]*>/g, '') : '',
        type: "Anime"
      }));

      return {
        success: true,
        data: filteredData,
        source: 'anilist'
      };
    });
  }

  async getDetails(id) {
    const cacheKey = `anime_details:${id}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const media = await this._fetchFromAniList(1, { id: parseInt(id) });
      
      if (!media || media.length === 0) {
        return {
          success: false,
          data: null,
          message: `Anime with ID ${id} not found`
        };
      }

      const formattedData = await this._formatAniListData(media[0]);

      return {
        success: true,
        data: formattedData,
        source: 'anilist'
      };
    });
  }

  async getEpisodes(id, page = 1, limit = 10) {
    const cacheKey = `anime_episodes:${id}:page:${page}:limit:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const query = `
        query($id: Int, $page: Int, $perPage: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
            episodes
            streamingEpisodes {
              title
              thumbnail
              url
              site
            }
            airingSchedule(perPage: $perPage, page: $page) {
              nodes {
                episode
                airingAt
                timeUntilAiring
              }
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
            }
          }
        }
      `;

      const response = await this._graphqlRequest(query, {
        id: parseInt(id),
        page: parseInt(page),
        perPage: Math.min(parseInt(limit), 50)
      });

      const anime = response.data.Media;
      if (!anime) {
        return {
          success: false,
          data: [],
          message: `Anime with ID ${id} not found`
        };
      }

      const episodes = anime.airingSchedule?.nodes?.map(node => ({
        id: node.episode,
        title: `Episode ${node.episode}`,
        episode_number: node.episode,
        airing_at: node.airingAt,
        time_until_airing: node.timeUntilAiring,
        streaming: anime.streamingEpisodes?.find(s => s.title?.includes(`Episode ${node.episode}`))
      })) || [];

      return {
        success: true,
        data: episodes,
        pagination: {
          current_page: anime.airingSchedule?.pageInfo?.currentPage || page,
          last_visible_page: anime.airingSchedule?.pageInfo?.lastPage || 1,
          has_next_page: anime.airingSchedule?.pageInfo?.hasNextPage || false,
          items: {
            count: episodes.length,
            total: anime.episodes || episodes.length,
            per_page: limit
          }
        },
        source: 'anilist'
      };
    });
  }

  async getAnimeEpisodeById(id, episode) {
    const cacheKey = `anime_episode:${id}:episode:${episode}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const query = `
        query($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
            streamingEpisodes {
              title
              thumbnail
              url
              site
            }
          }
        }
      `;

      const response = await this._graphqlRequest(query, {
        id: parseInt(id)
      });

      const anime = response.data.Media;
      if (!anime) {
        return {
          success: false,
          data: null,
          message: `Anime with ID ${id} not found`
        };
      }

      const streamingEpisode = anime.streamingEpisodes?.find(
        s => s.title?.includes(`Episode ${episode}`) || s.title?.includes(`Ep. ${episode}`)
      );

      if (!streamingEpisode) {
        return {
          success: false,
          data: null,
          message: `Episode ${episode} not found for anime ID: ${id}`
        };
      }

      const filteredData = {
        id: anime.id,
        title: anime.title.english || anime.title.romaji,
        episode_number: parseInt(episode),
        image: { uri: streamingEpisode?.thumbnail || null },
        description: streamingEpisode?.title || `Episode ${episode}`,
        streaming_url: streamingEpisode?.url || null,
        streaming_site: streamingEpisode?.site || null,
        type: "Anime"
      };

      return {
        success: true,
        data: filteredData,
        source: 'anilist'
      };
    });
  }

  async getRecommendations(id, limit = 10) {
    const cacheKey = `anime_recommendations:${id}:${limit}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const query = `
        query($id: Int, $limit: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
            }
            recommendations(perPage: $limit) {
              nodes {
                mediaRecommendation {
                  id
                  title {
                    romaji
                    english
                  }
                  coverImage {
                    large
                  }
                  averageScore
                  startDate { year }
                  genres
                  type
                }
              }
            }
          }
        }
      `;

      const response = await this._graphqlRequest(query, {
        id: parseInt(id),
        limit: Math.min(parseInt(limit), 50)
      });

      const anime = response.data.Media;
      if (!anime) {
        return {
          success: false,
          data: [],
          message: `Anime with ID ${id} not found`
        };
      }

      const recommendations = anime.recommendations?.nodes?.map(node => ({
        id: node.mediaRecommendation.id,
        title: node.mediaRecommendation.title.english || node.mediaRecommendation.title.romaji,
        image: { uri: node.mediaRecommendation.coverImage?.large },
        rating: node.mediaRecommendation.averageScore ? node.mediaRecommendation.averageScore / 10 : null,
        year: node.mediaRecommendation.startDate?.year,
        genres: node.mediaRecommendation.genres || [],
        type: node.mediaRecommendation.type
      })) || [];

      return {
        success: true,
        data: recommendations,
        count: recommendations.length,
        source: 'anilist'
      };
    });
  }
}

module.exports = new AnimeModel();
