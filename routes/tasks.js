const express = require("express");
const router = express.Router();
const dbURI =
  "postgres://svweyjmwncotvj:25a12ff7cfdd88ea11943cb8438b4383ca6c9ea96fb8783a1e5968db1cd8b2e7@ec2-107-20-244-40.compute-1.amazonaws.com:5432/ddoducrh03dt9u" +
  "?ssl=true"; //get from heroku postgres settings URI
const db = require("../modules/db")(process.env.DATABASE_URL || dbURI);

router.get("/", function() {});
// create task-------------------------------------------------
router.post("/", async function(req, res, next) {
  let task = req.body;

  let taskData = [
    task.name,
    task.date,
    task.tag,
    task.user,
    task.finished,
    task.listid
  ];
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

// create several tasks -------------------------------------------------
router.post("/createSeveralTasks", async function(req, res, next) {
  let tasks = req.body;
  try {
    let result = await db.createSeveralTasks(tasks);
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

// Get all tasks by certain list id --------------------------------------
router.get("/:listID", async function(req, res, next) {
  try {
    let tasks = await db.getTasksByListID(req.params.listID);
    if (tasks) {
      res.status(200).json(tasks);
    } else {
      throw "No tasks exist.";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Delete single task by certain task id --------------------------------------
router.delete("/:taskID", async function(req, res, next) {
  try {
    let result = await db.deleteTask(req.params.taskID);

    if (result.length > 0) {
      res.status(200).json({ msg: "Deleted the task!" });
    } else {
      throw "Failed to delete the task!";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Update task with certain task id --------------------------------------
router.patch("/", async function(req, res, next) {
  console.log("inside patch task ");
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

// Get all tasks by several list ids --------------------------------------
router.get("/alltasks/:listIDS", async function(req, res, next) {
  try {
    let ids = req.params.listIDS;
    let listIDS = ids.split(",");
    let tasks = await db.getTasksByListIDs(listIDS);
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
