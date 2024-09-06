const {
  getRoomByName,
  createRoom,
  getRoomMessages,
  getRoom,
  updateRoom,
  deleteRoom,
  getRooms
} = require('../repositories/roomRepository');

const newRoomService = async (userId, roomName, roomPassword) => {
  // check if the room already exists
  const room = await getRoomByName(roomName);
  if (room) {
    throw new Error('Room already exists');
  }

  return createRoom(userId, roomName, roomPassword);
}

const getRoomMessagesService = async (roomId) => {
  const room = await getRoomMessages(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room.messages;
}

const getRoomService = async (userId, roomId) => {
  const room = await getRoom(userId, roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
}

const updateRoomService = async (userId, roomId, roomName, roomPassword) => {
  const room = await updateRoom(userId, roomId, roomName, roomPassword);
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
}

const deleteRoomService = async (userId, roomId) => {
  const room = await deleteRoom(userId, roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
}

const getRoomsService = async (userId) => {
  return getRooms(userId);
}

module.exports = {
  newRoomService,
  getRoomMessagesService,
  getRoomService,
  updateRoomService,
  deleteRoomService,
  getRoomsService
};
