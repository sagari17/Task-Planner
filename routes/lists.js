const express = require("express");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

// create list -----------------------------------------------------
router.post("/", async function(req, res, next) {
  let data = req.body;

  let userData = [data.name, data.owner, data.public];

  try {
    let result = await db.createList(userData);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
// add members -----------------------------------------------------
router.post("/member/", async function(req, res, next) {
  let data = req.body;


  try {
    let result = await db.addManyMembers(data);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
// Delete members -----------------------------------------------------
router.delete("/member/", async function(req, res, next) {
  let data = req.body;
  try {
    let result = await db.deleteManyMembers(data);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
// get members by list-----------------------------------------------------
router.get("/member/:listID", async function(req, res, next) {
  //let data = req.body;

  //let userData = [data.list_id, data.user_id];
  try {
    let members = await db.getMembersOfList(req.params.listID);
    if (members) {
      res.status(200).json(members);
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get all lists by certain userID ---------------------------------
router.get("/:userID", async function(req, res, next) {
  try {
    let lists = await db.getListsByUserID(req.params.userID);
    if (lists) {
      res.status(200).json(lists);
    } else {
      throw "No lists exist.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get all lists and lists that user are member of by certain userID ---------------------------------
router.get("/all/:userID", async function(req, res, next) {
  try {
    let lists = await db.getAllListByUserID(req.params.userID);
    if (lists) {
      res.status(200).json(lists);
    } else {
      throw "No lists exist.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get single list by listID ----------------------------------------
router.get("/view/:listID", async function(req, res, next) {
  try {
    let list = await db.getListByListID(req.params.listID);
    if (list) {
      res.status(200).json(list[0]);
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

// update list -------------------------------------------------------------------
router.patch("/", async function(req, res, next) {
  try {
    let list = await db.updateList(req.body);
    if (list) {
      res.status(200).json(list);
    } else {
      throw "List could not be updated.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
