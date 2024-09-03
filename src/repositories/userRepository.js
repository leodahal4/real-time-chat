const { pool } = require('../config/db');

const registerUser = async (username, hashedPassword) => {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, hashedPassword];
    const res = await pool.query(query, values);
    return res.rows[0];
};

const getUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const res = await pool.query(query, values);
    return res.rows[0];
};

module.exports = { registerUser, getUserByUsername };
