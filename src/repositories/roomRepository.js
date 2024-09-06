const {pool} = require('../config/db');

const createRoom = async (userId, roomName, roomPassword) => {
    const query = 'INSERT INTO rooms (user_id, room_name, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, roomName, roomPassword];
    const res = await pool.query(query, values);
    return res.rows[0];
}

const getRoomByName = async (roomName) => {
    const query = 'SELECT * FROM rooms WHERE room_name = $1';
    const values = [roomName];
    const res = await pool.query(query, values);
    return res.rows[0];
}

const getRoomMessages = async (roomId) => {
    const query = 'SELECT * FROM messages WHERE room_id = $1';
    const values = [roomId];
    const res = await pool.query(query, values);
    
    return res.rows;
}

const getRoom = async (userId, roomId) => {
    const query = 'SELECT * FROM rooms WHERE user_id = $1 AND id = $2';
    const values = [userId, roomId];
    const res = await pool.query(query, values);

    return res.rows[0];
}

const updateRoom = async (userId, roomId, roomName, roomPassword) => {
    const query = 'UPDATE rooms SET room_name = $1, password = $2 WHERE user_id = $3 AND id = $4 RETURNING *';
    const values = [roomName, roomPassword, userId, roomId];
    const res = await pool.query(query, values);

    return res.rows[0];
}

const deleteRoom = async (userId, roomId) => {
    const query = 'DELETE FROM rooms WHERE user_id = $1 AND id = $2 RETURNING *';
    const values = [userId, roomId];
    const res = await pool.query(query, values);

    return res.rows[0];
}

const getRooms = async (userId) => {
    const query = 'SELECT * FROM rooms WHERE user_id = $1';
    const values = [userId];
    const res = await pool.query(query, values);
    
    return res.rows;
}

module.exports = {
  createRoom,
  getRoomByName,
  getRoomMessages,
  getRoom,
  updateRoom,
  getRooms,
  deleteRoom
}
