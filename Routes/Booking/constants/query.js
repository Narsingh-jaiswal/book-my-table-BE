const getBookingByEmail =
  "SELECT booking.email, booking.id, booking.bookingDate, booking.`paymentStatus`, booking.`paymentType`,restaurantTable.advancePayment, restaurantTable.tableId, Restaurant.`Restaurant Id`, Restaurant.`Restaurant Name`, slots.time from booking INNER JOIN slots on slots.slotId = booking.slotId INNER JOIN restaurantTable on restaurantTable.tableId = booking.tableId INNER JOIN Restaurant on Restaurant.`Restaurant Id` = restaurantTable.restaurantId where booking.email = ? ORDER BY booking.bookingDate";

const getOrderDetail =
  "SELECT orderTable.orderId, orderTable.itemId,orderTable.status, orderTable.quantity,item.itemName,item.price FROM `orderTable` INNER JOIN item on orderTable.itemId = item.itemId where orderTable.bookingId = ?";

// "SELECT orderTable.orderId, orderTable.itemId,orderTable.status, orderTable.quantity,item.itemName,item.price FROM `orderTable` INNER JOIN booking on orderTable.bookingId = ? INNER JOIN item on orderTable.itemId = item.itemId";
module.exports = { getBookingByEmail, getOrderDetail };
