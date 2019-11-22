const jwt = require("jsonwebtoken");
const secret = "frenchfriestastegood!";

const protectEndpoints = function(req, res, next) {
  console.log("authorizing");
  console.log(req);
  let token = req.headers["authorization"];

  if (token) {
    try {
      let legit = jwt.verify(token, secret);
      console.log(legit);
      next();
    } catch (err) {
      res.status(403).json({ msg: "Not a valid token" });
    }
  } else {
    res.status(403).json({ msg: "No token" });
  }
};

module.exports = protectEndpoints;
