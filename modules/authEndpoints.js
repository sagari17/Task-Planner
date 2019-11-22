const jwt = require("jsonwebtoken");
const secret = "frenchfriestastegood!";

const protectEndpoints = function(req, res, next) {
  console.log("authorizing");
  console.log(req.headers["authorization"]);
  let token = req.headers["authorization"];
  console.log();

  if (token) {
    if (token != "publiclist") {
      try {
        jwt.verify(token, secret);
        next();
      } catch (err) {
        res.status(403).json({ msg: "Not a valid token" });
      }
    } else {
      next();
    }
  } else {
    res.status(403).json({ msg: "No token" });
  }
};

module.exports = protectEndpoints;
