const bcrypt = require('bcryptjs');
const {
  getRoomByName,
  createRoom,
  getRoomMessages,
  getRoom,
  updateRoom,
  deleteRoom,
  getRooms,
  updateRoomMembers
} = require('../repositories/roomRepository');

const newRoomService = async (userId, roomName, roomPassword) => {
  // check if the room already exists
  const room = await getRoomByName(roomName);
  if (room) {
    throw new Error('Room already exists');
  }

  const hashedPassword = bcrypt.hashSync(roomPassword, 8);
  return createRoom(userId, roomName, hashedPassword);
}

const getRoomMessagesService = async (roomId) => {
  const room = await getRoomMessages(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  return room.messages;
}

const getRoomService = async (roomId) => {
  const room = await getRoom(roomId);
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

const getRoomsService = async () => {
  return getRooms();
}

const joinRoomService = async (userId, roomId, requestedPassword) => {
  // get the room
  const room = await getRoom(userId, roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  // check if the password is correctS
  if (room.password != null) {
    if (!requestedPassword) {
      throw new Error('Password is required');
    }
    if (!(bcrypt.compareSync(requestedPassword, room.password))) {
      throw new Error('Invalid password');
    }
  }
  
  if (room.members == null) {
    room.members = [];
  }
  // check if the user is already a member of the room
  if (room.members.includes(userId)) {
    return getRoomMessages(roomId);
  }

  // add the user to the room
  room.members.push(userId);

  // save the room
  return updateRoomMembers(roomId, room.members);
}

const getAllRoomService = async () => {
  return getRooms();
}

module.exports = {
  newRoomService,
  getRoomMessagesService,
  getRoomService,
  updateRoomService,
  deleteRoomService,
  getRoomsService,
  joinRoomService,
};
