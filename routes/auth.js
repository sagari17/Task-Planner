const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const secret = "frenchfriestastegood!"; //for tokens - should be stored as an environment variable
const jwt = require("jsonwebtoken");
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

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
    res.status(500).json({ error: err });
  }
});

module.exports = router;
