const mySql = require("mysql");
const { getOrderDetail } = require("../../Routes/Booking/constants/query");
const sql = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test"
});

sql.connect((err) => {
  if (err) {
    throw err;
  }
});

const getAllSlots = (restaurantId, socketId, io) => {
  const query = "SELECT * FROM `slots` WHERE restaurantId = ?";
  sql.query(query, [restaurantId], (err, result) => {
    if (err) throw err;
    if (result?.length > 0) {
      io.to(socketId).emit("getSlot", result);
    }
  });
};

const getAllBooking = (tableId, io) => {
  const query =
    "SELECT * FROM `booking` INNER JOIN slots ON booking.slotId = slots.slotId WHERE booking.tableId = ? AND booking.bookingDate >= ?";
  const dateObject = new Date();
  const date = `${dateObject.getDate()}`.padStart(2, 0);
  const month = `${dateObject.getMonth()}`.padStart(2, 0);
  const year = dateObject.getFullYear();
  const dateString = `${month}/${date}/${year}`;

  sql.query(query, [tableId, dateString], (err, result) => {
    if (err) throw err;
    if (result) {
      io.to(tableId).emit("allBookings", result);
    }
  });
};

const occupySlot = (tableId, slotId) => {
  const query = "INSERT INTO `occupiedSlot`(`slotId`, `tableId`) VALUES (?,?)";
  sql.query(query, [slotId, tableId], (err, result) => {
    if (err) throw err;
    if (result) {
      return;
    }
  });
};

const getOccupiedSlots = (tableId, io) => {
  const query =
    "SELECT * from slots INNER JOIN occupiedSlot on occupiedSlot.slotId = slots.slotId AND occupiedSlot.tableId = ?";
  sql.query(query, [tableId], (err, result) => {
    if (err) throw err;
    if (result) {
      io.to(tableId).emit("allOccupiedSlots", result);
    }
  });
};

const bookingData = (orderId, io) => {
  sql.query(getOrderDetail, [orderId], (err, result) => {
    if (err) throw err;
    if (result) return io?.to(orderId).emit("getAllBookingData", result);
  });
};

module.exports = {
  getAllSlots,
  getAllBooking,
  occupySlot,
  getOccupiedSlots,
  bookingData
};
