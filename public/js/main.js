var http = require("http");
var fs = require("fs");
var url = require("url");
const PORT = process.env.PORT || 5000;

//------------db
const db = require(".modules/db.js")(process.env.dbConnection);
app.get("/user/:userID", function(req, res, next) {
  let user = db.getUser(req.body.userID);
  res.json(user);
});

http
  .createServer(function(req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    if (filename == "./") {
      filename = "./index";
    }

    filename = filename + ".html";

    console.log(filename);

    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end("404 Not Found");
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  })
  .listen(PORT);

console.log("Server listening on port " + PORT + "...");
