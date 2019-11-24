const express = require("express");
const router = express.Router();
const protectEndpoints = require("../modules/authEndpoints");
const db = require("../modules/db")(process.env.DATABASE_URL);

router.post("/", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.post("/member/", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.delete("/member/", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.get("/member/:listID", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.get("/:userID", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.get("/all/:userID", protectEndpoints);
// Get all lists and lists that user are member of by certain userID ---------------------------------
router.get("/all/:userID", async function(req, res, next) {
  try {
    let lists = await db.getAllListsByUserID(req.params.userID);
    if (lists) {
      res.status(200).json(lists);
    } else {
      throw "No lists exist.";
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get("/view/:listID", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.delete("/:listID", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.patch("/", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
