const TMDBClient = require('../utils/TMDBClient');
const CacheService = require('../services/CacheService');
const { TMDB } = require('../config/constants');

class PersonModel {
  static async getPersonDetails(id) {
    const cacheKey = `person_details_${id}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = { 
        language: 'en-US',
        append_to_response: 'combined_credits,images,external_ids'
      };
      const data = await TMDBClient.get(`/person/${id}`, params);

      const formattedPerson = {
        id: data.id,
        title: data.name,
        image: { uri: data.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${data.profile_path}` : null },
        rating: null,
        year: data.birthday ? new Date(data.birthday).getFullYear() : null,
        description: data.biography,
        also_known_as: data.also_known_as,
        type: "Person",
        birthday: data.birthday,
        deathday: data.deathday,
        known_for_department: data.known_for_department,
        place_of_birth: data.place_of_birth,
        known_for: {
          // Acting roles
          cast: data.combined_credits.cast.map(item => {
            const mediaMap = { movie: 'Movie', tv: 'TV Show', person: 'Person', anime: 'Anime', manhwa: 'Manhwa' };
            const releaseDate = item.release_date ?? item.first_air_date;

            return {
              id: item.id,
              type: mediaMap[item.media_type] ?? item.media_type,
              title: item.title ?? item.name,
              image: { uri: item.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${item.poster_path}` : null },
              rating: item.vote_average,
              year: releaseDate ? new Date(releaseDate).getFullYear() : null,
              description: null,
              backdrop_path: item.backdrop_path ? `${TMDB.TMDB_BACKDROP_BASE_URL}${item.backdrop_path}` : null,
              release_date: releaseDate,
              vote_count: item.vote_count,
              character: item.character,
              role_type: "Actor",
              job: item.character
            };
          }),
          // Crew roles (director, writer, producer, etc.)
          crew: data.combined_credits.crew.map(item => {
            const mediaMap = { movie: 'Movie', tv: 'TV Show', person: 'Person', anime: 'Anime', manhwa: 'Manhwa' };
            const releaseDate = item.release_date ?? item.first_air_date;

            return {
              id: item.id,
              type: mediaMap[item.media_type] ?? item.media_type,
              title: item.title ?? item.name,
              image: { uri: item.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${item.poster_path}` : null },
              rating: item.vote_average,
              year: releaseDate ? new Date(releaseDate).getFullYear() : null,
              description: null,
              backdrop_path: item.backdrop_path ? `${TMDB.TMDB_BACKDROP_BASE_URL}${item.backdrop_path}` : null,
              release_date: releaseDate,
              vote_count: item.vote_count,
              role_type: "Crew",
              job: item.job,
              department: item.department
            };
          })
        }
      };

      return formattedPerson;
    });
  }

  static async getPopular(page = 1) {
    const cacheKey = `person_popular_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = {
        page: page,
        language: 'en-US'
      };

      const data = await TMDBClient.get('/trending/person/week', params);

      const formattedResponse = {
        page: data.page,
        results: data.results.map(person => ({
          id: person.id,
          name: person.name,
          profile_path: person.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${person.profile_path}` : null,
          known_for_department: person.known_for_department,
          type: "Person"
        })),
        total_pages: data.total_pages,
        total_results: data.total_results
      };

      return formattedResponse;
    });
  }

  static async searchPerson(query, page = 1) {
    const cacheKey = `person_search_${query}_${page}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const params = { 
        query,
        page,
        language: 'en-US'
      };
      const data = await TMDBClient.get('/search/person', params);

      const formattedResponse = {
        page: data.page,
        results: data.results.map(person => ({
          id: person.id,
          title: person.name,
          image: { uri: person.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${person.profile_path}` : null },
          rating: 0,
          year: null,
          description: person.known_for?.map(kf => kf.title || kf.name).join(', ') || person.known_for_department || 'No known works',
          type: "Person"
        })),
        total_pages: data.total_pages,
        total_results: data.total_results
      };

      return formattedResponse;
    });
  }

  static async searchMulti(query, page = 1) {
    const cacheKey = `multi_search_${query}_${page}`;

    return CacheService.getOrSet(cacheKey, async () => {
      const params = { 
        query,
        page,
        language: 'en-US'
      };
      const data = await TMDBClient.get('/search/multi', params);

      const formattedResponse = {
        page: data.page,
        results: data.results.map(item => {
          let type = '';
          let title = '';
          let year = null;
          let rating = 0;
          let description = '';
          let imageUrl = null;

          if (item.media_type === 'movie') {
            type = 'Movie';
            title = item.title;
            year = item.release_date ? new Date(item.release_date).getFullYear() : null;
            rating = item.vote_average || 0;
            description = item.overview || 'No description available';
            imageUrl = item.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${item.poster_path}` : null;
          } else if (item.media_type === 'tv') {
            type = 'TV Show';
            title = item.name;
            year = item.first_air_date ? new Date(item.first_air_date).getFullYear() : null;
            rating = item.vote_average || 0;
            description = item.overview || 'No description available';
            imageUrl = item.poster_path ? `${TMDB.TMDB_POSTER_BASE_URL}${item.poster_path}` : null;
          } else if (item.media_type === 'person') {
            type = 'Person';
            title = item.name;
            year = null;
            rating = 0;
            description = item.known_for?.map(kf => kf.title || kf.name).join(', ') || item.known_for_department || 'No known works';
            imageUrl = item.profile_path ? `${TMDB.TMDB_PROFILE_BASE_URL}${item.profile_path}` : null;
          }

          return {
            id: item.id,
            title: title,
            image: { uri: imageUrl },
            rating: rating,
            year: year,
            description: description,
            type: type
          };
        }),
        total_pages: data.total_pages,
        total_results: data.total_results
      };

      return formattedResponse;
    });
  }
}

module.exports = PersonModel;