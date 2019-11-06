const express = require("express");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

router.get("/", function() {
  //sthg
});
router.get("/:listID", async function(req, res, next) { // Get all tasks connected to list id
  try {
    let tasks = await db.getTaskByListID(req.params.listID);
    if (tasks) {
      res.status(200).json(tasks);
    } else {
      throw "No tasks exist.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
router.delete("/:taskID", async function(req, res, next) { // Delete task by task id
  try {
    let result = await db.deleteTask(req.params.listID);

    if (result.length > 0) {
      res.status(200).json({ msg: "Deleted the task!" });
    } else {
      throw "Failed to delete the task!";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
router.patch("/", async function(req, res, next) { 
  console.log("inside patch user ");
  console.log(req.body);
  try {
    let task = await db.updateTask(req.body);
    if (task) {
      res.status(200).json({ msg: "Changes Saved" });
    } else {
      throw "Task could not be updated.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});


module.exports = router;
