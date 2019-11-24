const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const secret = process.env.SECRET || require("../modules/secret"); //for tokens
const jwt = require("jsonwebtoken");
const db = require("../modules/db")(
  process.env.DATABASE_URL || require("../modules/database")
);

// login user -------------------------------------------------------------------
router.post("/", async function(req, res) {
  let loginData = req.body;
  try {
    let result = await db.getUserByEmail(loginData.email);
    if (result.length == 0) {
      res.status(400).json({ msg: "User does not exist" });
    } else {
      let check = bcrypt.compareSync(loginData.password, result[0].password);
      if (check == true) {
        let payload = { userid: result[0].id };
        let tok = jwt.sign(payload, secret, { expiresIn: "12h" }); //create token
        res.status(200).json({
          email: result[0].email,
          userid: result[0].id,
          token: tok
        });
      } else {
        res.status(400).json({ msg: "Wrong password" });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
