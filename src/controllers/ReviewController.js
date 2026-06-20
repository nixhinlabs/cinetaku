const { STATUS } = require('../config/constants');

class ReviewController {
  async getReviews(req, res) {
    try {
      const reviews = [
        {
          androidId: "a1b2c3d4e5f6g7h8",
          brand: "Samsung",
          deviceName: "Galaxy S24 Ultra",
          modelName: "SM-S928B",
          stars: 5,
          message: "Ang ganda ng app nato! Dito ko na pinapanood lahat ng anime at manhwa ko. Walang account na need, sobrang convenient. Salamat sa creator!"
        },
        {
          androidId: "b2c3d4e5f6g7h8i9",
          brand: "Xiaomi",
          deviceName: "Redmi Note 13 Pro",
          modelName: "2312DRA50G",
          stars: 5,
          message: "Sobrang smooth ng app kahit sa budget phone ko. Ang bilis mag load ng manhwa pages at maganda rin yung vertical scroll reader!"
        },
        {
          androidId: "c3d4e5f6g7h8i9j0",
          brand: "OPPO",
          deviceName: "Reno 11",
          modelName: "CPH2599",
          stars: 5,
          message: "Gustong gusto ko yung Movies at TV Shows section. Complete yung mga series na pinapanood ko. Sana madagdagan pa ng more Filipino content. Solid app!"
        },
        {
          androidId: "d4e5f6g7h8i9j0k1",
          brand: "Realme",
          deviceName: "Realme 12 Pro+",
          modelName: "RMX3840",
          stars: 5,
          message: "Finally! Isang app na lang lahat ng needs ko. Binge-watcher ako at sobrang convenient na free to use. No account required? Perfect! Best app ever."
        },
        {
          androidId: "e5f6g7h8i9j0k1l2",
          brand: "Vivo",
          deviceName: "Vivo V30",
          modelName: "V2337",
          stars: 5,
          message: "Ang ganda ng app design! Premium yung dating kahit free. Madali i-navigate yung categories, from Anime to Manhwa. Sana magkaroon ng light mode. Keep it up!"
        }
      ];

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: reviews,
        count: reviews.length,
        message: 'Reviews fetched successfully'
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to get reviews',
        error: error.message
      });
    }
  }
}

module.exports = new ReviewController();
