const express = require("express");
const router = express.Router();

router.get("/:userID", async function(req, res, next) {
  console.log("Show the list");

  let list = await db.getListsByUserID(req.params.userID);
  console.log(list);
  if (list) {
    res.status(200).json(list);
  } else {
    res.status(404).end();
  }
});
module.exports = router;


