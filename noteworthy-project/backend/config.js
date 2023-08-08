"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY

const PORT = +process.env.PORT || 3002;

//database for songs
let general_DB_URI = (process.env.general_DB_URI)

//database for users and scores
let user_DB_URI = (process.env.user_DB_URI)


const API_token = process.env.API_TOKEN

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;



module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  general_DB_URI,
  user_DB_URI,
  API_token
};