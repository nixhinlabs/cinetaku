const TMDBClient = require('../utils/TMDBClient');
const CacheService = require('../services/CacheService');
const { TMDB } = require('../config/constants');

class ShowModel {
  static async getGenre() {
    return CacheService.getOrSet('show_genres', async () => {
      const params = { language: 'en-US' };
      const data = await TMDBClient.get('/genre/tv/list', params);

      data.genres = data.genres.map(genre => ({
        id: genre.id,
        name: genre.name
      }));
      
      return data;
    });
  }

  static async getRandom() {
    const cacheKey = 'show_random';
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        language: 'en-US'
      };

      const data = await TMDBClient.get('/trending/tv/day', params);
      
      if (!data.results || data.results.length === 0) {
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomShow = data.results[randomIndex];
      
      const formattedShow = {
        id: String(randomShow.id),
        title: randomShow.name,
        image: { uri: randomShow.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${randomShow.poster_path}` : null },
        rating: randomShow.vote_average,
        year: randomShow.first_air_date ? new Date(randomShow.first_air_date).getFullYear() : null,
        description: randomShow.overview,
        type: "TV Show"
      };
      
      return formattedShow;
    });
  }

  static async getPopular(page = 1) {
    const cacheKey = `show_popular_${page}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/tv/popular', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));
      
      return data;
    });
  }

  static async getDiscover(page = 1) {
    const cacheKey = `show_discover_${page}`;
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/discover/tv', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));

      return data;
    });
  }

  static async getTopRated(page = 1) {
    const cacheKey = `show_top_rated_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/tv/top_rated', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));

      return data;
    });
  }

  static async getTrending(page = 1) {
    const cacheKey = `show_trending_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/trending/tv/week', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));

      return data;
    });
  }

  static async getOnAir(page = 1) {
    const cacheKey = `show_on_air_${page}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/tv/on_the_air', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));
      
      return data;
    });
  }

  static async getAiringToday(page = 1) {
    const cacheKey = `show_airing_today_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/tv/airing_today', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));

      return data;
    });
  }

  static async getDetails(showId) {
    const cacheKey = `show_details_${showId}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        language: 'en-US',
        append_to_response: 'credits,similar,videos,reviews'
      };

      const data = await TMDBClient.get(`/tv/${showId}`, params);
      
      // Fetch episodes for each season
      const seasonsWithEpisodes = await Promise.all(
        data.seasons.map(async (season) => {
          try {
            const seasonData = await TMDBClient.get(`/tv/${showId}/season/${season.season_number}`, {
              language: 'en-US'
            });
            
            return {
              season_number: season.season_number,
              name: season.name,
              episode_count: season.episode_count,
              release_date: season.air_date,
              poster_path: season.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${season.poster_path}` : null,
              overview: season.overview,
              episodes: seasonData.episodes.map(episode => ({
                id: episode.id,
                episode_number: episode.episode_number,
                name: episode.name,
                overview: episode.overview,
                release_date: episode.air_date,
                runtime: episode.runtime,
                still_path: episode.still_path ? `${TMDB.TMDB_BACKDROP_BASE_URL}${episode.still_path}` : null,
                vote_average: episode.vote_average,
                vote_count: episode.vote_count
              }))
            };
          } catch (error) {
            console.error(`Error fetching season ${season.season_number}:`, error);
            return {
              season_number: season.season_number,
              name: season.name,
              episode_count: season.episode_count,
              release_date: season.air_date,
              poster_path: season.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${season.poster_path}` : null,
              overview: season.overview,
              episodes: []
            };
          }
        })
      );

      const formattedShow = {
        id: data.id,
        title: data.name,
        image: { uri: data.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${data.poster_path}` : null },
        rating: data.vote_average,
        year: data.first_air_date ? new Date(data.first_air_date).getFullYear() : null,
        description: data.overview,
        type: "TV Show",
        backdrop_path: data.backdrop_path ? `${TMDB.TMDB_BACKDROP_BASE_URL}${data.backdrop_path}` : null,
        original_language: data.original_language,
        release_date: data.first_air_date,
        vote_count: data.vote_count,
        number_of_seasons: data.number_of_seasons,
        number_of_episodes: data.number_of_episodes,
        status: data.status,
        tagline: data.tagline,

        // Seasons with episodes
        seasons: seasonsWithEpisodes,

        // Cast
        cast: data.credits && data.credits.cast
          ? data.credits.cast.map(member => ({
            id: member.id,
            name: member.name,
            character: member.character,
            profile_path: member.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${member.profile_path}` : null,
            order: member.order
          })) : [],

        // Similar
        similar: data.similar && data.similar.results
          ? data.similar.results.map(show => ({
            id: show.id,
            title: show.name,
            overview: show.overview,
            poster_path: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null,
            release_date: show.first_air_date,
            vote_average: show.vote_average,
            vote_count: show.vote_count
          })) : [],
      };

      return formattedShow;
    });
  }

  static async searchShow(query, page = 1) {
    const cacheKey = `show_search_${query}_${page}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        query: query,
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/search/tv', params);

      data.results = data.results.map(show => ({
        id: String(show.id),
        title: show.name,
        image: { uri: show.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${show.poster_path}` : null },
        rating: show.vote_average,
        year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
        description: show.overview,
        type: "TV Show"
      }));

      return data;
    });
  }
}

module.exports = ShowModel;