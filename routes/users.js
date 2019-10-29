const express = require("express");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

router.get("/", async function(req, res, next) {
  try {
    let user = await db.getUser(1);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
  }
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
