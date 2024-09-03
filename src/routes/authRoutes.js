const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/jwt');
const { createRoom } = require('../controllers/roomsController');

const router = express.Router();
// set /api/v1 as the base url
router.use('/api/v1', router);

router.post('/register', register);
router.post('/login', login);

// rooms routes
router.get("/rooms", authenticateJWT, getRooms);
router.post("/room", authenticateJWT, createRoom);
router.get("/rooms/:id", authenticateJWT);
router.put("/rooms/:id", authenticateJWT);
router.delete("/rooms/:id", authenticateJWT);
router.get("/rooms/:id/messages", authenticateJWT, getRoomMessages);
router.post("/rooms/:id/messages", authenticateJWT);

// to check if the token is valid
router.get('/verify', authenticateJWT, async (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
