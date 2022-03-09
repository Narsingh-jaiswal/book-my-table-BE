const {
  getAllSlots,
  getAllBooking,
  occupySlot,
  getOccupiedSlots,
  bookingData
} = require("./sql/queries");

const user = [];

const addUser = (userData) => {
  const isExist = user.find(
    (element) => element?.userName === userData.userName
  );

  if (!isExist) {
    user.push(userData);
  }
};

const createSocketConnection = (io, socket, userName) => {
  console.log("connection");
  addUser({ userName, socketId: socket.id });
  socket.on("getSlot", (restaurantId, socketId, email) => {
    getAllSlots(restaurantId, socketId, io);
  });

  socket.on("joinRoomByTableId", (roomName) => {
    socket.join(roomName);
  });

  socket.on("getAllBookings", (tableId) => {
    getAllBooking(tableId, io);
  });

  socket.on("slotOccupied", (tableId, slotId) => {
    occupySlot(tableId, slotId);
  });

  socket.on("getOccupiedSlots", (tableId) => {
    getOccupiedSlots(tableId, io);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("joinRoomByBookingId", (roomName) => {
    socket.join(roomName);
  });

  socket.on("getBookingData", (bookingId) => {
    bookingData(bookingId, io);
  });

  socket.on("disconnect", () => {
    const indexOf = user.findIndex((element) => element.socketId === socket.id);
    user.splice(indexOf, 1);
    console.log("disconnect");
  });
};

module.exports = { createSocketConnection };
