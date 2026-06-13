require('dotenv').config();

module.exports = {
  // General
  GENERAL: {
    BASE_PRODUCTION_URL: process.env.BASE_PRODUCTION_URL,
    BASE_STAGING_URL: process.env.BASE_STAGING_URL,
    API_KEY: process.env.API_KEY
  },

  // Database
  DATABASE: {
    DATABASE_PROJECT_ID: process.env.DATABASE_PROJECT_ID,
    DATABASE_PRIVATE_KEY: process.env.DATABASE_PRIVATE_KEY,
    DATABASE_CLIENT_EMAIL: process.env.DATABASE_CLIENT_EMAIL,
    DATABASE_URL: process.env.DATABASE_URL
  },

  // TMDB
  TMDB: {
    TMDB_BASE_URL: process.env.TMDB_BASE_URL,
    TMDB_READ_ACCESS_TOKEN: process.env.TMDB_READ_ACCESS_TOKEN,
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TMDB_PROFILE_BASE_URL: process.env.TMDB_PROFILE_BASE_URL,
    TMDB_BACKDROP_BASE_URL: process.env.TMDB_BACKDROP_BASE_URL,
    TMDB_POSTER_BASE_URL: process.env.TMDB_POSTER_BASE_URL
  },

  ANIME: {
    ANIME_API_BASE_URL: process.env.ANIME_API_BASE_URL,
    ANIME_STREAMING_URL: process.env.ANIME_STREAMING_URL
  },

  MANGA: {
    MANGA_API_BASE_URL: process.env.MANGA_API_BASE_URL,
    MANGA_COVER_BASE_URL: process.env.MANGA_COVER_BASE_URL
  },

  // Pagination
  PAGINATION: {
    PAGE: parseInt(process.env.PAGE),
    LIMIT: parseInt(process.env.LIMIT)
  },

  // Status Codes
  STATUS: {
    SUCCESS: parseInt(process.env.SUCCESS),
    CREATED: parseInt(process.env.CREATED),
    NO_CONTENT: parseInt(process.env.NO_CONTENT),
    BAD_REQUEST: parseInt(process.env.BAD_REQUEST),
    UNAUTHORIZED: parseInt(process.env.UNAUTHORIZED),
    FORBIDDEN: parseInt(process.env.FORBIDDEN),
    NOT_FOUND: parseInt(process.env.NOT_FOUND),
    TOO_MANY_REQUESTS: parseInt(process.env.TOO_MANY_REQUESTS),
    INTERNAL_SERVER_ERROR: parseInt(process.env.INTERNAL_SERVER_ERROR),
  }
};