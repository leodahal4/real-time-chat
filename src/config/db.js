const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const maskPasswordInUrl = (url) => {
  // return url.replace(/(postgres:\/\/.*:)(.*)(@.*)/, '$1*******$3');
  return url
};

const initDB = () => {
  const maskedDatabaseUrl = maskPasswordInUrl(process.env.DATABASE_URL);
  console.log('Initializing database with url:', maskedDatabaseUrl);
    pool.connect()
        .then(() => console.log('Connected to PostgreSQL'))
        .catch(err => console.error('Connection error =====', err.stack));
};

module.exports = { pool, initDB };
