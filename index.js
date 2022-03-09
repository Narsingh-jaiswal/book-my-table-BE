const express = require("express");
const app = express();
const mySql = require("mysql");
const razorPay = require("./Routes/Razorpay/createOrder");
const restaurant = require("./Routes/Restaurant");
const booking = require("./Routes/Booking");
const menu = require("./Routes/ManageMenu");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app).listen(3000);
const { createSocketConnection } = require("./socketIo");

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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  createSocketConnection(io, socket, socket.id);
});

app.use(express.json());
app.use(cors());
app.use("/razorpay", razorPay);
app.use("/restaurant", restaurant);
app.use("/booking", booking);
app.use("/menu", menu);

app.get("/", (req, res) => {
  res.send("express working");
});

app.post("/signUp", (req, response) => {
  const { name, email, password, contact, address } = req.body;
  const query =
    "INSERT INTO `user` (`name`, `email`, `password`, `profileURL`, `contact`, `address`) VALUES (?, ?, ?, '', ?, ?)";
  sql.query(query, [name, email, password, contact, address], (err, result) => {
    if (err) throw err;
    if (result) {
      return response.send(result);
    }
  });
});

app.post("/login", (req, response) => {
  const { email, password } = req.body;
  const query = "select * from user where email= ? AND password= ?";
  sql.query(query, [email, password], (err, res) => {
    if (res?.length === 0) {
      return response.send({ message: "Invalid User" });
    }
    return response.send(res);
  });
});

app.post("/employeeLogin", (req, response) => {
  const { email, password } = req.body;
  const query = "select * from employee where employeeId= ? AND password= ?";
  sql.query(query, [email, password], (err, res) => {
    if (res?.length === 0) {
      return response.send({ message: "Invalid User" });
    }
    return response.send(res);
  });
});

app.put("/update", (req, response) => {
  const { name, email, password, contact, address } = req.body;
  const query =
    "UPDATE `user` SET name=?,email=?,password=?,contact=?,address=? WHERE email = ?";
  sql.query(
    query,
    [name, email, password, contact, address, email],
    (err, res) => {
      if (err) throw err;
      if (res) {
        return response.send(res);
      }
      return response.send({ message: "error while update" });
    }
  );
});
