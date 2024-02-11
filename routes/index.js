const express = require("express");
const router = express.Router();
const fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  fs.readFile("./subway_game_react/build/index.html", (err, data) => {
    if (err) {
      res.send("react error");
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    }
  });
});

router.post("/api/test", function (req, res, next) {
  console.log("------------");
  console.log(req.body.test);
  console.log("------------");
  res.json("api test");
});

module.exports = router;
