const express = require("express");
const cors = require("cors"); //when the clients aren't on the server
const bodyParser = require("body-parser");
const app = express();

const lists = require("./routes/lists");
const users = require("./routes/users");
const tasks = require("./routes/tasks");
const auth = require("./routes/auth");

// middleware ------------------------------------
app.use(cors()); //allow all CORS requests
app.use(express.json()); //for extracting json in the request-body
app.use("/", express.static("public")); //for serving client files

app.use("/users", users);
app.use("/lists", lists);
app.use("/tasks", tasks);
app.use("/auth", auth);

// start server -----------------------------------
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Server listening on port 3000!");
});
