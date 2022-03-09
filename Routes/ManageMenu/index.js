const router = require("express").Router();
const shortId = require("shortid");
const mySql = require("mysql");

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

router.get("/getAllMenu/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const query =
    "SELECT `MenuID`, `restaurantID` FROM `Menu` WHERE restaurantID = ?";
  sql.query(query, [restaurantId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.post("/addMenu", (req, res) => {
  const { restaurantId } = req.body;
  const menuId = shortId.generate();
  const query = "INSERT INTO `Menu`(`MenuID`, `restaurantID`) VALUES (?,?)";
  sql.query(query, [menuId, restaurantId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(menuId);
  });
});

router.post("/addCategory", (req, res) => {
  const { name, menuId } = req.body;
  console.log({ menuId });
  const query =
    "INSERT INTO `category`(`menuId`, `type`, `categoryId`) VALUES (?,?,?)";
  sql.query(query, [menuId, name, shortId.generate()], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.get("/getAllCategoryByMenuId/:menuId", (req, res) => {
  const { menuId } = req.params;
  const query = "SELECT * FROM `category` WHERE menuId = ?";
  sql.query(query, [menuId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

router.post("/addItem", (req, res) => {
  const { categoryId, menuId, name, price } = req.body;
  const query =
    "INSERT INTO `item`(`itemName`, `categoryId`, `MenuId`, `price`, `itemId`) VALUES (?,?,?,?,?)";
  sql.query(
    query,
    [name, categoryId, menuId, price, shortId.generate()],
    (err, result) => {
      if (err) throw err;
      if (result) res.send(result);
    }
  );
});

router.get("/getAllItems/:categoryId/:menuId", (req, res) => {
  const { categoryId, menuId } = req.params;
  const query = "SELECT * FROM `item` WHERE categoryId= ? AND MenuId = ?";
  sql.query(query, [categoryId, menuId], (err, result) => {
    if (err) throw err;
    if (result) return res.send(result);
  });
});

module.exports = router;
