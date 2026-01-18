const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const register = async (req, res) => {
  try {
    const { name, phone, password, roles, extraData } = req.body;

    // Validation
    if (!name || !phone || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, phone, password, roles (array) are required'
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
      const newRoles = roles.filter((role) => !existingUser.roles.includes(role));

      if (newRoles.length === 0) {
        return res.status(200).json({
          success: true,
          userId: existingUser._id,
          roles: existingUser.roles,
          message: 'User already has these roles'
        });
      }

      existingUser.roles = Array.from(new Set([...existingUser.roles, ...newRoles]));
      existingUser.extraData = {
        ...(existingUser.extraData || {}),
        ...(extraData || {})
      };

      await existingUser.save();

      return res.status(200).json({
        success: true,
        userId: existingUser._id,
        roles: existingUser.roles,
        message: 'Roles added successfully'
      });
    }

    // Create new user
    const user = new User({
      name,
      phone,
      password,
      roles,
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

const login = async (req, res) => {
  try {
    const { phone, password, activeRole } = req.body;

    if (!phone || !password || !activeRole) {
      return res.status(400).json({
        success: false,
        message: 'Phone, password, and activeRole are required'
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone or password'
      });
    }

    if (!user.roles.includes(activeRole)) {
      return res.status(400).json({
        success: false,
        message: 'activeRole must be one of the roles in the roles array'
      });
    }

    if (user.activeRole && user.activeRole !== activeRole) {
      return res.status(409).json({
        success: false,
        message: 'You are already logged in with another role'
      });
    }

    if (user.activeRole !== activeRole) {
      user.activeRole = activeRole;
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        roles: user.roles,
        activeRole
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      activeRole: user.activeRole,
      roles: user.roles
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is required'
      });
    }

    const payload = jwt.verify(token, config.JWT_SECRET);
    await User.findByIdAndUpdate(payload.userId, { $set: { activeRole: null } });

    res.json({
      success: true,
      message: 'Logged out'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  logout
};

