// SPIMS Database Configuration
// PostgreSQL connection settings for different environments

const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'spims_db',
    username: process.env.DB_USER || 'spims_user',
    password: process.env.DB_PASSWORD || 'keerthi',
    dialect: 'postgres',
    logging: console.log, // Enable SQL logging in development
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  },

  test: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 5432,
    database: process.env.TEST_DB_NAME || 'spims_test_db',
    username: process.env.TEST_DB_USER || 'spims_user',
    password: process.env.TEST_DB_PASSWORD || 'your_secure_password',
    dialect: 'postgres',
    logging: false, // Disable logging in tests
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },

  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false, // Disable logging in production
    pool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};

module.exports = config;