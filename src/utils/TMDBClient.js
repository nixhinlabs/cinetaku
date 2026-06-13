const APIClient = require('../config/client');
const { TMDB } = require('../config/constants');

const TMDBClient = new APIClient(
  TMDB.TMDB_BASE_URL,
  TMDB.TMDB_READ_ACCESS_TOKEN
);

module.exports = TMDBClient;