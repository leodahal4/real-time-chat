const WebSocket = require('ws');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const handleWebSocketConnection = (wss) => {
    wss.on('connection', async (ws, req) => {
        console.log('New client connected');

        try {
            // Extract the token from the WebSocket handshake URL
            const token = req.url.split('?token=')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            ws.user = decoded; // Attach the decoded user data to the WebSocket connection

            ws.on('message', async (message) => {
                const messageString = message.toString();
                const parsedMessage = JSON.parse(messageString);

                // Save the message to the database
                const { roomId, text } = parsedMessage;
                const userId = ws.user.id; // Use the authenticated user ID
                const query = 'INSERT INTO messages (user_id, room_id, message) VALUES ($1, $2, $3) RETURNING *';
                const values = [userId, roomId, text];

                try {
                    const res = await pool.query(query, values);
                    const savedMessage = res.rows[0];

                    // Broadcast the message to all clients in the same room
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN && client.user && client.user.roomId === roomId) {
                            client.send(JSON.stringify(savedMessage));
                        }
                    });
                } catch (error) {
                    console.error('Error saving message to database:', error);
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        } catch (error) {
            console.error('WebSocket authentication error:', error);
            ws.close(4401, 'Unauthorized'); // Close the connection with an error code
        }
    });
};

module.exports = handleWebSocketConnection;

