const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/jwt');
const { createRoomController, getRoomMessagesController, getRoomsController, updateRoomController, joinRoomController, getRoomController, deleteRoomController } = require('../controllers/roomsController');

const router = express.Router();
// set /api/v1 as the base url
// router.use('/api/v1', router);

router.post('/register', register);
router.post('/login', login);

// rooms routes
router.post("/room", authenticateJWT, createRoomController);
router.get("/room", authenticateJWT, getRoomsController);
router.get("/room/:id", authenticateJWT, getRoomController);
router.put("/room/:id", authenticateJWT, updateRoomController);
router.delete("/room/:id", authenticateJWT, deleteRoomController);
router.get("/room/:id/messages", authenticateJWT, getRoomMessagesController);
router.post("/room/:id/join", authenticateJWT, joinRoomController);
// router.post("/room/:id/messages", authenticateJWT, createMessageController);

// to check if the token is valid
router.get('/verify', authenticateJWT, async (req, res) => {
    const username = req.user.username;
    const id = req.user.id;
    res.status(200).json({ message: 'Token is valid', username: username, id: id});
});

module.exports = router;
