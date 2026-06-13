const TMDBClient = require('../utils/TMDBClient');
const CacheService = require('../services/CacheService');
const { TMDB } = require('../config/constants');

class MovieModel {
  static async getGenre() {
    return CacheService.getOrSet('movie_genres', async () => {
      const params = { language: 'en-US' };
      const data = await TMDBClient.get('/genre/movie/list', params);

      data.genres = data.genres.map(genre => ({
        id: genre.id,
        name: genre.name
      }));
      
      return data;
    });
  }

  static async getRandom() {
    const cacheKey = 'movie_random';
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        language: 'en-US'
      };

      const data = await TMDBClient.get('/trending/movie/day', params);
      
      if (!data.results || data.results.length === 0) {
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomMovie = data.results[randomIndex];
      
      const formattedMovie = {
        id: randomMovie.id,
        title: randomMovie.title,
        image: { uri: randomMovie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${randomMovie.poster_path}` : null },
        rating: randomMovie.vote_average,
        year: randomMovie.release_date ? new Date(randomMovie.release_date).getFullYear() : null,
        description: randomMovie.overview,
        type: "Movie"
      };
      
      return formattedMovie;
    });
  }
  
  static async getPopular(page = 1) {
    const cacheKey = `movie_popular_${page}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/movie/popular', params);

      data.results = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: { uri: movie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${movie.poster_path}` : null },
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        description: movie.overview,
        type: "Movie"
      }));
      
      return data;
    });
  }

  static async getDiscover(page = 1) {
    const cacheKey = `movie_discover_${page}`;
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/discover/movie', params);

      data.results = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: { uri: movie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${movie.poster_path}` : null },
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        description: movie.overview,
        type: "Movie"
      }));

      return data;
    });
  }

  static async getTopRated(page = 1) {
    const cacheKey = `movie_top_rated_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/movie/top_rated', params);

      data.results = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: { uri: movie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${movie.poster_path}` : null },
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        description: movie.overview,
        type: "Movie"
      }));

      return data;
    });
  }

  static async getTrending(page = 1) {
    const cacheKey = `movie_trending_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/trending/movie/week', params);

      data.results = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: { uri: movie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${movie.poster_path}` : null },
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        description: movie.overview,
        type: "Movie"
      }));

      return data;
    });
  }

  static async getDetails(movieId) {
    const cacheKey = `movie_details_${movieId}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        language: 'en-US',
        append_to_response: 'credits,similar,videos,reviews'
      };

      const data = await TMDBClient.get(`/movie/${movieId}`, params);
      
      const formattedMovie = {
        id: data.id,
        title: data.title,
        overview: data.overview,
        backdrop_path: data.backdrop_path ? `${TMDB.TMDB_BACKDROP_BASE_URL}${data.backdrop_path}` : null,
        poster_path: data.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${data.poster_path}` : null,
        original_language: data.original_language,
        release_date: data.release_date,
        budget: data.budget,
        revenue: data.revenue,
        runtime: data.runtime,
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        
        // Trailers
        trailers: data.videos && data.videos.results 
          ? data.videos.results
            .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
            .map(video => ({
              id: video.id,
              key: video.key,
              name: video.name
        })) : [],
        
        // Cast
        cast: data.credits && data.credits.cast
          ? data.credits.cast.map(member => ({
            id: member.id,
            name: member.name,
            character: member.character,
            profile_path: member.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${member.profile_path}` : null,
            order: member.order
        })) : [],
        
        // Crew
        crew: data.credits && data.credits.crew
          ? data.credits.crew
            .filter(member => member.job === 'Director' || member.job === 'Screenplay' || member.job === 'Writer')
            .map(member => ({
              id: member.id,
              name: member.name,
              job: member.job,
              profile_path: member.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${member.profile_path}` : null,
              department: member.department
        })) : [],
        
        // Similar movies
        similar: data.similar && data.similar.results
          ? data.similar.results.map(similarMovie => ({
            id: similarMovie.id,
            title: similarMovie.title,
            overview: similarMovie.overview,
            poster_path: similarMovie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${similarMovie.poster_path}` : null,
            release_date: similarMovie.release_date,
            vote_average: similarMovie.vote_average,
            vote_count: similarMovie.vote_count
        })) : [],
        
        // Reviews
        reviews: data.reviews && data.reviews.results
          ? data.reviews.results.map(review => ({
            id: review.id,
            author: review.author,
            content: review.content,
            created_at: review.created_at,
            rating: review.author_details?.rating
        })) : []
      };
      
      return formattedMovie;
    });
  }

  static async searchMovie(query, page = 1) {
    const cacheKey = `movie_search_${query}_${page}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        query: query,
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/search/movie', params);

      data.results = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        image: { uri: movie.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${movie.poster_path}` : null },
        rating: movie.vote_average,
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
        description: movie.overview,
        type: "Movie"
      }));

      return data;
    });
  }
}

module.exports = MovieModel;