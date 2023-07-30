"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");


const { authenticateJWT } = require("./middleware/auth");


const songsRoutes = require("./songs/routes/songs");
const userRoutes = require("./users/routes/users");
const authRoutes = require("./users/routes/auth");
const scoreRoutes = require("./users/routes/scores");


const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));


app.use(authenticateJWT);


app.use("/songs", songsRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/scores", scoreRoutes);

app.get("/", (req, res) => {


  let result = "hello"

  return res.send(result);
})


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
