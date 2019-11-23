const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const protectEndpoints = function(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    try {
      jwt.verify(token, secret);
      next();
    } catch (err) {
      res.status(403).json({ msg: "Not a valid token" });
    }
  } else {
    res.status(403).json({ msg: "No token" });
  }
};

module.exports = protectEndpoints;
