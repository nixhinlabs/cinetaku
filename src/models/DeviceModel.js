const { firestore } = require('../config/db');
const CacheService = require('../services/CacheService');

class DeviceModel {
  constructor() {
    this.collection = firestore.collection('devices');
  }

  async create(deviceData) {
    try {
      const {
        androidId,
        brand,
        deviceName,
        modelName,
        manufacturer,
        osName,
        osVersion
      } = deviceData;

      const deviceRef = this.collection.doc(androidId);
      const docSnapshot = await deviceRef.get();

      if (docSnapshot.exists) {
        return {
          success: false,
          message: 'Device already exists',
          data: null
        };
      }

      const now = new Date().toISOString();
      const newDevice = {
        androidId,
        brand: brand || null,
        deviceName: deviceName || null,
        modelName: modelName || null,
        manufacturer: manufacturer || null,
        osName: osName || null,
        osVersion: osVersion || null,
        createdAt: now,
        updatedAt: now,
        lastSeen: now
      };

      await deviceRef.set(newDevice);

      const cacheKey = `android:${androidId}`;
      await CacheService.del(cacheKey);
      await CacheService.del('devices:total');

      return {
        success: true,
        message: 'Device registered successfully',
        data: {
          id: androidId,
          ...newDevice
        }
      };
    } catch (error) {
      console.error('Error in insertDevice:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  async getByAndroidId(androidId) {
    try {
      if (!androidId) {
        throw new Error('Android ID is required');
      }

      const cacheKey = `android:${androidId}`;
      
      return CacheService.getOrSet(cacheKey, async () => {
        const deviceRef = this.collection.doc(androidId);
        const docSnapshot = await deviceRef.get();

        if (!docSnapshot.exists) {
          return {
            success: false,
            message: 'Device not found',
            data: null
          };
        }

        return {
          success: true,
          message: 'Device found',
          data: {
            id: docSnapshot.id,
            ...docSnapshot.data()
          }
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async getTotal() {
    try {
      const cacheKey = 'devices:total';
      
      return CacheService.getOrSet(cacheKey, async () => {
        const snapshot = await this.collection.get();
        const total = snapshot.size;

        return {
          success: true,
          message: 'Total devices retrieved successfully',
          data: {
            total: total,
            average_rating: 5.0
          }
        };
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new DeviceModel();
