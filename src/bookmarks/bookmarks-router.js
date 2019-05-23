const path = require("path");
const express = require("express");
const xss = require("xss");
const uuid = require("uuid/v4");
const logger = require("logger");
const { bookmarks } = require("../store");
const BookmarksService = require("./bookmarks-service");

const bookmarksRouter = express.Router();
const jsonParser = express.json();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: Number(bookmark.rating)
});

bookmarksRouter
  .route("/")
  .get((req, res, next) => {
    //implementation
    const knexInstance = req.app.get("db");
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    //implementation
    let { title, url, rating, description } = req.body;
    rating = parseInt(rating);

    console.log(req.body);
    if (!title) {
      //logger.error("Title is required");
      return res.status(400).send({
        error: { message: `Missing 'title' in request body` }
      });
    }

    if (!url) {
      //logger.error("Url is required");
      return res.status(400).send({
        error: { message: `Missing 'url' in request body` }
      });
    }

    if (!rating) {
      //logger.error("Rating is required");
      return res.status(400).send({
        error: { message: `Missing 'rating' in request body` }
      });
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      //logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send({
        error: { message: `'rating' must be a number between 0 and 5` }
      });
    }

    const newBookmark = { title, description, url, rating };

    BookmarksService.insertBookmark(req.app.get("db"), newBookmark)
      .then(bookmark => {
        //logger.info(`Bookmark with bookmark ${id} created`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
          .json(serializeBookmark(bookmark));
      })
      .catch(next);
  });

bookmarksRouter
  .route("/:id")
  .all((req, res, next) => {
    //implementation
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    BookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          //logger.error(`Bookmark with id ${id} not found`);
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    //implementation
    const { id } = req.params;
    /*
    const bookmarkIndex = bookmarks.findIndex(li => li.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(400).send("Not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`);*/
    BookmarksService.deleteBookmark(req.app.get("db"), id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const bookmarkToUpdate = { title, url, description, rating };

    const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0) {
      //logger.error(`Invalid update without required fields`);
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'url', 'description' or 'rating'`
        }
      });
    }

    BookmarksService.updateBookmark(
      req.app.get("db"),
      req.params.id,
      bookmarkToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarksRouter;
