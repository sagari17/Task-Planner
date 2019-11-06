const express = require("express");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

router.get("/", function() {
  
});
// create task-------------------------------------------------
router.post("/", async function(req, res, next) {
  let task = req.body;

  let taskData = [task.name, task.date, task.tag, task.assign, task.finished, task.listid];
  console.log(taskData);
  try {
    let result = await db.createTask(taskData);
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


module.exports = router;
