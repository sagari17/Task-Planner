const express = require("express");
const router = express.Router();
const db = require("./modules/db")(process.env.dbconnection);

router.get("/", function(req, res, next) {
  console.log("hello from users");
});

router.get("/:userID", function(req, res, next) {
  console.log("hello from users");

  let user = db.getUser(req.body.userID);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
