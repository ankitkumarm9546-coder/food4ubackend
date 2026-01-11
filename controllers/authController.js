const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, phone, password, roles, activeRole, extraData } = req.body;

    // Validation
    if (!name || !phone || !password || !roles || !Array.isArray(roles) || roles.length === 0 || !activeRole) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, phone, password, roles (array), and activeRole are required'
      });
    }

    // Validate activeRole is in roles array
    if (!roles.includes(activeRole)) {
      return res.status(400).json({
        success: false,
        message: 'activeRole must be one of the roles in the roles array'
      });
    }

    // Validate extraData based on roles
    if (roles.includes('driver')) {
      if (!extraData || !extraData.vehicle) {
        return res.status(400).json({
          success: false,
          message: 'Driver role requires extraData with vehicle field'
        });
      }
    }

    if (roles.includes('restaurant')) {
      if (!extraData || !extraData.restaurantName || extraData.lat === undefined || extraData.lng === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Restaurant role requires extraData with restaurantName, lat, and lng fields'
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      password,
      roles,
      activeRole,
      extraData: extraData || {}
    });

    await user.save();

    res.status(201).json({
      success: true,
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

module.exports = {
  register
};

