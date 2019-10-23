const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./modules/db")(process.env.dbconnection);
const DEFAULT_PORT = 8080;

const listRoutes = require("./routes/lists");
const userRoutes = require("./routes/users");

app.use("/list", listRoutes);

app.use("/listID", listRoutes);

app.use("/users/:userID", userRoutes);

//should not be index files!! ->routes; lessens the probability of getting conflicts
//enables adding/removing things without getting in each other's way
app.get("/user/:userID", function(req, res, next) {
  let user = db.getUser(req.body.userID);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
});
