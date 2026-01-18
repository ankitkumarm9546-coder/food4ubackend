require('dotenv').config();

module.exports = {
  MONGODB_URI: 'mongodb+srv://ankitkumarm9546_db_user:aM365UOWmzMDphlc@cluster0.86m2zu9.mongodb.net/?appName=Cluster0',
  PORT: 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'food4u_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};

