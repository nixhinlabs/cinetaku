class VersionController {
  async getLatestVersion(req, res) {
    return res.json({
      success: true,
      data: {
        latest_version: "1.0.0",
        download_url: "https://cinetaku.netlify.app",
        update_message: "Welcome to Cinetaku! Stream movies, TV shows, anime, and read manhwa all in one app.",
        release_date: "2026-06-11",
        changelog: [
          "Stream latest movies and TV shows",
          "Watch anime with sub/dub support",
          "Read manhwa collection",
          "Multiple servers available",
          "HD and 4K quality support",
          "Clean and easy-to-use interface",
          "Search across all content types",
          "List your favorites",
        ],
        features: {
          movies: true,
          tv_shows: true,
          anime: true,
          manhwa: true
        },
        support_email: "nixhin.labs@gmail.com",
        website: "https://cinetaku.netlify.app"
      }
    });
  }
}

module.exports = new VersionController();
