const {
  newRoomService,
  getRoomsService,
  getRoomService,
  updateRoomService,
  deleteRoomService,
  getRoomMessagesService,
  joinRoomService,
} = require("../services/roomsService");
const bcrypt = require("bcryptjs");

const createRoomController = async (req, res) => {
  const roomName = req.body.name;
  if (!roomName) {
    return res.status(400).json({
      message: "Room name is required",
    });
  }
  const userId = req.user.id;
  let hashedPassword = null;
  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, 8);
  }

  try {
    const room = await newRoomService(userId, roomName, hashedPassword);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getRoomsController = async (req, res) => {
  const userId = req.user.id;
  try {
    const rooms = await getRoomsService();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getRoomController = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.id;
  try {
    const room = await getRoom(userId, roomId);
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateRoomController = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.id;
  const roomName = req.body.name;
  const roomPassword = req.body.password;
  try {
    const room = await updateRoomService(
      userId,
      roomId,
      roomName,
      roomPassword
    );
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteRoomController = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.id;
  try {
    const room = await deleteRoomService(userId, roomId);
    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getRoomMessagesController = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.id;
  // check if the user is a member of the room
  const room = await getRoomService(roomId);
  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }
  try {
    const messages = await getRoomMessages(userId, roomId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const joinRoomController = async (req, res) => {
  const userId = req.user.id;
  const roomId = req.params.id;
  const requestedPassword = req.body.password;

  // get the room
  const room = await getRoomService(roomId);
  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  try {
    const updatedRoom = await joinRoomService(
      userId,
      roomId,
      requestedPassword
    );
    return res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRoomController,
  getRoomsController,
  getRoomController,
  updateRoomController,
  deleteRoomController,
  getRoomMessagesController,
  joinRoomController,
};
