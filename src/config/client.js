const axios = require('axios');

class APIClient {
  constructor(baseURL, bearerToken = null) {
    this.baseURL = baseURL;
    this.bearerToken = bearerToken;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    return headers;
  }

  async get(endpoint, params = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await axios.get(url, {
      params,
      headers: this.getHeaders()
    });
    return response.data;
  }
}

module.exports = APIClient;