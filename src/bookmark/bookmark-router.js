const express = require("express");

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
    //implemetation
  })
  .post(bodyParser, (req, res) => {
    //implementation
  });

bookmarkRouter
  .route("/bookmark/:id")
  .get((req, res) => {
    //implementation
  })
  .delete((req, res) => {
    //implementation
  });

module.exports = bookmarkRouter;
