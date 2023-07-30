"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

let DB_URI_info = {
  user: 'phoenixp',
  host: 'localhost',
  port: 5432,
  password: '2EN*cn5@9Dpf'
}

const API_token = "*EJi2&bqVvJ06QRSqV^*8@MpjN9#It5M1C2cu$cNypg7Qz9SJ3"

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;



module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  DB_URI_info,
  API_token
};