const express = require("express");
const app = express.Router();
const db = require("./modules/db")(process.env.dbconnection);

route.get("/user/:userID", function(req, res, next) {
  let user = db.getUser(req.body.userID);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
});
