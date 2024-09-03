const { getRoomByName, createRoom } = require('../repositories/roomsRepository');

const newRoom = async (userId, roomName, roomPassword) => {
  // check if the room already exists
  const room = await getRoomByName(roomName);
  if (room) {
    throw new Error('Room already exists');
  }

  return createRoom(userId, roomName, roomPassword);
}

const getRoomMessages = async (roomId) => {
  const room = await getRoomMessages(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room.messages;
}

const getRoom = async (userId, roomId) => {
  const room = await getRoom(userId, roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
}

const updateRoom = async (userId, roomId, roomName, roomPassword) => {
  const room = await updateRoom(userId, roomId, roomName, roomPassword);
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
}

const deleteRoom = async (userId, roomId) => {
  const room = await deleteRoom(userId, roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room;
}

const getRooms = async (userId) => {
  return getRooms(userId);
}

