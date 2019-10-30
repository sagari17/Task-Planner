const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

// create user -------------------------------------------------------------------
router.post("/", async function(req, res, next) {
  let data = req.body;

  let hash = bcrypt.hashSync(data.password, 10);
  let userData = [data.firstname, data.lastname, data.email, hash];

  try {
    let result = await db.createUser(userData);

    if (result.length > 0) {
      res.status(200).json({ msg: "Insert OK" });
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// get user by id ----------------------------------------------------------------
router.get("/:userID", async function(req, res, next) {
  try {
    let user = await db.getUserByID(req.params.userID);
    if (user) {
      res.status(200).json(user);
    } else {
      throw "User does not exist.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// delete user -------------------------------------------------------------------
router.delete("/:userID", async function(req, res, next) {
  try {
    let result = await db.deleteUser(req.params.userID);

    if (result.length > 0) {
      res.status(200).json({ msg: "Delete OK" });
    } else {
      throw "Delete failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
