const express = require("express");
const router = express.Router();
const protectEndpoints = require("../modules/authEndpoints");
const db = require("../modules/db")(
  process.env.DATABASE_URL || require("../modules/database")
);

router.post("/", protectEndpoints);
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
  try {
    let result = await db.createTask(taskData);
    if (result.length > 0) {
      res.status(200).json({ msg: "Insert OK" });
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/createSeveralTasks", protectEndpoints);
// create several tasks -------------------------------------------------
router.post("/createSeveralTasks", async function(req, res, next) {
  let tasks = req.body;
  try {
    let result = await db.createSeveralTasks(tasks);
    if (result.length > 0) {
      res.status(200).json({ msg: "Insert OK" });
    } else {
      throw "insert failed";
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get("/tasksByOneID/:listID/:tag", protectEndpoints);
// Get all tasks by certain list id (and task; add "None" if there should be not tag condition) ---------------
router.get("/tasksByOneID/:listID/:tag", async function(req, res, next) {
  try {
    let values = [req.params.listID, req.params.tag];
    let tasks = await db.getTasksByListID(values);
    if (tasks) {
      res.status(200).json(tasks);
    } else {
      throw "Couldn't get tasks.";
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get("/tasksByOneID/:listID/date/:date", protectEndpoints);
// Get all tasks by certain list id (and task; add "None" if there should be not tag condition) ---------------
router.get("/tasksByOneID/:listID/date/:date", async function(req, res, next) {
  try {
    let values = [req.params.listID, req.params.date];
    let tasks = await db.filterTasksByDate(values);
    if (tasks) {
      res.status(200).json(tasks);
    } else {
      throw "No tasks exist.";
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.delete("/:taskID", protectEndpoints);
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
    res.status(500).json({ msg: err });
  }
});

router.patch("/", protectEndpoints);
// Update task with certain task id --------------------------------------
router.patch("/", async function(req, res, next) {
  try {
    let tasks = await db.updateTask(req.body);
    if (tasks) {
      res.status(200).json({ msg: "Changes Saved" });
    } else {
      throw "Task could not be updated.";
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get("/allTasksBySeveralIDS/:listIDS", protectEndpoints);
// Get all tasks by several list ids --------------------------------------
router.get("/allTasksBySeveralIDS/:listIDS", async function(req, res, next) {
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
    res.status(500).json({ msg: err });
  }
});

router.patch("/finished", protectEndpoints);
// Updates finished column to opposite of current value by task id ---------------
router.patch("/finished", async function(req, res, next) {
  try {
    let task = await db.taskChangeFinished(req.body);
    if (task) {
      res.status(200).json({ msg: "Changes Saved" });
    } else {
      throw "Task could not be updated.";
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
