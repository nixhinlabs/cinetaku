const { STATUS, GENERAL } = require('../config/constants');

const APIKeyMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const validToken = GENERAL.API_KEY;

  if (!token || token !== validToken) {
    return res.status(STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized: Invalid or missing API key'
    });
  }

  next();
};

module.exports = APIKeyMiddleware;