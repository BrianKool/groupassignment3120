require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const apiRouter = require("./controllers/api"); 

const app = express();

console.log("Path is: " + path.join(process.cwd(), "build/index.html"));

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(apiRouter);

app.get("/*", function (req, res) {
    res.sendFile(path.join(process.cwd(), "build/index.html"), function (err) {
      if (err) {
        console.log("Path is: " + path.join(process.cwd(), "build/index.html"));
        res.status(500).send(err);
      }
    });
  });

module.exports = app