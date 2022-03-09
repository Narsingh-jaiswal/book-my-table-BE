const router = require("express").Router();
const mySql = require("mysql");
const shortid = require("shortid");

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

router.post("/RegisterRestaurant", (req, res) => {
  const query =
    "INSERT INTO `Restaurant`(`Restaurant Name`, `Restaurant Id`, `email`, `address`,`planid`,`expireOn`) VALUES (?,?,?,?,?,?)";
  const { body } = req;
  console.log({ body });
  sql.query(
    query,
    [body.name, body.id, body.email, body.address, body.planid, body.expireOn],
    (err, result) => {
      if (err) throw err;
      if (result) {
        return res.send(result);
      }
    }
  );
});

router.get("/myRestaurant/:email", (req, res) => {
  const { email } = req.params;
  const query =
    "SELECT * FROM `Restaurant` INNER JOIN plans ON plans.`Plan ID` = Restaurant.planId where Restaurant.email = ?";
  sql.query(query, [email], (err, result) => {
    if (err) throw err;
    if (result?.length > 0) return res.send(result);
    else return res.send("no restaurant");
  });
});

router.get("/getAllRestaurant", (req, res) => {
  const dateObject = new Date();
  const date = `${dateObject.getDate()}`.padStart(2, 0);
  const month = `${dateObject.getMonth() + 1}`.padStart(2, 0);
  const year = dateObject.getFullYear();
  const currentDate = `${month}/${date}/${year}`;
  const query =
    "SELECT * FROM `Restaurant` INNER JOIN plans ON plans.`Plan ID` = Restaurant.planId where Restaurant.expireOn >= ?";

  sql.query(query, [currentDate], (err, result) => {
    if (err) throw err;
    if (result.length > 0) return res.send(result);
  });
});

router.post("/addTable", (req, res) => {
  const { restaurantId, tableId, advancePayment, description } = req.body;
  const query =
    "INSERT INTO `restaurantTable`(`restaurantId`, `tableId`, `slotId`, `advancePayment`,description) VALUES (?,?,'freeslot',?,?)";
  sql.query(
    query,
    [restaurantId, tableId, advancePayment, description],
    (err, result) => {
      if (err) throw err;
      if (result) return res.send(result);
    }
  );
});

router.post("/addSlots", (req, res) => {
  const { restaurantId, time } = req.body;
  const query =
    "INSERT INTO `slots`(`restaurantId`, `slotId`, `time`) VALUES (?,?,?)";
  sql.query(query, [restaurantId, shortid.generate(), time], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.get("/getRestaurant/:email/:restaurantId", (req, res) => {
  const { email, restaurantId } = req.params;

  const query =
    "SELECT * from restaurantTable,Restaurant where Restaurant.`Restaurant Id`= ? AND restaurantTable.restaurantId = ? AND Restaurant.email = ?";
  sql.query(query, [restaurantId, restaurantId, email], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.get("/getSlots/:slotId", (req, response) => {
  const { slotId } = req.params;
  const query = "SELECT * FROM `slots` WHERE slotId = ?";
  sql.query(query, [slotId], (err, res) => {
    if (err) throw err;
    if (res?.length > 0) {
      return response.send(res);
    }
  });
});

router.get("/getAllSlots/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const query = "SELECT * FROM `slots` WHERE restaurantId = ?";
  sql.query(query, [restaurantId], (err, result) => {
    if (err) throw err;
    if (result?.length > 0) {
      return res.send(result);
    }
  });
});

router.get("/getBookings/:tableId", (req, res) => {
  const { tableId } = req.params;

  const query =
    "SELECT * FROM `booking` INNER JOIN slots ON booking.slotId = slots.slotId WHERE booking.tableId = ? AND booking.bookingDate >= ?";
  const dateObject = new Date();
  const date = `${dateObject.getDate()}`.padStart(2, 0);
  const month = `${dateObject.getMonth()}`.padStart(2, 0);
  const year = dateObject.getFullYear();
  const dateString = `${month}/${date}/${year}`;

  sql.query(query, [tableId, dateString], (err, result) => {
    console.log(result);
    if (err) throw err;
    if (result?.length > 0) {
      return res.send(result);
    } else {
      res.send([]);
    }
  });
});

router.get("/getTableByRestaurantId/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const query =
    "SELECT * FROM `Restaurant` INNER JOIN restaurantTable on restaurantTable.restaurantId = Restaurant.`Restaurant Id` where `Restaurant Id` = ?";
  sql.query(query, [restaurantId], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.send(result);
    }
  });
});

router.post("/addEmployee", (req, res) => {
  const { employeeId, employeeName, restaurantId, password } = req.body;
  const query =
    "INSERT INTO `employee`(`employeeId`, `employeeName`, `restaurantId`, `password`) VALUES (?,?,?,?)";
  sql.query(
    query,
    [employeeId, employeeName, restaurantId, password],
    (err, result) => {
      if (err) throw err;
      if (result) return res.send(result);
    }
  );
});

module.exports = router;
