const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const maskPasswordInUrl = (url) => {
  return url.replace(/(postgres:\/\/.*:)(.*)(@.*)/, "$1*******$3");
  return url;
};

const initDB = () => {
  const maskedDatabaseUrl = maskPasswordInUrl(process.env.DATABASE_URL);
  console.log("Initializing database with url:", maskedDatabaseUrl);
  pool
    .connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error ", err.stack));
};

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id),
          room_id INT,
          message TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
          id SERIAL PRIMARY KEY,
          room_name VARCHAR(50) UNIQUE NOT NULL,
          user_id INT REFERENCES users(id),
          password VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          members INT[]
      );
    `);
  } catch (err) {
    console.error("Error migrating database", err);
  } finally {
    console.log("Database migration complete");
    client.release();
  }
};

module.exports = { pool, initDB, migrate };
