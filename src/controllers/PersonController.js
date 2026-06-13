const PersonModel = require('../models/PersonModel');
const { STATUS, PAGINATION } = require('../config/constants');

class PersonController {
  async getPersonDetails(req, res) {
    try {
      const personId = req.params.id;
      const person = await PersonModel.getPersonDetails(personId);

      if (!person) {
        return res.status(STATUS.NOT_FOUND).json({
          success: false,
          message: 'Person not found'
        });
      }

      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: person
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch person"
      });
    }
  }

  async getPopular(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      
      if (page < 1) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Page number must be greater than 0'
        });
      }

      const data = await PersonModel.getPopular(page);
      
      return res.status(STATUS.SUCCESS).json({
        success: true,
        data: data.results,
        pagination: {
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
          limit: PAGINATION.LIMIT
        }
      });
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch popular people"
      });
    }
  }
}

module.exports = new PersonController();