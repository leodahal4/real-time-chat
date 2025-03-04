const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");
require("dotenv").config();

const { initDB, migrate } = require("./config/db");
const routes = require("./routes/routes");
const handleWebSocketConnection = require("./websocket/websocketHandler");

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

initDB();
migrate();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);
handleWebSocketConnection(wss);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
