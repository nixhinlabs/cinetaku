const NodeCache = require('node-cache');

class CacheService {
  constructor(ttlSeconds = 43200) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, data) {
    this.cache.set(key, data);
  }

  del(key) {
    this.cache.del(key);
  }

  flush() {
    this.cache.flushAll();
  }

  async getOrSet(key, fetchFunction) {
    const cachedData = this.get(key);
    
    if (cachedData) {
      console.log(`=====> Cache hit for key: ${key}`);
      return cachedData;
    }

    console.log(`=====> Cache miss for key: ${key}. Fetching fresh data...`);
    const freshData = await fetchFunction();
    this.set(key, freshData);
    console.log(`=====> Data fetched and cached for key: ${key}`);
    return freshData;
  }
}

module.exports = new CacheService();