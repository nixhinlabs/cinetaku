class ServerController {
  async getServers(req, res) {
    return res.json([
      {
        id: "CINE-001", 
        name: "Cine Prime",
        url: "https://vsembed.ru/embed",
        isActive: true,
        description: "Ultra-fast 4K streaming, largest library, minimal ads, and fastest load times. Perfect for Hollywood blockbusters, popular TV shows, and new releases.",
        tags: ["4K Quality", "Fastest", "Minimal Ads", "Popular"],
        needsExternalBrowser: false
      },
      { 
        id: "CINE-002", 
        name: "Cine King", 
        url: "https://vidking.net/embed",
        isActive: false,
        description: "Premium streaming server with extensive content library. Features high-quality playback, minimal buffering, and excellent compatibility with all devices.",
        tags: ["Premium", "All Devices", "HD Quality", "Minimal Ads"],
        needsExternalBrowser: false
      },
      { 
        id: "CINE-003", 
        name: "Cine Anime", 
        url: "https://player.videasy.net",
        isActive: false,
        description: "Best for Anime & Asian Dramas - Smooth playback with minimal buffering. Specialized in anime content and Asian entertainment.",
        tags: ["Anime", "Asian Dramas", "Sub/Dub", "Minimal Ads"],
        needsExternalBrowser: false
      },
      { 
        id: "CINE-004", 
        name: "Cine Pro", 
        url: "https://vidlink.pro",
        isActive: false,
        description: "Huge library of movies and TV shows. Fast streaming with a customizable video player.",
        tags: ["Huge Library", "Fast", "Customizable", "Classic Movies"],
        needsExternalBrowser: false
      }
    ]);
  }
}

module.exports = new ServerController();