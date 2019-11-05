const express = require("express");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

router.post("/", async function(req, res, next) {
  let data = req.body;

  let userData = [data.name, data.owner, data.public];

  try {
    let result = await db.createList(userData);
    console.log(result);
    console.log(result.length);
    if (result.length > 0) {
      res.status(200).json({ msg: "Insert OK" });
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:userID", async function(req, res, next) {
  try {
    let user = await db.getListByUserID(req.params.userID);
    if (user) {
      res.status(200).json(user);
    } else {
      throw "No lists exist.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// delete list -------------------------------------------------------------------
router.delete("/:listID", async function(req, res, next) {
  try {
    let result = await db.deleteList(req.params.listID);

    if (result.length > 0) {
      res.status(200).json({ msg: "Deleted the List!" });
    } else {
      throw "Failed to delete the list!";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


module.exports = router;
