const express = require("express");
const path = require("path");
const open = require("open");

/* eslint-disable no-console */

const port = 5000;
const app = express();

app.get("/client-auth-ui", function(req, res) {
  const file = path.join(__dirname, "/client-auth-ui.html");
  console.log(file);
  res.sendFile(file);
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open("http://localhost:" + port);
  }
});
