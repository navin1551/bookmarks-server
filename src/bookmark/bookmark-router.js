const express = require("express");
const uuid = require("uuid/v4");
const logger = require("../logger");
const { bookmarks } = require("../store");

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
    //implemetation
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    //implementation
    for (const field of ["title", "url", "rating"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`${field} is required`);
      }
    }

    const { title, url, rating, desc } = req.body;

    if (!title) {
      logger.error("Title is required");
      return res.status(400).send("Invalid data");
    }

    if (!url) {
      logger.error("Url is required");
      return res.status(400).send("Invalid data");
    }

    if (!desc) {
      logger.error("Desc is required");
      return res.status(400).send("Invalid data");
    }

    const id = uuid();

    const bookmark = {
      id,
      title,
      url,
      rating,
      desc
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with bookmark ${id} created`);

    res
      .status(201)
      .location(`http://localhost.8000/bookmark/${id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route("/bookmark/:id")
  .get((req, res) => {
    //implementation
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found`);
      return res.status(404).send("Bookmark not found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    //implementation
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(li => li.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(400).send("Not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`);
    res.status(204).end();
  });

module.exports = bookmarkRouter;
