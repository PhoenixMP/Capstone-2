"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY

const PORT = +process.env.PORT || 3002;

let DB_URI_info_1 = {
  user: (process.env.USER_1),
  host: (process.env.HOST),
  password: (process.env.PASSWORD_1),
  ssl: {
    rejectUnauthorized: false
  }
}

let DB_URI_info_2 = {
  user: (process.env.USER_2),
  host: (process.env.HOST),
  password: (process.env.PASSWORD_2),
  ssl: true,
  sslmode: 'require'
}

const API_token = process.env.API_TOKEN

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;



module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  DB_URI_info_1,
  DB_URI_info_2,
  API_token
};