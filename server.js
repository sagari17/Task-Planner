const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dbURI =
  "postgres://viukghymypsztj:e13712e3d8266f3239affc1b903e2764c2a696cd33441942f4d5018ed24101e3@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/dt1crf26no21t" +
  "?ssl=true"; //get from heroku postgres settings URI
const connString = process.env.DATABASE_URL || dbURI;
const db = require("./modules/db")(connString);
const DEFAULT_PORT = 8080;

const lists = require("./routes/lists");
const users = require("./routes/users");
const tasks = require("./routes/tasks");
const auth = require("./routes/auth");

app.use("/users", users);
app.use("/lists", lists);
app.use("/tasks", tasks);
app.use("/tasks", auth);

//should not be in index files!! -> routes; lessens the probability of getting conflicts
//enables adding/removing things without getting in each other's way
app.get("/user/:userID", function(req, res, next) {
  let user = db.getUser(req.body.userID);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).end();
  }
});
