const shortId = require("shortid");
const mySql = require("mysql");
const Razorpay = require("razorpay");

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

const router = require("express").Router();

router.post("/createPlan", (req, res) => {
  const { planName, amount, validDate } = req.body;
  const query =
    "INSERT INTO `plans`(`Plan Name`, `Plan ID`, `Plan Amount`,`validDate`) VALUES (?,?,?,?)";
  sql.query(
    query,
    [planName, shortId.generate(), amount, validDate],
    (err, value) => {
      if (err) throw err;
      if (value) {
        return res.send("Plan Added Successfully");
      }
      return res.send("Failed to Add Plan");
    }
  );
});

router.get("/getPlans/", (req, response) => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  const dateStr = `${year}-${month}-${day}`;
  const query = "SELECT * FROM `plans` WHERE validDate >= ?";

  sql.query(query, [dateStr], (err, res) => {
    if (err) throw err;
    if (res) return response.send(res);
    return response.send("failed to fetch plans");
  });
});

router.post("/createOrder", async (req, res) => {
  const razorpay = new Razorpay({
    key_id: "rzp_test_Oza0Wpn27TeWiC",
    key_secret: "QLKHEcQZU132UtK2vk4XiEMa"
  });

  const options = {
    amount: req.body.amount * 100,
    receipt: shortId.generate(),
    currency: "INR"
  };

  try {
    const response = await razorpay.orders.create(options);
    return res.send(response);
  } catch (error) {
    console.log({ error });
  }
});

module.exports = router;
