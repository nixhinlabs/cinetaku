const DeviceModel = require('../models/DeviceModel');
const { STATUS } = require('../config/constants');

class DeviceController {
  async create(req, res) {
    try {
      const {
        androidId,
        brand,
        deviceName,
        modelName,
        manufacturer,
        osName,
        osVersion
      } = req.body;

      console.log('Received device data:', req.body);

      if (!androidId) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Android ID is required'
        });
      }

      if (!brand) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Brand is required'
        });
      }

      if (!deviceName) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Device name is required'
        });
      }

      if (!modelName) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Model name is required'
        });
      }

      if (!manufacturer) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Manufacturer is required'
        });
      }

      if (!osName) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'OS name is required'
        });
      }

      if (!osVersion) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'OS version is required'
        });
      }

      const result = await DeviceModel.create({
        androidId,
        brand,
        deviceName,
        modelName,
        manufacturer,
        osName,
        osVersion
      });

      if (!result.success) {
        return res.status(STATUS.CONFLICT).json(result);
      }

      return res.status(STATUS.CREATED).json(result);
    } catch (error) {
      console.error('Error in registerDevice:', error.message);
      console.error('Error stack:', error.stack);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to register device',
        error: error.message
      });
    }
  }

  async getByAndroidId(req, res) {
    try {
      const { androidId } = req.params;

      if (!androidId) {
        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Android ID is required'
        });
      }

      const result = await DeviceModel.getByAndroidId(androidId);

      if (!result.success) {
        return res.status(STATUS.NOT_FOUND).json(result);
      }

      return res.status(STATUS.SUCCESS).json(result);
    } catch (error) {
      console.error('Error in getByAndroidId:', error.message);
      console.error('Error stack:', error.stack);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to get device',
        error: error.message
      });
    }
  }

  async getTotal(req, res) {
    try {
      const result = await DeviceModel.getTotal();

      if (!result.success) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json(result);
      }

      return res.status(STATUS.SUCCESS).json(result);
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to get total devices',
        error: error.message
      });
    }
  }
}

module.exports = new DeviceController();
