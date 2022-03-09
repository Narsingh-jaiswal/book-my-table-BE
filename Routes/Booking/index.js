const shortId = require("shortid");
const mySql = require("mysql");
const router = require("express").Router();
const { getBookingByEmail, getOrderDetail } = require("./constants/query");

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

router.post("/createBooking", (req, res) => {
  const { email, slotId, tableId, bookingDate } = req.body;
  const query =
    "INSERT INTO `booking`(`email`, `id`, `slotId`, `tableId`, `bookingDate`, `paymentStatus`, `paymentType`) VALUES (?,?,?,?,?,?,?)";
  sql.query(
    query,
    [email, shortId.generate(), slotId, tableId, bookingDate, "", "online"],
    (err, result) => {
      if (err) throw err;
      if (result) return res.send(result);
    }
  );
});

router.get("/getBookingsByEmail/:email", (req, res) => {
  const { email } = req.params;
  sql.query(getBookingByEmail, [email], (err, result) => {
    if (err) throw err;
    if (result.length > 0) return res.send(result);
  });
});

router.delete("/cancelBooking", (req, res) => {
  const { bookingId } = req.body;

  const query = "DELETE FROM `booking` WHERE booking.id = ?";
  sql.query(query, [bookingId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.delete("/deleteOccupiedSlot", (req, res) => {
  const { slotId, tableId } = req.body;
  console.log(slotId, tableId);
  const query =
    "DELETE FROM `occupiedSlot` WHERE occupiedSlot.slotId=? and occupiedSlot.tableId = ?";
  sql.query(query, [slotId, tableId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.post("/placeOrder", (req, res) => {
  const { orderData } = req.body;
  console.log({ orderData });
  const query =
    "INSERT INTO `orderTable`(`itemId`, `quantity`, `bookingId`, `orderId`, `status`) VALUES ?";
  sql.query(query, [orderData], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.get("/getOrderDetail/:orderId", (req, res) => {
  const { orderId } = req.params;
  sql.query(getOrderDetail, [orderId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.put("/updateOrderStage/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { stage, itemId } = req.body;

  const query =
    "UPDATE `orderTable` SET `status`= ? WHERE orderId = ? AND itemId =?";
  sql.query(query, [stage, orderId, itemId], (err, result) => {
    if (err) throw err;
    else return res.send(result);
  });
});

router.put("/orderPayment/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  const query = "UPDATE `booking` SET `paymentStatus`= ? WHERE id=?";
  sql.query(query, ["success", bookingId], (err, result) => {
    if (err) throw err;
    else return res.send(result);
  });
});

module.exports = router;
