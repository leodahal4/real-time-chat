const express = require('express');
const http = require('http');
const path = require('path');
require('dotenv').config();
const { initDB } = require('./config/db');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
initDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
