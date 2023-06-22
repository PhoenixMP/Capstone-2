"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

//put this in later! 
// const { authenticateJWT } = require("./middleware/auth");


const songsRoutes = require("./songs/routes/songs");
const tracksRoutes = require("./songs/routes/tracks");


// const usersAuthRoutes = require("./users/routes/auth");
// const usersProfileRoutes = require("./users/routes/profile");
// const usersMelodyRoutes = require("./users/routes/melody");
// const usersGameScoreRoutes = require("./users/routes/gameScore");
// const usersGameSongRoutes = require("./users/routes/gameSong");


const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// put this in later
// app.use(authenticateJWT);


app.use("/songs", songsRoutes);
app.use("/tracks", tracksRoutes);



/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
