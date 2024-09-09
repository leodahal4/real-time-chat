const WebSocket = require('ws');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const handleWebSocketConnection = (wss) => {
    wss.on('connection', async (ws, req) => {
        console.log('New client connected');
        try {
          const roomID = req.url.split('&roomID=')[1];
            const token = req.url.split('?token=')[1].split('&')[0];
          console.log(token, "====");
          console.log(roomID, "====");
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const actualUser = await pool.query('SELECT * FROM users WHERE id = $1', [decodedToken.id]);
            if (!actualUser) {
              console.log("no user found request is ", actualUser);
              ws.close(4401, 'Unauthorized'); // Close the connection with an error code
              return
            }
            const room = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomID]);
            if (!room) {
              console.log("no room found request is ", room);
              ws.close(4401, 'Unauthorized');
              return
            }

            const members = room.rows[0].members;
            let isMember = false
          console.log(ws.user, "========")
          ws.user = {id: decodedToken.id}
            members.forEach((member) => {
              if (member == ws.user.id) {
                isMember = true
              }
            });
          if (!isMember) {
            ws.close(4401, 'Unauthorized');
            return
            }

            ws.user = {id: decodedToken.id, roomId: roomID, username: actualUser.rows[0].username};
            ws.on('message', async (reqMessage) => {
                const parsedMessage = JSON.parse(reqMessage.toString());
                const { roomId, message, username } = parsedMessage;

                const room = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
                if (!room) {
                  console.log("no room found request is ", room);
                  ws.close(4401, 'Unauthorized');
                }

                const members = room.rows[0].members;
                let isMember = false
                members.forEach((member) => {
                  if (member == ws.user.id) {
                    isMember = true
                  }
                });

              if (!isMember) {
                console.log("not a member of the room");
                ws.close(4401, 'Unauthorized');
                return
              }
              ws.user.roomId = roomId;

                const query = 'INSERT INTO messages (user_id, room_id, message) VALUES ($1, $2, $3) RETURNING *';
                const values = [ws.user.id, ws.user.roomId, message];
                try {
                    const res = await pool.query(query, values);
                    const savedMessage = res.rows[0];
                    const sendMessageNowToClients = {userId: ws.user.id, roomId: ws.user.room, message: message, username: actualUser.rows[0].username};
                    wss.clients.forEach((client) => {
                      console.log(client.user, "========");
                      console.log(client.user.roomId, "========");
                         if (client !== ws && client.readyState === WebSocket.OPEN && client.user.roomId === roomId) {
                            client.send(JSON.stringify(sendMessageNowToClients));
                           console.log("sent");
                        } else {
                          console.log("not sent");
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

